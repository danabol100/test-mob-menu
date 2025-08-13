// script-page3.js
// ===========================
// 📦 Мини-корзина и карточка товара
// ===========================
document.addEventListener('DOMContentLoaded', function () {
    // ---------- Утилиты ----------
    function qs(sel, root) {
        return (root || document).querySelector(sel);
    }
    function qsa(sel, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    }

    // Найти иконку корзины (сначала мобильную, потом десктопную)
    function getCartIconEl() {
        return document.getElementById('mini-cart-mob') || document.getElementById('mini-cart');
    }

    // Пульсация иконки после прилёта
    function pulse(el) {
        if (!el || typeof el.animate !== 'function') return;
        el.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }],
            { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }
        );
    }

    // Полёт от кнопки к иконке корзины (только на мобилке)
    function flyToCart(fromBtn) {
        if (window.innerWidth > 1024) return;                // только моб/планшет
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const target = getCartIconEl();
        if (!fromBtn || !target) return;

        const br = fromBtn.getBoundingClientRect();
        const tr = target.getBoundingClientRect();

        const startX = br.left + br.width / 2;
        const startY = br.top + br.height / 2;
        const endX = tr.left + tr.width / 2;
        const endY = tr.top + tr.height / 2;

        const dot = document.createElement('div');
        dot.className = 'fly-dot';
        // ставим в стартовую точку (через translate будем двигать)
        dot.style.transform = `translate(${startX - 7}px, ${startY - 7}px)`;
        document.body.appendChild(dot);

        // небольшой «дугой» вверх: mid-точка выше, чем старт/финиш
        const midX = (startX + endX) / 2;
        const midY = Math.min(startY, endY) - Math.abs(endX - startX) * 0.30;

        const dx1 = midX - startX;
        const dy1 = midY - startY;
        const dx2 = endX - startX;
        const dy2 = endY - startY;

        const anim = dot.animate(
            [
                { transform: `translate(${startX - 7}px, ${startY - 7}px) scale(1)`, opacity: 1, offset: 0 },
                { transform: `translate(${startX - 7 + dx1}px, ${startY - 7 + dy1}px) scale(.9)`, opacity: .9, offset: 0.5, easing: 'cubic-bezier(.2,.7,.3,1)' },
                { transform: `translate(${startX - 7 + dx2}px, ${startY - 7 + dy2}px) scale(.2)`, opacity: 0, offset: 1 }
            ],
            { duration: 1000, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
        );

        anim.onfinish = function () {
            dot.remove();
            pulse(target);
        };
    }


    // ---------- Мини-корзина ----------
    function readCart() {
        try {
            var data = localStorage.getItem('cart');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
    function writeCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        // локальные апдейты
        updateMiniCart();
        // если где-то слушают это событие — уведомим
        try { document.dispatchEvent(new Event('cart:updated')); } catch (e) { }
    }
    function getCount(cart) {
        return cart.reduce(function (sum, item) { return sum + (Number(item.qty) || 0); }, 0);
    }
    function updateMiniCart() {
        var cart = readCart();
        var count = getCount(cart);

        var pairs = [
            { box: document.getElementById('mini-cart'), badge: document.getElementById('mini-cart-count') },
            { box: document.getElementById('mini-cart-mob'), badge: document.getElementById('mini-cart-count-mob') }
        ];
        pairs.forEach(function (p) {
            if (!p.box || !p.badge) return;
            p.box.style.display = '';
            p.badge.textContent = count > 0 ? String(count) : '';
        });
    }

    // ---------- Хелперы для кнопки "В корзину" ----------
    function isInCart(name, size) {
        var cart = readCart();
        return cart.some(function (i) { return i.name === name && i.size === size; });
    }
    function setAddBtnState(btn, inCart) {
        if (!btn) return;
        if (inCart) {
            btn.textContent = 'Додано';
            btn.disabled = true;
            btn.classList.add('in-cart');
        } else {
            btn.textContent = 'В корзину';
            btn.disabled = false;
            btn.classList.remove('in-cart');
        }
    }
    function syncAddBtnBySelectedSize(btn) {
        var selectedBtn = qs('.main_page3_size.selected');
        var selectedSize = selectedBtn ? (selectedBtn.textContent || '').trim() : '';
        var nameEl = qs('.main_page_title');
        var name = nameEl ? (nameEl.textContent || '').trim() : 'Без названия';

        if (!selectedSize) {
            setAddBtnState(btn, false);
            return;
        }
        setAddBtnState(btn, isInCart(name, selectedSize));
    }

    // ---------- Мобильное меню ----------
    var burger = qs('.burger');
    var closeBtn = qs('.close');
    var menu = qs('.mob_content');
    var closeNav = qs('[close-nav]');
    var year = qs('.logo_desc1');
    var yearRemove = qs('.logo_desc12');

    function handleViewportChange() {
        if (window.innerWidth <= 479) {
            if (year) year.classList.add('hidden');
            if (yearRemove) yearRemove.classList.remove('hidden');
        } else {
            if (year) year.classList.remove('hidden');
            if (yearRemove) yearRemove.classList.add('hidden');
        }
    }
    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);

    if (burger && closeBtn && menu) {
        burger.addEventListener('click', function () {
            burger.classList.add('hidden');
            closeBtn.classList.remove('hidden');
            menu.classList.remove('hidden');
        });
        closeBtn.addEventListener('click', function () {
            burger.classList.remove('hidden');
            closeBtn.classList.add('hidden');
            menu.classList.add('hidden');
        });
        document.addEventListener('click', function (e) {
            if (!menu.contains(e.target) && !burger.contains(e.target) && !closeBtn.contains(e.target)) {
                menu.classList.add('hidden');
                closeBtn.classList.add('hidden');
                burger.classList.remove('hidden');
            }
        });
        if (closeNav) {
            closeNav.addEventListener('click', function () {
                menu.classList.add('hidden');
                closeBtn.classList.add('hidden');
                burger.classList.remove('hidden');
            });
        }
    }

    // ---------- Табы (если есть) ----------
    var btnSize = document.getElementById('btn_desc');
    var btnSpec = document.getElementById('btn_spec');
    var sectionSize = qs('.toggle_size');
    var sectionSpec = qs('.toggle_spec');

    if (btnSize) {
        btnSize.addEventListener('click', function () {
            if (sectionSize) sectionSize.classList.remove('hidden1');
            if (sectionSpec) sectionSpec.classList.add('hidden1');
            btnSize.classList.add('hover');
            if (btnSpec) btnSpec.classList.remove('hover');
        });
    }
    if (btnSpec) {
        btnSpec.addEventListener('click', function () {
            if (sectionSize) sectionSize.classList.add('hidden1');
            if (sectionSpec) sectionSpec.classList.remove('hidden1');
            btnSpec.classList.add('hover');
            if (btnSize) btnSize.classList.remove('hover');
        });
    }

    // ---------- Выбор размера ----------
    var sizeButtons = qsa('.main_page3_size');
    var addToCartButtons = qsa('.add-to-cart');

    sizeButtons.forEach(function (sizeBtn) {
        sizeBtn.addEventListener('click', function () {
            sizeButtons.forEach(function (b) { b.classList.remove('selected'); });
            sizeBtn.classList.add('selected');
            // пересинхронизировать ВСЕ кнопки "В корзину" (обычно одна на странице)
            addToCartButtons.forEach(function (btn) { syncAddBtnBySelectedSize(btn); });
        });
    });

    // ---------- Обработчик "В корзину" ----------
    addToCartButtons.forEach(function (btn) {
        // чтобы кнопка не сабмитила форму
        btn.setAttribute('type', 'button');
        // синхронизация состояния при загрузке
        syncAddBtnBySelectedSize(btn);

        btn.addEventListener('click', function () {
            // 1) Проверяем выбранный размер
            var selectedSizeEl = qs('.main_page3_size.selected');
            var selectedSize = selectedSizeEl ? (selectedSizeEl.textContent || '').trim() : '';
            if (!selectedSize) {
                alert('⛔ Выберите размер!');
                return;
            }

            // 2) Данные товара
            var nameEl = qs('.main_page_title');
            var name = nameEl ? (nameEl.textContent || '').trim() : 'Без названия';

            var imgEl = qs('.main_page3_gallery_item img');
            var img = imgEl ? imgEl.getAttribute('src') || '' : '';

            // Цена из .main_page3_price
            var priceEl = qs('.main_page3_price');
            var raw = priceEl ? (priceEl.textContent || '0') : '0';
            var normalized = raw.replace(/\u00A0|\u202F|\s/g, '').replace(',', '.').replace(/[^\d.]/g, '');
            var price = parseFloat(normalized);
            if (!isFinite(price)) {
                alert('Не удалось определить цену товара');
                return;
            }

            var descEl = qs('.sneakers_desc');
            var desc = descEl ? (descEl.textContent || '').trim() : '';

            // 3) Работа с корзиной
            var cart = readCart();
            var existing = cart.find(function (i) { return i.name === name && i.size === selectedSize; });

            if (existing) {
                // десктопная логика: если такой размер уже есть — увеличиваем qty
                existing.qty = (existing.qty || 1) + 1;
            } else {
                cart.push({ name: name, price: price, img: img, size: selectedSize, qty: 1, desc: desc });
            }
            writeCart(cart);

            // Если модалка уже была открыта — перерисуем (если функция существует)
            var cartModal = document.getElementById('cart-modal');
            if (cartModal && cartModal.style.display === 'block' && typeof window.renderCartModal === 'function') {
                window.renderCartModal();
            }
            if (typeof window.attachMiniCartHandlers === 'function') {
                window.attachMiniCartHandlers();
            }

            // 4) Меняем кнопку под текущий размер
            setAddBtnState(btn, true);
            // ЛИШЬ на мобилке — полёт к корзине
            flyToCart(btn);
            if (window.innerWidth <= 1024) {
                const header = document.querySelector('.header-cart');
                header?.classList.remove('header--hidden');
                header?.classList.add('force-show');

                // убираем "принудительное" состояние через 1.2 сек
                setTimeout(() => header?.classList.remove('force-show'), 1200);
            }



            // if (window.innerWidth <= 1024) {
            //     document.querySelector('header')?.classList.add('show'); // или твой класс, что включает хедер
            // }
            if (window.innerWidth <= 1024) {
                document.querySelector('.header-cart')?.classList.remove('header--hidden');
            }




            // 5) Десктоп — автопоказ допускаем, мобильные — ничего не делаем
            if (window.innerWidth > 1024) {
                if (typeof window.showCartModalIfNotEmpty === 'function') {
                    window.showCartModalIfNotEmpty();
                }
            }
        });
    });

    // ---------- Рендер модального окна корзины (если используется на странице) ----------
    var cartModal = document.getElementById('cart-modal');
    var cartItems = document.getElementById('cart-items');
    var cartTotal = document.getElementById('cart-total');

    // экспортируем закрытие, если нужно из разметки
    window.closeCart = function () {
        if (cartModal) cartModal.style.display = 'none';
    };

    window.renderCartModal = function () {
        if (!cartItems || !cartTotal) return;

        var cart = readCart();
        cartItems.innerHTML = '';
        var total = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Корзина пуста</p>';
            cartTotal.innerHTML = '';
            updateMiniCart();
            return;
        }

        cart.forEach(function (item) {
            var itemTotal = (item.price || 0) * (item.qty || 1);
            total += itemTotal;

            var itemDiv = document.createElement('div');
            itemDiv.className = 'product-in-card';
            itemDiv.innerHTML =
                '<div style="display:flex;align-items:center;gap:48px;padding:5px 0;">' +
                '<img src="' + item.img + '" style="width:55px;height:55px;object-fit:cover;margin:0 0 0 10px">' +
                '<div style="flex-grow:1;">' +
                '<div><strong>' + item.name + '</strong></div>' +
                '<div>Розмір: ' + item.size + '</div>' +
                '<div style="margin:8px 0;display:flex;align-items:center;gap:10px;">' +
                '<button class="decrease-qty qty-btn" data-name="' + item.name + '" data-size="' + item.size + '">–</button>' +
                '<span>' + item.qty + '</span>' +
                '<button class="increase-qty qty-btn" data-name="' + item.name + '" data-size="' + item.size + '">+</button>' +
                '<span>шт.</span>' +
                '</div>' +
                '<div><strong>' + itemTotal + ' грн</strong></div>' +
                '</div>' +
                '<button class="remove-item" data-name="' + item.name + '" data-size="' + item.size + '" title="Удалить">✕</button>' +
                '</div>';

            cartItems.appendChild(itemDiv);
        });

        cartTotal.innerHTML = '<strong>До сплати:</strong> ' + total + ' грн';
        setupCartControls();
    };

    function setupCartControls() {
        qsa('.remove-item').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var name = btn.getAttribute('data-name');
                var size = btn.getAttribute('data-size');
                var cart = readCart().filter(function (i) { return !(i.name === name && i.size === size); });
                writeCart(cart);
                window.renderCartModal();
                if (cart.length === 0 && cartModal) cartModal.style.display = 'none';
            });
        });

        qsa('.increase-qty').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var name = btn.getAttribute('data-name');
                var size = btn.getAttribute('data-size');
                var cart = readCart();
                var item = cart.find(function (i) { return i.name === name && i.size === size; });
                if (item) item.qty = (item.qty || 1) + 1;
                writeCart(cart);
                window.renderCartModal();
            });
        });

        qsa('.decrease-qty').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var name = btn.getAttribute('data-name');
                var size = btn.getAttribute('data-size');
                var cart = readCart();
                var item = cart.find(function (i) { return i.name === name && i.size === size; });
                if (item) {
                    if ((item.qty || 1) > 1) item.qty = item.qty - 1;
                    else cart = cart.filter(function (i) { return !(i.name === name && i.size === size); });
                }
                writeCart(cart);
                window.renderCartModal();
                if (cart.length === 0 && cartModal) cartModal.style.display = 'none';
            });
        });
    }

    // ---------- Синхронизация кнопки при внешних изменениях ----------
    window.addEventListener('storage', function (e) {
        if (e.key === 'cart') {
            qsa('.add-to-cart').forEach(function (btn) { syncAddBtnBySelectedSize(btn); });
        }
    });
    document.addEventListener('cart:updated', function () {
        qsa('.add-to-cart').forEach(function (btn) { syncAddBtnBySelectedSize(btn); });
    });

    // первичная инициализация
    updateMiniCart();
    // если модалка где-то открывается — перерисуем содержимое
    // (на этой странице можно вызвать window.renderCartModal() по необходимости)
});
