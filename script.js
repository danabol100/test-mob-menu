const burger = document.querySelector('.burger');
const close = document.querySelector('.close');
const menu = document.querySelector('.mob_content')

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