document.addEventListener('DOMContentLoaded', () => {
    updateMiniCart();

    const miniCart = document.getElementById('mini-cart');

    miniCart?.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) return;

        // Если функция есть — открываем модалку
        if (typeof renderCartModal === 'function') {
            renderCartModal();
            document.getElementById('cart-modal').style.display = 'block';
        }
    });

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
});
