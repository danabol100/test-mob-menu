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
            // const priceText = document.querySelector('.main_page3_price')?.textContent || "0";
            // const img = document.querySelector('.main_page3_gallery_item img')?.getAttribute('src') || "";
            // const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            // 1) сначала пробуем цену с нажатой кнопки (data-price)
            // let price = NaN;
            // const btnPrice = parseFloat(btn.dataset.price);
            // if (!Number.isNaN(btnPrice)) {
            //     price = btnPrice;
            // } else {
            //     // 2) иначе парсим текст из .main_page3_price (уберём пробелы/грн/знаки)
            //     const raw = document.querySelector('.main_page3_price')?.textContent || "0";
            //     const normalized = raw
            //         .replace(/\u00A0|\u202F|\s/g, '') // обычные и неразрывные пробелы
            //         .replace(',', '.')                // запятую в точку
            //         .replace(/[^\d.]/g, '');          // всё, кроме цифр и точки
            //     price = parseFloat(normalized);
            // }

            // если вдруг всё равно не смогли – не даём добавить, чтобы не было NaN в корзине
            // if (Number.isNaN(price)) {
            //     alert('Не удалось определить цену товара');
            //     return;
            // }
            // ✅ Парсим цену ТОЛЬКО из текста .main_page3_price
            const priceEl = document.querySelector('.main_page3_price');
            const raw = priceEl?.textContent || '0';

            // Нормализация: убираем обычные и неразрывные пробелы, меняем запятую на точку,
            // выкидываем всё, что не цифра и не точка (грн, символы и т.д.)
            const normalized = raw
                .replace(/\u00A0|\u202F|\s/g, '') // пробелы (в т.ч. неразрывные)
                .replace(',', '.')                // десятичная запятая -> точка
                .replace(/[^\d.]/g, '');          // всё лишнее

            const price = Number.parseFloat(normalized);

            if (!Number.isFinite(price)) {
                alert('Не удалось определить цену товара');
                return;
            }


            const img = document.querySelector('.main_page3_gallery_item img')?.getAttribute('src') || "";


            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = cart.find(item => item.name === name && item.size === selectedSize);

            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name, price, img, size: selectedSize, qty: 1 });
            }

            // localStorage.setItem('cart', JSON.stringify(cart));
            // emitCartUpdated();
            // updateMiniCart();

            // if (document.getElementById('cart-modal')?.style.display === 'block') {
            //     renderCartModal();
            // }
            localStorage.setItem('cart', JSON.stringify(cart));
            emitCartUpdated();
            updateMiniCart();

            // Если модалка уже была открыта — просто перерисуем
            if (document.getElementById('cart-modal')?.style.display === 'block') {
                renderCartModal();
            }

            // перепривязать hover/клики (на случай динамики DOM)
            if (typeof attachMiniCartHandlers === 'function') attachMiniCartHandlers();

            // Авто-открытие корзины
            if (window.innerWidth <= 1024) {
                // 📱 Мобильная версия — сразу открыть
                const cartModal = document.getElementById('cart-modal');
                if (typeof renderCartModal === 'function') {
                    renderCartModal();
                    cartModal.style.display = 'block';
                }
            } else {
                // 🖥 Десктоп — сымитировать hover
                if (typeof showCartModalIfNotEmpty === 'function') {
                    showCartModalIfNotEmpty();
                }
            }

        });
    });

    // 🔄 Обновление мини-корзины
    function updateMiniCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        // const miniCart = document.getElementById('mini-cart');
        // const countSpan = document.getElementById('mini-cart-count');
        const carts = [
            { box: document.getElementById('mini-cart'), countSpan: document.getElementById('mini-cart-count') },
            { box: document.getElementById('mini-cart-mob'), countSpan: document.getElementById('mini-cart-count-mob') }
        ];

        carts.forEach(({ box, countSpan }) => {
            if (!box || !countSpan) return;
            box.style.display = ''; // всегда показывать
            // countSpan.textContent = count;
            countSpan.textContent = count > 0 ? count : '';
        });
    }

    // 📦 Открытие корзины
    const miniCart = document.getElementById('mini-cart');
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const miniCartDesktop = document.getElementById('mini-cart');     // десктопная иконка
    const miniCartMobile = document.getElementById('mini-cart-mob'); // мобильная иконка




    // miniCart?.addEventListener('click', () => {
    //     const cart = JSON.parse(localStorage.getItem('cart')) || [];
    //     if (cart.length === 0) return;
    //     renderCartModal();
    //     cartModal.style.display = 'block';
    // });
    // [document.getElementById('mini-cart'), document.getElementById('mini-cart-mob')].forEach(cartEl => {
    //     cartEl?.addEventListener('click', () => {
    //         const cart = JSON.parse(localStorage.getItem('cart')) || [];
    //         if (cart.length === 0) return;
    //         renderCartModal();
    //         cartModal.style.display = 'block';
    //     });
    // });
    // ===== Новая логика открытия корзины =====
    // function showCartModal() {
    //     const cart = JSON.parse(localStorage.getItem('cart')) || [];
    //     if (cart.length === 0) return;
    //     renderCartModal();
    //     cartModal.style.display = 'block';

    //     // Если нужно, позиционируем под иконкой (десктоп)
    //     if (window.innerWidth > 1024 && miniCartDesktop && cartModal) {
    //         const rect = miniCartDesktop.getBoundingClientRect();
    //         cartModal.style.position = 'fixed';
    //         cartModal.style.top = (rect.bottom + 8) + 'px';
    //         cartModal.style.left = Math.max(8, rect.right - cartModal.offsetWidth) + 'px';
    //     }
    // }

    // function hideCartModal() {
    //     if (cartModal) cartModal.style.display = 'none';
    // }

    // let hoverHideTimer = null;

    // // 📱 Мобильная версия — открываем по клику
    // function handleMobileClick(el) {
    //     el?.addEventListener('click', () => {
    //         if (window.innerWidth <= 1024) {
    //             showCartModal();
    //         }
    //     });
    // }
    // handleMobileClick(miniCartMobile);
    // handleMobileClick(miniCartDesktop); // на маленьких экранах и десктопная иконка тоже по клику

    // // 🖥 Десктоп — показываем при наведении
    // if (miniCartDesktop && cartModal) {
    //     miniCartDesktop.addEventListener('mouseenter', () => {
    //         if (window.innerWidth > 1024) {
    //             clearTimeout(hoverHideTimer);
    //             showCartModal();
    //         }
    //     });

    //     miniCartDesktop.addEventListener('mouseleave', () => {
    //         if (window.innerWidth > 1024) {
    //             hoverHideTimer = setTimeout(() => {
    //                 // Скрываем, только если курсор не над модалкой
    //                 if (!cartModal.matches(':hover') && !miniCartDesktop.matches(':hover')) {
    //                     hideCartModal();
    //                 }
    //             }, 200);
    //         }
    //     });

    //     cartModal.addEventListener('mouseenter', () => {
    //         if (window.innerWidth > 1024) {
    //             clearTimeout(hoverHideTimer);
    //         }
    //     });

    //     cartModal.addEventListener('mouseleave', () => {
    //         if (window.innerWidth > 1024) {
    //             hoverHideTimer = setTimeout(() => {
    //                 if (!cartModal.matches(':hover') && !miniCartDesktop.matches(':hover')) {
    //                     hideCartModal();
    //                 }
    //             }, 150);
    //         }
    //     });
    // }

    // На ресайз — закрываем, чтобы не залипало при смене брейкпоинта
    // window.addEventListener('resize', () => {
    //     hideCartModal();
    // });



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
        <div style="display: flex; align-items: center; gap: 48px; padding: 5px 0;">
          <img src="${item.img}" style="width: 55px; height: 55px; object-fit: cover; margin:0 0 0 10px">
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
