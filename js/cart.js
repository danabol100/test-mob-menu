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
                <p>Корзина пуста</p>
                <a href="page2.html" style="
                    display: inline-block;
                    margin-top: 15px;
                    padding: 10px 20px;
                    background: black;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
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
                    <div>Розмір: ${item.size}</div>
                    <div>Ціна: ${item.price} грн</div>
                    <div class="cart-controls">
                        <button class="qty-btn minus">−</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn plus">+</button>
                        <span>шт.</span>
                        <button class="remove-btn" title="Удалить">&times;</button>
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
            cart[index].qty -= 1;
            if (cart[index].qty <= 0) cart.splice(index, 1);
        }

        if (target.classList.contains('remove-btn')) {
            cart.splice(index, 1);
        }

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

        alert(`✅ Дякуємо за замовлення, ${name}!
Спосіб оплати: ${payment === 'card' ? 'Карткою онлайн' : 'Накладений платіж'}
Ми скоро з вами зв'яжемось.`);

        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });

    loadCart();
});
