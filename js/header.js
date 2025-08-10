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


(function () {
    const header = document.querySelector('.header');
    let last = window.pageYOffset || document.documentElement.scrollTop;
    let upStart = last;
    const threshold = 20;

    window.addEventListener('scroll', () => {
        const cur = window.pageYOffset || document.documentElement.scrollTop;

        if (cur > last) {
            // Скроллим вниз — прячем
            header.classList.add('header--hidden');
            upStart = cur;
        } else if (cur < last) {
            // Скроллим вверх — показываем после порога
            if (upStart - cur >= threshold) {
                header.classList.remove('header--hidden');
            }
        }

        last = cur;
    }, { passive: true });
})();

