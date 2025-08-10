document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const closeBtn = document.querySelector('.mob_content .close');
    const menu = document.querySelector('.mob_content');
    const closeNav = document.querySelector('[close-nav]');
    const year = document.querySelector(".logo_desc1");
    const yearRemove = document.querySelector(".logo_desc12");

    function handleViewportChange() {
        if (window.innerWidth <= 610) {
            year?.classList.add('hidden');
            yearRemove?.classList.remove('hidden');
        } else {
            year?.classList.remove('hidden');
            yearRemove?.classList.add('hidden');
            // При переходе на десктоп — закрыть меню и показать бургер
            menu?.classList.remove('open');
            closeBtn?.classList.add('hidden');
            burger?.classList.remove('hidden');
            document.body.classList.remove('body--no-scroll');

        }
    }

    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);

    function openMenu() {
        menu.classList.add('open');
        burger.classList.add('hidden');
        closeBtn.classList.remove('hidden');
        document.body.classList.add('body--no-scroll', 'menu-open');
    }

    function closeMenu() {
        menu.classList.remove('open');
        closeBtn.classList.add('hidden');
        burger.classList.remove('hidden');
        document.body.classList.remove('body--no-scroll', 'menu-open');
    }

    if (burger && closeBtn && menu) {
        burger.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);

        // клик вне панели — закрыть
        document.addEventListener('click', (e) => {
            if (!menu.classList.contains('open')) return;
            const target = e.target;
            if (!menu.contains(target) && !burger.contains(target) && !closeBtn.contains(target)) {
                closeMenu();
            }
        });

        // клик по пункту с [close-nav] — закрыть
        closeNav?.addEventListener('click', closeMenu);

        // Esc — закрыть
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                closeMenu();
            }
        });
    }



    // Модалка
    const zoomableImages = document.querySelectorAll('.zoomable');
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('modal-img');
    const modalContent = document.querySelector('.modal-content');

    if (zoomableImages.length && modal && modalImg && modalContent) {
        zoomableImages.forEach(img => {
            img.addEventListener('click', () => {
                modalImg.src = img.src;
                modal.classList.remove('hidden');
            });
        });

        modal.addEventListener('click', (e) => {
            if (!modalContent.contains(e.target) || e.target === modalImg) {
                modal.classList.add('hidden');
                modalImg.src = '';
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                modal.classList.add('hidden');
                modalImg.src = '';
            }
        });
    }
});
