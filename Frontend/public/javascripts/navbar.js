
//서브메뉴 닫는 이벤트리스너
document.getElementsByClassName('wrapper')[0].addEventListener('mousedown', closeSub);
document.getElementById('mainMenu').addEventListener('mousedown', closeSub);
document.getElementById('subMenu').addEventListener('mousedown', closeSub);


//서브메뉴 닫는 함수
function closeSub(event){
    let targetSubDiv = event.currentTarget.querySelectorAll('.fa-chevron-down, .fa-paint-roller, .colorDiv, .iconDiv, .subDiv, .subDiv div, .subDiv i')
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
        let selectedColor = colorElement[i].getAttribute('value');
        document.getElementsByClassName('navbar')[0].style.backgroundColor = selectedColor;
        $.ajax({
            type:'post',
            url:'/user/menuColor',
            data: {
                menuColor : selectedColor
            },
            dataType:'json',
            success : function(data) {
                console.log(data)
                console.log("send data !");
            },
            error : function(err) {
                console.log("failed : " + JSON.stringify(err));
            }
        });
    });
}

function minimize(){
    const wrapper = document.getElementsByClassName('wrapper')[0];
    const mainMenu = document.getElementById('mainMenu');
    const colorBtn = document.getElementsByClassName('colorDiv')[0];
    const colorIcon = document.getElementsByClassName('fa-paint-roller')[0];
    const userInfo = mainMenu.firstElementChild.firstElementChild;
    const bgSub = document.getElementById('bgSub');
    const menuTabBox = document.getElementsByClassName('infoBox__bottom')[0];

    wrapper.style.height = '79%'

    mainMenu.style.transition = 'all 0.3s ease-in-out';
    mainMenu.style.height = '100px';

    menuTabBox.style.borderRadius = '25px';
    userInfo.style.borderRadius = '0px';
    userInfo.style.height = '100%';

    colorBtn.style.width = '50px';
    colorBtn.style.height = '25px';
    colorBtn.style.right = '330px';
    colorBtn.classList.add('fa-xs');

    userInfo.style.position = 'absolute';
    userInfo.style.right = '0px';
    userInfo.style.width = '300px';
    userInfo.firstElementChild.style.width = '100%';

    userInfo.remove();
    mainMenu.appendChild(userInfo)

    bgSub.style.top = '-165px'
    bgSub.style.right = '118px'


}