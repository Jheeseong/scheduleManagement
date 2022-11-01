function scheduleToggle(e){
    console.log(e.classList)
    e.firstElementChild.classList.toggle('closed')
    e.parentElement.nextElementSibling.classList.toggle('closed')
}