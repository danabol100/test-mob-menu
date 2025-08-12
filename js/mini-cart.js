
window.attachMiniCartHandlers = attachMiniCartHandlers;

const isDesktop = () =>
    window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth > 1024;

function hideCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = 'none';
}

function getCart() {
    try {
        const raw = localStorage.getItem('cart');
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function getCount(cart) {
    return cart.reduce((sum, item) => sum + (Number(item?.qty) || 0), 0);
}

function qs(id, fallbackSelector) {
    // Пытаемся найти по id, если нет — пробуем по селектору (на всякий случай)
    return document.getElementById(id) || (fallbackSelector ? document.querySelector(fallbackSelector) : null);
}

// Собираем обе версии мини-корзины (десктоп и моб)
function getMiniCartNodes() {
    return [
        {
            box: qs('mini-cart', '.mini-cart'),
            badge: qs('mini-cart-count', '#mini-cart .mini-cart-count, .mini-cart .mini-cart-count')
        },
        {
            // для мобилки ожидается id="mini-cart-mob" и id="mini-cart-count-mob"
            box: qs('mini-cart-mob', '.mini-cart-mob'),
            badge: qs('mini-cart-count-mob', '#mini-cart-mob .mini-cart-count-mob, .mini-cart-mob .mini-cart-count-mob')
        }
    ];
}

// ---------- rendering ----------
function updateMiniCart() {
    const cart = getCart();
    const count = getCount(cart);

    getMiniCartNodes().forEach(({ box, badge }) => {
        if (!box || !badge) return;

        if (count <= 0) {
            // Прячем, если пусто
            // box.style.display = 'none';
            badge.textContent = '';
        } else {
            // Возвращаем к дефолту (пусть управляет ваш CSS)
            box.style.display = '';
            badge.textContent = String(count);
        }
    });
}

// ---------- interactions ----------
// function attachMiniCartHandlers() {
//     getMiniCartNodes().forEach(({ box }) => {
//         if (!box) return;

//         // Снимаем возможные дубликаты
//         box.removeEventListener('click', onMiniCartClick);
//         box.addEventListener('click', onMiniCartClick);
//     });
// }
function attachMiniCartHandlers() {
    getMiniCartNodes().forEach(({ box }) => {
        if (!box) return;

        // КЛИК — только для мобильных/планшетов
        box.removeEventListener('click', onMiniCartClick);
        box.addEventListener('click', onMiniCartClick);

        // HOVER — только для десктопа
        box.removeEventListener('mouseenter', onMiniCartMouseEnter);
        box.removeEventListener('mouseleave', onMiniCartMouseLeave);
        box.addEventListener('mouseenter', onMiniCartMouseEnter);
        box.addEventListener('mouseleave', onMiniCartMouseLeave);
    });

    // Наведение/уход курсора с самой модалки — чтобы не "мигала"
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.removeEventListener('mouseenter', onCartModalMouseEnter);
        modal.removeEventListener('mouseleave', onCartModalMouseLeave);
        modal.addEventListener('mouseenter', onCartModalMouseEnter);
        modal.addEventListener('mouseleave', onCartModalMouseLeave);
    }

    // При ресайзе закрываем, чтобы режимы не конфликтовали
    window.removeEventListener('resize', hideCartModal);
    window.addEventListener('resize', hideCartModal);
}


// function onMiniCartClick() {
//     const cart = getCart();
//     if (cart.length === 0) return;

//     if (typeof renderCartModal === 'function') {
//         renderCartModal();
//         const modal = document.getElementById('cart-modal');
//         if (modal) modal.style.display = 'block';
//     }
// }
// function onMiniCartClick(e) {
//     // На десктопе по клику НЕ открываем (будет hover)
//     if (isDesktop()) return;

//     const cart = getCart();
//     if (cart.length === 0) return;

//     if (typeof renderCartModal === 'function') {
//         renderCartModal();
//         const modal = document.getElementById('cart-modal');
//         if (modal) modal.style.display = 'block';
//     }
// }
// ВВЕДИ свой реальный путь к странице корзины:
const CART_PAGE = 'cart.html'; // например 'cart.html' или '/cart/index.html'

function onMiniCartClick(e) {
    const cart = getCart();

    if (isDesktop()) {
        // Десктоп: клик -> переход на страницу корзины
        // (при желании, если корзина пуста — не переходим)
        if (cart.length === 0) return;

        // закрыть возможную всплывшую модалку, чтобы не мигала перед переходом
        hideCartModal();
        window.location.href = CART_PAGE;
        return;
    }

    // Мобильные/планшеты: клик -> открываем модалку
    if (cart.length === 0) return;
    if (typeof renderCartModal === 'function') {
        renderCartModal();
        const modal = document.getElementById('cart-modal');
        if (modal) modal.style.display = 'block';
    }
}

let hoverHideTimer = null;

function showCartModalIfNotEmpty() {
    const cart = getCart();
    if (cart.length === 0) return;

    if (typeof renderCartModal === 'function') {
        renderCartModal();
        const modal = document.getElementById('cart-modal');
        if (modal) modal.style.display = 'block';
    }
}

function onMiniCartMouseEnter() {
    if (!isDesktop()) return;
    clearTimeout(hoverHideTimer);
    showCartModalIfNotEmpty();
}

function onMiniCartMouseLeave() {
    if (!isDesktop()) return;
    const modal = document.getElementById('cart-modal');
    hoverHideTimer = setTimeout(() => {
        if (!modal || !modal.matches(':hover')) hideCartModal();
    }, 200);
}

function onCartModalMouseEnter() {
    if (!isDesktop()) return;
    clearTimeout(hoverHideTimer);
}

function onCartModalMouseLeave() {
    if (!isDesktop()) return;
    const box = qs('mini-cart', '.mini-cart');
    hoverHideTimer = setTimeout(() => {
        if (!box || !box.matches(':hover')) hideCartModal();
    }, 150);
}


// ---------- wiring ----------
document.addEventListener('DOMContentLoaded', () => {
    updateMiniCart();
    attachMiniCartHandlers();
});

// Реагируем на изменения корзины из других вкладок
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') updateMiniCart();
});

// Позволяем другим скриптам сигналить об изменениях:
//   document.dispatchEvent(new Event('cart:updated'));
document.addEventListener('cart:updated', updateMiniCart);

// Экспортируем в глобальную область — вдруг пригодится где-то еще
window.updateMiniCart = updateMiniCart;
// Дать страницам удобный способ сообщить: "корзина изменилась"
window.emitCartUpdated = () => document.dispatchEvent(new Event('cart:updated'));

