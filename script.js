const burger = document.querySelector('.burger');
const close = document.querySelector('.close');
const menu = document.querySelector('.mob_content');
const closeNav = document.querySelector('[close-nav]');

document.addEventListener('click', (e) => {
    const clickedOutside = !menu.contains(e.target) && !burger.contains(e.target) && !close.contains(e.target);
    if (!menu.classList.contains('hidden') && clickedOutside) {
        menu.classList.add('hidden');
        close.classList.add('hidden');
        burger.classList.remove('hidden');
    }
})

closeNav.addEventListener('click', () => {
    menu.classList.add('hidden');
    close.classList.add('hidden');
    burger.classList.remove('hidden');

})

burger.addEventListener('click', () => {
    burger.classList.add('hidden');
    close.classList.remove('hidden');
    menu.classList.remove('hidden');


}
)
close.addEventListener('click', () => {
    burger.classList.remove('hidden');
    close.classList.add('hidden');
    menu.classList.add('hidden');

})


document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 80; // высота твоего фиксированного хедера
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

