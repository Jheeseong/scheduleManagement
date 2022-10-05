const body = document.querySelector('body')
const modal = document.querySelector('.modal_schedule')

function openModal() {
    modal.classList.toggle('show')
    if (modal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }
}