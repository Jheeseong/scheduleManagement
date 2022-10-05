//서브메뉴 닫는 이벤트리스너
document.getElementById('sampleDiv').addEventListener('mousedown', closeSub);
document.getElementById('mainMenu').addEventListener('mousedown', closeSub);
document.getElementById('subMenu').addEventListener('mousedown', closeSub);

//서브메뉴 닫는 함수
function closeSub(event){
    if(event.target == event.currentTarget.querySelector('.fa-chevron-down') || event.target == event.currentTarget.querySelector('.fa-paint-roller')){
        return;
    }
    document.getElementsByClassName('userSub')[0].style.display = 'none';
    document.getElementsByClassName('bgSub')[0].style.display = 'none';
}
function menuColor() {
    document.getElementsByClassName('navbar')[0].style.backgroundColor = '#000000';
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