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

    // 🔁 Переключение между характеристиками и размерами
    const btnSize = document.querySelector('#btn_desc');
    const btnSpecification = document.querySelector('#btn_spec');
    const sectionSize = document.querySelector('.toggle_size');
    const sectionSpec = document.querySelector('.toggle_spec');

    if (btnSize && btnSpecification && sectionSize && sectionSpec) {
        btnSize.addEventListener('click', () => {
            sectionSize.classList.remove('hidden1');
            sectionSpec.classList.add('hidden1');
            btnSize.classList.add('hover');
            btnSpecification.classList.remove('hover');
        });

        btnSpecification.addEventListener('click', () => {
            sectionSize.classList.add('hidden1');
            sectionSpec.classList.remove('hidden1');
            btnSize.classList.remove('hover');
            btnSpecification.classList.add('hover');
        });
    }

    // 👟 Выбор размера
    const sizeButtons = document.querySelectorAll('.main_page3_size');
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    // 🛒 Добавление в корзину
    const addToCartBtn = document.querySelector('.add-to-cart');

    addToCartBtn.addEventListener('click', () => {
        const selectedSizeBtn = document.querySelector('.main_page3_size.selected');
        const selectedSize = selectedSizeBtn?.textContent;

        if (!selectedSize) {
            alert("⛔ Пожалуйста, выберите размер перед добавлением в корзину.");
            return;
        }

        const name = document.querySelector('.main_page_title')?.textContent.trim() || "Без названия";
        const priceText = document.querySelector('.main_page3_price')?.textContent || "0";
        const img = document.querySelector('.main_page3_gallery_item img')?.getAttribute('src') || "";
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));

        const newItem = {
            name,
            price,
            img,
            size: selectedSize,
            qty: 1
        };

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.name === newItem.name && item.size === newItem.size);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push(newItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));



        updateMiniCart();


        if (typeof updateMiniCart === 'function') updateMiniCart();
        const miniCart = document.getElementById('mini-cart');
        if (miniCart) miniCart.style.display = 'block';

        // ✅ Обновим содержимое корзины, если она уже открыта
        if (document.getElementById('cart-modal')?.style.display === 'block') {
            renderCartModal();
        }

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

    miniCart.addEventListener('click', () => {
        renderCartModal();
        cartModal.style.display = 'block';
    });

    // ❌ Закрытие корзины
    window.closeCart = function () {
        cartModal.style.display = 'none';
    }

    // 🧠 Рендер модального окна корзины
    function renderCartModal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        cartItems.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Корзина пуста</p>';
            cartTotal.innerHTML = '';
            return;
        }

        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.style.marginBottom = '10px';
            itemDiv.style.borderBottom = '1px solid #eee';
            itemDiv.style.paddingBottom = '5px';


            itemDiv.innerHTML = `
            <div class="product-in-card">
  <div style="position: relative; display: flex; gap: 10px; align-items: center;">
    <img src="${item.img}" style="width: 50px; height: 50px; object-fit: cover;" alt="${item.name}">
    
    <div>
      <div><strong>${item.name}</strong></div>
      <div>Розмір: ${item.size}</div>
      
      <div style="margin-top: 8px; display: flex; align-items: center; gap: 10px;">
        <button class="decrease-qty qty-btn" data-name="${item.name}" data-size="${item.size}">–</button>
        <span style="min-width: 20px; text-align: center;">${item.qty}</span>
        <button class="increase-qty qty-btn" data-name="${item.name}" data-size="${item.size}">+</button>
        <span style="margin-left: 6px;">шт.</span>
      </div>

      <div style="margin-top: 5px;"><strong>${item.price * item.qty} грн</strong></div>
    </div>

    <button class="remove-item" data-name="${item.name}" data-size="${item.size}" title="Удалить"></button>
  </div>
  </div>
`;



            cartItems.appendChild(itemDiv);
        });

        cartTotal.innerHTML = `<strong>До сплаты:</strong> ${total} грн`;

        // 🗑 Удаление товара
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                const size = btn.dataset.size;

                let updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
                updatedCart = updatedCart.filter(item => !(item.name === name && item.size === size));

                localStorage.setItem('cart', JSON.stringify(updatedCart));

                if (updatedCart.length === 0) {
                    cartModal.style.display = 'none';
                    miniCart.style.display = 'none';
                }

                updateMiniCart();
                renderCartModal();
            });
        });
        // ➕ Увеличение количества
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                const size = btn.dataset.size;

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const item = cart.find(i => i.name === name && i.size === size);

                if (item) {
                    item.qty += 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateMiniCart();
                    renderCartModal();
                }
            });
        });

        // ➖ Уменьшение количества
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                const size = btn.dataset.size;

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const item = cart.find(i => i.name === name && i.size === size);

                if (item) {
                    item.qty -= 1;

                    if (item.qty <= 0) {
                        cart = cart.filter(i => !(i.name === name && i.size === size));
                        if (cart.length === 0) {
                            cartModal.style.display = 'none';
                            miniCart.style.display = 'none';
                        }
                    }

                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateMiniCart();
                    renderCartModal();
                }
            });
        });

    }
});
