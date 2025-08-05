document.addEventListener('DOMContentLoaded', () => {
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

    // Логика переключения "Характеристики" / "Підбір розміра"
    const btnSize = document.querySelector('#btn_desc');
    const btnSpecification = document.querySelector('#btn_spec');
    const sectionSize = document.querySelector('.toggle_size');
    const sectionSpec = document.querySelector('.toggle_spec');

    if (btnSize && btnSpecification && sectionSize && sectionSpec) {
        btnSize.addEventListener('click', () => {
            sectionSize.classList.remove('hidden1');
            sectionSpec.classList.add('hidden1');
            btnSize.classList.add('hover');
            btnSpecification.classList.remove('hover');
        });

        btnSpecification.addEventListener('click', () => {
            sectionSize.classList.add('hidden1');
            sectionSpec.classList.remove('hidden1');
            btnSize.classList.remove('hover');
            btnSpecification.classList.add('hover');
        });
    }
});
