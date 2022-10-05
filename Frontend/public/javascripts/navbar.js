//서브메뉴 닫는 이벤트리스너
document.getElementsByClassName('wrapper')[0].addEventListener('mousedown', closeSub);
document.getElementById('mainMenu').addEventListener('mousedown', closeSub);
document.getElementById('subMenu').addEventListener('mousedown', closeSub);


//서브메뉴 닫는 함수
function closeSub(event){
    let targetUser = event.currentTarget.querySelector('.fa-chevron-down')
    let targetColor = event.currentTarget.querySelector('.fa-paint-roller')
    let targetColorDiv = event.currentTarget.querySelector('.colorDiv')
    let targetSubDiv = event.currentTarget.querySelectorAll('.subDiv')
    console.log(event.target);
    if(event.target == targetUser || event.target == targetColor || event.target == targetColorDiv){
        return;
    }
    for(let i = 0; i < targetSubDiv.length; i++){
        if(event.target == targetSubDiv[i]){
            return;
        }
    }

    document.getElementsByClassName('userSub')[0].style.display = 'none';
    document.getElementsByClassName('bgSub')[0].style.display = 'none';
}

function userSub() {
    document.getElementsByClassName('bgSub')[0].style.display = 'none';

    let userSub = document.getElementsByClassName('userSub')[0];
    if (userSub.style.display == 'flex') {
        userSub.style.display = 'none';
    }
    else{
        userSub.style.display = 'flex';
    }
}

/* 메뉴색 지정 버튼 나타내기 이벤트리스너 */
document.getElementById('mainMenu').addEventListener('mouseover', function () {
    document.getElementsByClassName('colorDiv')[0].style.display = 'flex';
})
/* 메뉴색 지정 버튼 감추기 이벤트리스너 */
document.getElementById('mainMenu').addEventListener('mouseleave', function () {
    document.getElementsByClassName('colorDiv')[0].style.display = 'none';
})

function bgSub() {
    document.getElementsByClassName('userSub')[0].style.display = 'none';

    let bgSub = document.getElementsByClassName('bgSub')[0];
    if (bgSub.style.display == 'flex') {
        bgSub.style.display = 'none';
    }
    else{
        bgSub.style.display = 'flex';
    }
}

let colorElement = document.getElementsByClassName('colorElement');
for(let i = 0; i < colorElement.length; i++){
    colorElement[i].addEventListener('click', function () {
        document.getElementsByClassName('navbar')[0].style.backgroundColor = colorElement[i].getAttribute('value');
    })
}