// script-page3.js

// ===========================
// 📦 Мини-корзина и корзина
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    updateMiniCart();

    // 🍔 Мобильное меню
    const burger = document.querySelector('.burger');
    const close = document.querySelector('.close');
    const menu = document.querySelector('.mob_content');
    const closeNav = document.querySelector('[close-nav]');
    const year = document.querySelector(".logo_desc1");
    const yearRemove = document.querySelector(".logo_desc12");

    function handleViewportChange() {
        if (window.innerWidth <= 479) {
            year?.classList.add('hidden');
            yearRemove?.classList.remove('hidden');
        } else {
            year?.classList.remove('hidden');
            yearRemove?.classList.add('hidden');
        }
    }

    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);

    if (burger && close && menu) {
        burger.addEventListener('click', () => {
            burger.classList.add('hidden');
            close.classList.remove('hidden');
            menu.classList.remove('hidden');
        });

        close.addEventListener('click', () => {
            burger.classList.remove('hidden');
            close.classList.add('hidden');
            menu.classList.add('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !burger.contains(e.target) && !close.contains(e.target)) {
                menu.classList.add('hidden');
                close.classList.add('hidden');
                burger.classList.remove('hidden');
            }
        });

        closeNav?.addEventListener('click', () => {
            menu.classList.add('hidden');
            close.classList.add('hidden');
            burger.classList.remove('hidden');
        });
    }

    // 🔁 Переключение вкладок
    const btnSize = document.querySelector('#btn_desc');
    const btnSpec = document.querySelector('#btn_spec');
    const sectionSize = document.querySelector('.toggle_size');
    const sectionSpec = document.querySelector('.toggle_spec');

    btnSize?.addEventListener('click', () => {
        sectionSize?.classList.remove('hidden1');
        sectionSpec?.classList.add('hidden1');
        btnSize.classList.add('hover');
        btnSpec.classList.remove('hover');
    });

    btnSpec?.addEventListener('click', () => {
        sectionSize?.classList.add('hidden1');
        sectionSpec?.classList.remove('hidden1');
        btnSize.classList.remove('hover');
        btnSpec.classList.add('hover');
    });

    // 👟 Выбор размера
    const sizeButtons = document.querySelectorAll('.main_page3_size');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // 🛒 Добавление в корзину
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedSizeBtn = document.querySelector('.main_page3_size.selected');
            const selectedSize = selectedSizeBtn?.textContent;

            if (!selectedSize) return alert("⛔ Выберите размер!");

            const name = document.querySelector('.main_page_title')?.textContent.trim() || "Без названия";
            const priceText = document.querySelector('.main_page3_price')?.textContent || "0";
            const img = document.querySelector('.main_page3_gallery_item img')?.getAttribute('src') || "";
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = cart.find(item => item.name === name && item.size === selectedSize);

            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name, price, img, size: selectedSize, qty: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateMiniCart();

            if (document.getElementById('cart-modal')?.style.display === 'block') {
                renderCartModal();
            }
        });
    });

    // 🔄 Обновление мини-корзины
    function updateMiniCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        const miniCart = document.getElementById('mini-cart');
        const countSpan = document.getElementById('mini-cart-count');

        if (cart.length === 0) {
            miniCart.style.display = 'none';
        } else {
            miniCart.style.display = 'block';
            countSpan.textContent = count;
        }
    }

    // 📦 Открытие корзины
    const miniCart = document.getElementById('mini-cart');
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    miniCart?.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) return;
        renderCartModal();
        cartModal.style.display = 'block';
    });

    // ❌ Закрытие корзины
    window.closeCart = () => {
        cartModal.style.display = 'none';
    };

    // 🧠 Рендер модального окна корзины
    function renderCartModal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Корзина пуста</p>';
            cartTotal.innerHTML = '';
            updateMiniCart();
            return;
        }

        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('product-in-card');

            itemDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 20px; padding: 10px 0;">
          <img src="${item.img}" style="width: 50px; height: 50px; object-fit: cover;">
          <div style="flex-grow:1;">
            <div><strong>${item.name}</strong></div>
            <div>Розмір: ${item.size}</div>
            <div style="margin: 8px 0; display: flex; align-items: center; gap: 10px;">
              <button class="decrease-qty qty-btn" data-name="${item.name}" data-size="${item.size}">–</button>
              <span>${item.qty}</span>
              <button class="increase-qty qty-btn" data-name="${item.name}" data-size="${item.size}">+</button>
              <span>шт.</span>
            </div>
            <div><strong>${itemTotal} грн</strong></div>
          </div>
          <button class="remove-item" data-name="${item.name}" data-size="${item.size}" title="Удалить">✕</button>
        </div>
      `;

            cartItems.appendChild(itemDiv);
        });

        cartTotal.innerHTML = `<strong>До сплати:</strong> ${total} грн`;

        setupCartControls();
    }

    function setupCartControls() {
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                const size = btn.dataset.size;
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = cart.filter(i => !(i.name === name && i.size === size));
                localStorage.setItem('cart', JSON.stringify(cart));
                updateMiniCart();
                renderCartModal();
                if (cart.length === 0) cartModal.style.display = 'none';
            });
        });

        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                const size = btn.dataset.size;
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const item = cart.find(i => i.name === name && i.size === size);
                if (item) item.qty++;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateMiniCart();
                renderCartModal();
            });
        });

        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                const size = btn.dataset.size;
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const item = cart.find(i => i.name === name && i.size === size);
                if (item && item.qty > 1) {
                    item.qty--;
                } else {
                    cart = cart.filter(i => !(i.name === name && i.size === size));
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateMiniCart();
                renderCartModal();
                if (cart.length === 0) cartModal.style.display = 'none';
            });
        });
    }
});
