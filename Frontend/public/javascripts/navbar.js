
//서브메뉴 닫는 이벤트리스너
document.getElementsByClassName('wrapper')[0].addEventListener('mousedown', closeSub);
document.getElementById('mainMenu').addEventListener('mousedown', closeSub);

//서브메뉴 닫는 함수
function closeSub(event) {
    let targetSubDiv = event.currentTarget.querySelectorAll('.fa-chevron-down, .fa-paint-roller, .colorDiv, .iconDiv, .subDiv, .subDiv div, .subDiv i')
    for (let i = 0; i < targetSubDiv.length; i++) {
        if (event.target == targetSubDiv[i]) {
            return;
        }
    }

    document.getElementsByClassName('userSub')[0].style.display = 'none';
    document.getElementsByClassName('bgSub')[0].style.display = 'none';
}

function userSub() {
    document.getElementsByClassName('bgSub')[0].style.display = 'none';

    let userSub = document.querySelector('.userSub');
    if (userSub.style.display == 'flex') {
        userSub.style.display = 'none';
    } else {
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
    } else {
        bgSub.style.display = 'flex';
    }
}

let colorElement = document.getElementsByClassName('colorElement');
for (let i = 0; i < colorElement.length; i++) {
    colorElement[i].addEventListener('click', function () {
        let selectedColor = colorElement[i].getAttribute('value');
        document.getElementsByClassName('navbar')[0].style.backgroundColor = selectedColor;
        $.ajax({
            type: 'post',
            url: '/user/menuColor',
            data: {
                menuColor: selectedColor
            },
            dataType: 'json',
            success: function (data) {
            },
            error: function (err) {
                console.log("failed : " + JSON.stringify(err));
            }
        });
    });
}

function navToggle() {

    const wrapper = document.querySelector('.wrapper');
    const mainMenu = document.querySelector('#mainMenu');
    const colorBtn = document.querySelector('.colorDiv');
    const userInfo = document.querySelector('.infoBox__top');
    const infoBox = document.querySelector('.infoBox');
    mainMenu.classList.toggle('minNav')
    wrapper.classList.toggle('maxWrapper')
    colorBtn.classList.toggle('fa-xs');

    userInfo.remove();
    let navSize;

    if (mainMenu.classList.contains('minNav')) {
        mainMenu.appendChild(userInfo)
        navSize = 'min'
    } else {
        infoBox.prepend(userInfo)
        navSize = 'max'
    }


    /* 캘린더가 존재할 때 사이즈 재설정하는 함수 */
    if (document.querySelector('#calendar')) {
        let wrapperHeight = document.querySelector('html').offsetHeight
        setTimeout(function () {
            if(navSize == 'min'){
                calendar.setOption('height', wrapperHeight * 0.8)
            }else{
                calendar.setOption('height', wrapperHeight * 0.65)
            }
        }, 200)
    }

    saveNav(navSize);
}

function saveNav(navSize){
    $.ajax({
        type: 'post',
        url: '/user/navSize',
        data: {
            navSize: navSize
        },
        dataType: 'json',
        success: function (data) {
        },
        error: function (err) {
            console.log("failed : " + JSON.stringify(err));
        }
    });
}