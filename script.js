// const burger = document.querySelector('.burger');
// const close = document.querySelector('.close');
// const menu = document.querySelector('.mob_content');
// const closeNav = document.querySelector('[close-nav]');
// const year = document.querySelector(".logo_desc1");
// const yearRemove = document.querySelector(".logo_desc12");
// const MediaQuery = window.matchMedia('(max-width:479px)');

// function handleViewportChange() {
//     if (window.innerWidth <= 479) {
//         year.classList.add('hidden');
//         yearRemove.classList.remove('hidden');
//     } else {
//         year.classList.remove('hidden');
//         yearRemove.classList.add('hidden');
//     }
// }
// handleViewportChange()








// document.addEventListener('click', (e) => {
//     const clickedOutside = !menu.contains(e.target) && !burger.contains(e.target) && !close.contains(e.target);
//     if (!menu.classList.contains('hidden') && clickedOutside) {
//         menu.classList.add('hidden');
//         close.classList.add('hidden');
//         burger.classList.remove('hidden');
//     }
// })

// closeNav.addEventListener('click', () => {
//     menu.classList.add('hidden');
//     close.classList.add('hidden');
//     burger.classList.remove('hidden');

// })

// burger.addEventListener('click', () => {
//     burger.classList.add('hidden');
//     close.classList.remove('hidden');
//     menu.classList.remove('hidden');


// }
// )
// close.addEventListener('click', () => {
//     burger.classList.remove('hidden');
//     close.classList.add('hidden');
//     menu.classList.add('hidden');

// })


// document.querySelectorAll('.scroll-link').forEach(link => {
//     link.addEventListener('click', function (e) {
//         const href = this.getAttribute('href');

//         if (href.startsWith('#')) {
//             e.preventDefault();
//             const target = document.querySelector(href);
//             const headerOffset = 80;
//             const elementPosition = target.getBoundingClientRect().top;
//             const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

//             window.scrollTo({
//                 top: offsetPosition,
//                 behavior: 'smooth'
//             });
//         }
//         // если href — это ссылка на другую страницу — не блокируем
//     });
// });



document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const close = document.querySelector('.close');
    const menu = document.querySelector('.mob_content');
    const closeNav = document.querySelector('[close-nav]');
    const year = document.querySelector(".logo_desc1");
    const yearRemove = document.querySelector(".logo_desc12");
    const MediaQuery = window.matchMedia('(max-width:479px)');

    document.querySelectorAll('.card_img').forEach(img => {
        const originalSrc = img.src;
        const hoverSrc = img.dataset.hover;

        img.addEventListener('mouseenter', () => {
            img.src = hoverSrc;
        });

        img.addEventListener('mouseleave', () => {
            img.src = originalSrc;
        });
    });


    function handleViewportChange() {
        if (year && yearRemove) {
            if (window.innerWidth <= 479) {
                year.classList.add('hidden');
                yearRemove.classList.remove('hidden');
            } else {
                year.classList.remove('hidden');
                yearRemove.classList.add('hidden');
            }
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
            const clickedOutside = !menu.contains(e.target) &&
                !burger.contains(e.target) &&
                !close.contains(e.target);

            if (!menu.classList.contains('hidden') && clickedOutside) {
                menu.classList.add('hidden');
                close.classList.add('hidden');
                burger.classList.remove('hidden');
            }
        });

        if (closeNav) {
            closeNav.addEventListener('click', () => {
                menu.classList.add('hidden');
                close.classList.add('hidden');
                burger.classList.remove('hidden');
            });
        }
    }

    // Scroll links (работают на обеих страницах)
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (!target) return;

                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Zoomable modal
    const zoomableImages = document.querySelectorAll('.zoomable');
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('modal-img');
    const overlay = document.querySelector('.overlay');
    const modalContent = document.querySelector('.modal-content');

    if (modal && modalImg && overlay && modalContent) {
        zoomableImages.forEach(img => {
            img.addEventListener('click', () => {
                modalImg.src = img.src;
                modal.classList.remove('hidden');
            });
        });

        modal.addEventListener('click', (e) => {
            const clickedOutsideImg = !modalContent.contains(e.target);
            const clickedOnImg = e.target === modalImg;

            if (clickedOutsideImg || clickedOnImg) {
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







const zoomableImages = document.querySelectorAll('.zoomable');
const modal = document.querySelector('.modal');
const modalImg = document.getElementById('modal-img');
const overlay = document.querySelector('.overlay');
const modalContent = document.querySelector('.modal-content');

// Клик на изображение — открыть модалку
zoomableImages.forEach(img => {
    img.addEventListener('click', () => {
        modalImg.src = img.src;
        modal.classList.remove('hidden');
    });
});

// Закрытие при клике вне картинки или по самой картинке
modal.addEventListener('click', (e) => {
    const clickedOutsideImg = !modalContent.contains(e.target);
    const clickedOnImg = e.target === modalImg;

    if (clickedOutsideImg || clickedOnImg) {
        modal.classList.add('hidden');
        modalImg.src = '';
    }
});

// Закрытие по Escape (по желанию)
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        modal.classList.add('hidden');
        modalImg.src = '';
    }
});




