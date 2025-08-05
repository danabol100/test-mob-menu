document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const close = document.querySelector('.close');
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
