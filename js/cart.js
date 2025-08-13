document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const form = document.getElementById('checkout-form');

    function loadCart() {
        console.log("✅ loadCart вызывается");
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <p style="text-align: center; " >Корзина пуста</p>
                <a class="btn-back-to-catalog" href="page2.html" style="
                
                ">Вернуться в каталог</a>
            `;
            cartTotal.textContent = '';
            form.style.display = 'none';
            return;
        }

        cart.forEach((item, index) => {
            const itemTotal = item.qty * item.price;
            total += itemTotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.setAttribute('data-index', index); // для делегирования

            div.innerHTML = `
    <img src="${item.img}" alt="${item.name}" />
    <div class="cart-details">
        <div><strong>${item.name}</strong></div>
        <div class="cart-size">Розмір: ${item.size}</div>
        ${item.desc ? `<div class="cart-desc">${item.desc}</div>` : ''}

        <div class="card-block-size-price">
            <div class="cart-controls">
                <button class="qty-btn minus ${item.qty === 1 ? 'trash' : ''}" 
                    aria-label="${item.qty === 1 ? 'Удалить товар' : 'Уменьшить кількість'}">
                    ${item.qty === 1 ? '' : '−'}
                </button>
                <span class="card-qty">${item.qty}</span>
                <button class="qty-btn plus">+</button>
                
            </div>
            <div class="cart-price">${item.price} грн</div>
        </div>
    </div>
`;
            cartItemsContainer.appendChild(div);
        });

        cartTotal.textContent = `Всього: ${total} грн`;
        form.style.display = 'flex';
    }

    // 📌 Делегирование событий для + - ×
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const itemDiv = target.closest('.cart-item');
        if (!itemDiv) return;

        const index = parseInt(itemDiv.dataset.index);
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (target.classList.contains('plus')) {
            cart[index].qty += 1;
        }
        if (target.classList.contains('minus')) {
            if (cart[index].qty > 1) {
                cart[index].qty -= 1;
            } else {
                // qty === 1 -> поведение корзинки: удаляем товар
                cart.splice(index, 1);
            }
        }

        if (target.classList.contains('remove-btn')) {
            cart.splice(index, 1);
        }

        // if (target.classList.contains('minus')) {
        //     cart[index].qty -= 1;
        //     if (cart[index].qty <= 0) cart.splice(index, 1);
        // }

        // if (target.classList.contains('remove-btn')) {
        //     cart.splice(index, 1);
        // }

        localStorage.setItem('cart', JSON.stringify(cart));

        loadCart();
    });

    // 📤 Отправка формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const phone = form.phone.value.trim();
        const address = form.address.value.trim();
        const payment = form.payment.value;

        if (!name || !phone || !address || !payment) {
            alert('Будь ласка, заповніть всі поля.');
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }

        alert(`✅ Дякуємо за замовлення, ${name} !
                Спосіб оплати: ${payment === 'card' ? 'Карткою онлайн' : 'Накладений платіж'}
Ми скоро з вами зв'яжемось.`);

        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });

    loadCart();
});



document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#checkout-form');
    if (!form) return;

    const targetBtn = form.querySelector('.submit-btn');
    if (!targetBtn) return;

    // Создаём плавающую копию
    const floatBtn = document.createElement('button');
    floatBtn.type = 'button';
    floatBtn.className = 'floating-submit';
    floatBtn.textContent = targetBtn.textContent || 'До сплати';
    document.body.appendChild(floatBtn);

    // Клик по плавающей — кликает оригинал (срабатывает submit формы)
    floatBtn.addEventListener('click', () => {
        targetBtn.click();
    });

    // Следим за видимостью оригинальной кнопки
    // Когда оригинал виден — копию прячем, когда не виден — показываем.
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                floatBtn.classList.remove('show');
            } else {
                floatBtn.classList.add('show');
            }
        },
        {
            threshold: 1,              // считаем "видимой", когда кнопка полностью в кадре
            // подправь нижний отступ, чтобы учесть свои поля/безопасную зону
            rootMargin: '0px 0px -16px 0px'
        }
    );

    observer.observe(targetBtn);

    // На всякий случай: если текст кнопки меняется (локализация/итоговая сумма) — синхронизируем
    const mo = new MutationObserver(() => {
        floatBtn.textContent = targetBtn.textContent;
    });
    mo.observe(targetBtn, { childList: true, characterData: true, subtree: true });
});

