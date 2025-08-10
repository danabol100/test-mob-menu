// let lastScroll = 0;
// let lastUpScrollPoint = 0;
// const header = document.getElementById('header-link');

// window.addEventListener('scroll', () => {
//     const currentScroll = window.pageYOffset;

//     if (currentScroll > lastScroll) {
//         // Скроллим вниз
//         header.classList.add('hidden');
//         lastUpScrollPoint = currentScroll; // фиксируем точку начала возможного подъема
//     }
//     else if (currentScroll < lastScroll) {
//         // Скроллим вверх
//         if (lastUpScrollPoint - currentScroll >= 20) {
//             header.classList.remove('hidden');
//         }
//     }

//     lastScroll = currentScroll;
// });


// (function () {
//     const header = document.querySelector('.header');
//     let last = window.pageYOffset || document.documentElement.scrollTop;
//     let upStart = last;
//     const threshold = 20;

//     window.addEventListener('scroll', () => {
//         const cur = window.pageYOffset || document.documentElement.scrollTop;

//         if (cur > last) {
//             // Скроллим вниз — прячем
//             header.classList.add('header--hidden');
//             upStart = cur;
//         } else if (cur < last) {
//             // Скроллим вверх — показываем после порога
//             if (upStart - cur >= threshold) {
//                 header.classList.remove('header--hidden');
//             }
//         }

//         last = cur;
//     }, { passive: true });
// })();


(function () {
    const header = document.querySelector('.header');
    if (!header) return;

    // Если хедер вдруг оказался внутри обрезающего контейнера — не надо.
    // Следи, чтобы .header был РОДИТЕЛЕМ верхнего уровня, не внутри .container с overflow.

    let lastY = window.scrollY;
    let ticking = false;
    const SHOW_AT_TOP = 48;   // всегда показывать вблизи верха
    const DELTA = 12;         // чувствительность (меньше — чувствительнее)

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;

            // Не прячем, если открыто меню (убедиcь, что класс реально снимается при закрытии)
            const menuOpen = document.body.classList.contains('menu-open') ||
                document.querySelector('.mob_content')?.classList.contains('open');

            if (menuOpen || y <= SHOW_AT_TOP) {
                header.classList.remove('header--hidden');
            } else {
                const diff = y - lastY;
                if (Math.abs(diff) > DELTA) {
                    if (diff > 0) {
                        // вниз
                        header.classList.add('header--hidden');
                    } else {
                        // вверх
                        header.classList.remove('header--hidden');
                    }
                }
            }

            lastY = y;
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // На старте — показать хедер
    header.classList.remove('header--hidden');
})();

