/**
 * 담당자 : 배도훈
 * 함수 설명 : 로그아웃창, 메뉴색변경창 닫는 이벤트리스너
 * 주요 기능 : 같은 버튼을 다시 클릭하거나 해당 영역이 아닌 곳 클릭 시 창이 닫힘
 */
document.getElementsByClassName('wrapper')[0].addEventListener('mousedown', closeSub);
document.getElementById('mainMenu').addEventListener('mousedown', closeSub);

/**
 * 담당자 : 배도훈
 * 함수 설명 : 로그아웃창, 메뉴색변경창 닫는 함수
 * 주요 기능 : 같은 버튼을 다시 클릭하거나 해당 영역이 아닌 곳 클릭 시 창이 닫힘
 */
function closeSub(event) {
    /** 클릭해도 닫히지 않을 영역 지정 */
    let targetSubDiv = event.currentTarget.querySelectorAll('.fa-chevron-down, .fa-paint-roller, .colorDiv, .iconDiv, .subDiv, .subDiv div, .subDiv i')
    /** userDropDown 아이콘 */
    let userDropDown = document.querySelector('.userDropDown');

    /** 지정한 영역 클릭 시 창을 닫지 않고 함수 종료 */
    for (let i = 0; i < targetSubDiv.length; i++) {
        if (event.target == targetSubDiv[i]) {
            return;
        }
    }

    /** userDropDown 아이콘 토글 */
    if(userDropDown.classList.contains('open')){
        userDropDown.classList.toggle('open')
    }

    /** 지정한 영역 외 영역 클릭 시 창 닫음 */
    document.getElementsByClassName('userSub')[0].style.display = 'none';
    document.getElementsByClassName('bgSub')[0].style.display = 'none';
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 로그아웃창을 나타내는 함수
 * 주요 기능 : 사용자 아이콘 옆 버튼 클릭 시 로그아웃 버튼이 포함된 창이 표시됨
 */
function userSub() {
    /** 메뉴색 변경창 닫기 */
    document.getElementsByClassName('bgSub')[0].style.display = 'none';

    /** 로그아웃창 토글 */
    let userDropDown = document.querySelector('.userDropDown');
    let userSub = document.querySelector('.userSub');

    userDropDown.classList.toggle('open');
    if (userSub.style.display == 'flex') {
        userSub.style.display = 'none';
    } else {
        userSub.style.display = 'flex';
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 로그아웃창을 나타내는 함수
 * 주요 기능 : 사용자 아이콘 옆 버튼 클릭 시 로그아웃 버튼이 포함된 창이 표시됨
 */
function bgSub() {
    /** 로그아웃창 닫기 */
    document.getElementsByClassName('userSub')[0].style.display = 'none';

    /** 메뉴색 변경창 토글 */
    let bgSub = document.getElementsByClassName('bgSub')[0];
    if (bgSub.style.display == 'flex') {
        bgSub.style.display = 'none';
    } else {
        bgSub.style.display = 'flex';
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 메뉴색 변경창 내 각각의 색을 변수에 저장하고 이벤트리스너 선언
 * 주요 기능 : 메뉴색 변경창의 각 색을 클릭 시 해당 색으로 메뉴색을 변경하는 API 호출
 */

/** 변수에 색깔 배열 저장 */
let colorElement = document.getElementsByClassName('colorElement');

/** 저장한 색깔 배열에 반복문을 사용해 이벤트리스너를 추가 */
for (let i = 0; i < colorElement.length; i++) {
    colorElement[i].addEventListener('click', function () {
        /** value 속성에 저장되어 있는 값을 메뉴색에 적용하고 parameter로 ajax 통신 */
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

/**
 * 담당자 : 배도훈
 * 함수 설명 : 내브바 크기를 변경하는 함수
 * 주요 기능 : 버튼 클릭 시 내브바의 높이 및 구조를 두 가지 형태로 토글
 */
function navToggle() {
    /** 재배치에 필요한 요소들을 변수에 저장 */
    const wrapper = document.querySelector('.wrapper');
    const mainMenu = document.querySelector('#mainMenu');
    const colorBtn = document.querySelector('.colorBtn');
    const navSizeBtn = document.querySelector('.navSizeBtn i');
    const userInfo = document.querySelector('.infoBox__top');
    const infoBox = document.querySelector('.infoBox');

    /** 내브바, 내브바 외 영역, 메뉴색변경 버튼 아이콘 토글 */
    mainMenu.classList.toggle('minNav')
    wrapper.classList.toggle('maxWrapper')
    navSizeBtn.classList.toggle('fa-caret-down');
    navSizeBtn.classList.toggle('fa-caret-up');

    /** 재배치를 위해 사용자 정보 영역 제거 */
    userInfo.remove();
    /** DB에 저장될 내브바 사이즈 선언 */
    let navSize;

    /** 바뀐 내브바에 minNav 클래스가 포함된 경우 */
    if (mainMenu.classList.contains('minNav')) {
        /** 사용자 정보 영역을 내브바의 마지막 자식요소로 추가, 내브바 사이즈 저장 */
        mainMenu.appendChild(userInfo)
        navSize = 'min'

    /** 바뀐 내브바에 minNav 클래스가 포함되지 않은 경우 */
    } else {
        /** 사용자 정보 영역을 메뉴 내부 기능 영역의 처음 자식요소로 추가, 내브바 사이즈 저장 */
        infoBox.prepend(userInfo)
        navSize = 'max'
    }


    /* 캘린더가 존재할 때 사이즈 재설정하는 함수 */
    /**
     * 담당자 : 배도훈
     * 함수 설명 : 캘린더가 존재할 경우(캘린더 페이지일 경우) 캘린더의 높이를 재지정하는 함수
     * 주요 기능 : 내브바 토글 시 캘린더 높이 재지정
     */
    if (document.querySelector('#calendar')) {
        /** 페이지 전체 높이를 변수에 저장 */
        let wrapperHeight = document.querySelector('html').offsetHeight

        /** 내브바 트랜지션과의 부드러운 상호 동작을 위해 딜레이 지정 */
        setTimeout(function () {
            /** 내브바 사이즈에 따라 캘린더 높이 설정 */
            if(navSize == 'min'){
                calendar.setOption('height', wrapperHeight * 0.8)
            }else{
                calendar.setOption('height', wrapperHeight * 0.65)
            }
        }, 200)
    }
    /**  호출 */
    saveNav(navSize);
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 내브바 사이즈를 DB에 저장하는 함수
 * 주요 기능 : 버튼 클릭 시 내브바 사이즈를 두 가지 형태로 DB에 저장
 */
function saveNav(navSize){
    /** 내브바 사이즈 저장 API 호출 */
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