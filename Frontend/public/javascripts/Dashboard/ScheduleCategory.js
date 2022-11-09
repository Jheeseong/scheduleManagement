/**
 * 담당자 : 정희성
 * 함수 설명 :
 * 주요 기능 :
 */
function scheduleToggle(e){
    e.firstElementChild.classList.toggle('closed')
    e.parentElement.nextElementSibling.classList.toggle('closed')
}