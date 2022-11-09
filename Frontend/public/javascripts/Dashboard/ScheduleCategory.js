function scheduleToggle(e){
    e.firstElementChild.classList.toggle('closed')
    e.parentElement.nextElementSibling.classList.toggle('closed')
}