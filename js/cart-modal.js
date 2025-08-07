


function renderCartModal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

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
  <div style="position: relative; display: flex;padding:0 10px; gap: 38px; align-items: center;">
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

    // Обработчики кнопок + и -
    const increaseButtons = cartItems.querySelectorAll('.increase-qty');
    const decreaseButtons = cartItems.querySelectorAll('.decrease-qty');
    const removeButtons = cartItems.querySelectorAll('.remove-item');

    // Увеличение
    increaseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const size = btn.dataset.size;

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(p => p.name === name && p.size === size);
            if (item) item.qty += 1;

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartModal(); // перерисовываем модалку
        });
    });

    // Уменьшение
    decreaseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const size = btn.dataset.size;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(p => p.name === name && p.size === size);

            if (item) {
                item.qty -= 1;
                if (item.qty <= 0) {
                    cart = cart.filter(p => !(p.name === name && p.size === size));
                }
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartModal();
        });
    });

    // Удаление
    removeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const size = btn.dataset.size;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(p => !(p.name === name && p.size === size));

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartModal();
        });
    });


};