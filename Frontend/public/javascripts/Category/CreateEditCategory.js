/**
 * 담당자 : 정희성
 * 함수 설명 :
 * 주요 기능 : 전부 희성이꺼
 */

/**
 * 담당자 : 정희성
 * 변수 설명 : 각각의 모달을 변수에 저장
 */
const categoryModal = document.querySelector('.modal_category--createEdit')
const userModal = document.getElementsByClassName('modal_category_body')[1];
const AdduserModal = document.querySelector('.modal_adduser_body')

/**
 * 담당자 : 정희성
 * 함수 설명 : 모달창 닫는 이벤트리스너
 * 주요 기능 : 닫기 버튼 또는 모달 외부 영역 클릭 시 모달창을 닫는 기능
 */
categoryModal.addEventListener('mousedown', closeCategoryModal)

/**
 * 담당자 : 정희성
 * 함수 내용 : 카테고리 모달창 외 클릭 시 모달창 종료 함수
 * 주요 기능 : 카테고리 모달창 종료 기능
 *          카테고리 내 남아있는 데이터 초기화
 **/
function closeCategoryModal(event){
    const tagListDiv = document.querySelector('.AddUserTagListDiv');
    const AdduserMid = document.querySelector('.modal_category_body_Adduser_mid');
    const categoryTag = document.querySelector('.categoryTag')

    if(event.currentTarget == event.target){
        categoryModal.classList.remove('show');
        localStorage.clear()
        /* 체크박스 및 공유 유저 모달 해제 */
        document.getElementById('userCheckbox').checked = false;
        document.getElementById('categoryName').value = "";
        tagListDiv.innerHTML = '';
        AdduserMid.innerHTML = '';
        categoryTag.value = '';
        userModal.classList.remove('show');
    }
}

/**
* 담당자 : 정희성
* 함수 내용 : 카테고리 생성 모달창 실행 함수
* 주요 기능 : 카테고리 생성 모달창 실행 기능
 *          저장 클릭 시 작성한 내용으로 카테고리 생성 기능
 *          닫기 클릭 시 모달창 종료 기능
 *          불러온 모든 태그들을 localStorage에 저장되는 기능
**/
/*카테고리 생성 모달창*/
function openCategoryModal() {
    const categoryTop = document.querySelector('.modal_category_body_top');
    const categoryBtn = document.querySelector('.categoryBtnDiv');
    const AddUserTop = document.querySelector('.modal_category_body_Adduser_top > div > span');


    categoryTop.innerText = '카테고리 생성'
    categoryBtn.innerHTML =
        '<button class="btn-empty" onclick="closeCategoryModal(this)">닫기</button>' +
        `<button onclick='saveCategory()'>저장</button>`

    AddUserTop.innerText = "공유자 " + 0
    $.ajax({
        type: 'POST',
        url: 'schedule/tagsearch',
        dataType: "json",
        success: function (res) {
            const tagList = [];
            res.tags.map((result) => {
                tagList.push(result.content)
            })
            /*태그들을 localStorage에 저장*/
            localStorage.setItem('content', JSON.stringify(tagList))
        },
        error: function (err) {
            window.alert("태그 정보를 불러오지 못하였습니다.")
            console.log(err)
        }
    })
    categoryModal.classList.add('show')
    if (categoryModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }else{
        body.style.overflow = 'auto';
    }
}
/**
* 담당자 : 정희성
* 함수 내용 : 카테고리 편집 모달 실행 함수
* 주요 기능 : 클릭한 카테고리의 정보를 바인딩하는 기능
 *          수정 클릭 시 작성한 내용으로 수정되는 기능
 *          불러온 모든 태그를 localStroage에 저장 기능
**/
function openUpdateCategoryModal(id) {
    const tagListDiv = document.querySelector('.AddUserTagListDiv');
    const AdduserMid = document.querySelector('.modal_category_body_Adduser_mid');
    const AddUserTop = document.querySelector('.modal_category_body_Adduser_top > div > span');
    const categoryBtn = document.querySelector('.categoryBtnDiv');
    const categoryTop = document.querySelector('.modal_category_body_top')

    /*카테고리에 있는 태그를 불러온 후 localStorage에 저장*/
    $.ajax({
        type: 'POST',
        url: 'schedule/tagsearch',
        dataType: "json",
        success: function (res) {
            const tagList = [];
            res.tags.map((result) => {
                tagList.push(result.content)
            })
            localStorage.setItem('content', JSON.stringify(tagList))
        },
        error: function (err) {
            window.alert("태그 정보를 불러오지 못하였습니다.")
            console.log(err)
        }
    })
    /*해당 카테고리를 수정 모달에 바인딩*/
    $.ajax({
        type: 'POST',
        url: 'category/findById/' + id,
        dataType: "json",
        success: function (res) {
            categoryTop.innerText = '카테고리 편집';
            document.getElementById('categoryName').value = res.category.title;
            tagListDiv.innerHTML = ''
            res.category.tagInfo.map((result) => {
                tagListDiv.innerHTML +=
                    '<div class ="AddUserAutoTagDiv ' + 'tag' + result.content + '"  onclick="AddUserDeleteTag(this)">' +
                    '<span class="AddUserTagValue" id="AddUserTagValue" value="' + result.content +'">' + result.content + '</span>' +
                    '<i class="fa-regular fa-circle-xmark AddUserDeleteTagValue"></i>' +
                    '</div>'
            })
            /*공유 유저가 있을 시 옆에 추가 모달 표시*/
            if (res.category.userInfo.length !== 0) {
                document.getElementById('userCheckbox').checked = true;
                userModal.classList.add('show');
            }
            /*공유 유저 바인딩*/
            AdduserMid.innerHTML = ''
            AddUserTop.innerText = '공유자 ' + res.category.userInfo.length
            res.category.userInfo.map((result) => {
                AdduserMid.innerHTML += '<div class ="addUserDiv ' + result.name + '" value = "'+ result._id + '">' +
                    '<div>' +
                    '<img class ="userImage" src="' + result.image + '">' +
                    '<span class = "userName">' + result.name + '</span>' +
                    '</div>' +
                    '<span class = "userEmail">' + (result.email===undefined ? "" : result.email) + '</span>' +
                    '<i class="fa-solid fa-trash addUserDivDeleteValue" onclick="deleteAddUser(this)"></i>' +
                    '</div>'
            });
            categoryBtn.innerHTML =
                '<button class="btn-empty" onclick="closeCategoryModal(this)">닫기</button>' +
                `<button onclick='categoryUpdate("${id}")'>편집</button>`

        },
        error: function (err) {
            window.alert("카테고리 모달창을 불러오는 도중 오류가 생겨 다시 시도해주세요!")
            console.log(err)
        }
    })
    categoryModal.classList.add('show')
    if (categoryModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }else{
        body.style.overflow = 'auto';
    }
}
/**
* 담당자 : 정희성
* 함수 내용 : 공유 유저 모달창 실행 함수
* 주요 기능 : 공유 유저 모달창 띄어주는 기능
**/
/*공유 유저 모달창*/
function addUserToggle() {
    let userChecked = document.getElementById('userCheckbox').checked;
    if(userChecked){
        userModal.classList.add('show');
    }
    else{
        userModal.classList.remove('show');
    }
}

/**
* 담당자 : 정희성
* 함수 내용 : 작성된 카테고리 내용을 저장하는 함수
* 주요 기능 : 작성된 카테고리 내용을 DB에 저장하기위해 해당 url로 전송하는 기능
**/
/*카테고리 저장 기능*/
function saveCategory() {
    const categoryTagValue = document.getElementsByClassName('AddUserTagValue')
    const arrayCategoryTag = [];
    let userChecked = document.getElementById('userCheckbox').checked;

    for (let i = 0; i < categoryTagValue.length; i++) {
        arrayCategoryTag.push(categoryTagValue[i].getAttribute('value'))
    }
    const categoryUserValue = document.getElementsByClassName('addUserDiv')

    const arrayCategoryUser = [];

    /*체크된 공유 유저의 id 값도 전달*/
    if (userChecked) {
        for (let i = 0; i < categoryUserValue.length; i++) {
            arrayCategoryUser.push(categoryUserValue[i].getAttribute('value'))
        }
    }


    const categories = {
        title: document.getElementById('categoryName').value,
        tagName: arrayCategoryTag,
        userName: arrayCategoryUser
    }
    /*카테고리 저장*/
    $.ajax({
        type: 'POST',
        data: categories,
        url: 'category/create',
        dataType: "json",

        success: function (res) {
            window.alert(res.message);
            window.location.reload(true);
        },
        error: function (err) {
            window.alert("카테고리 등록을 실패하였습니다!!!")
            console.log(err)
        },
    })
}
/**
* 담당자 : 정희성
* 함수 내용 : 카테고리 수정 함수
* 주요 기능 : 작성된 카테고리 내용으로 수정하기 위해 해당 url로 전송하는 기능
**/
/*카테고리 수정 기능*/
function categoryUpdate(id) {
    const categoryTagValue = document.getElementsByClassName('AddUserTagValue')
    const arrayCategoryTag = [];
    let userChecked = document.getElementById('userCheckbox').checked;

    for (let i = 0; i < categoryTagValue.length; i++) {
        arrayCategoryTag.push(categoryTagValue[i].getAttribute('value'))
    }

    const categoryUserValue = document.getElementsByClassName('addUserDiv')
    const arrayCategoryUser = [];
    /*체크된 공유 유저 id 값 전달*/
    if (userChecked) {
        for (let i = 0; i < categoryUserValue.length; i++) {
            arrayCategoryUser.push(categoryUserValue[i].getAttribute('value'));
        }
    }

    const categories = {
        title: document.getElementById('categoryName').value,
        tagName: arrayCategoryTag,
        userName: arrayCategoryUser
    };
    /*카테고리 수정*/
    $.ajax({
        type: 'POST',
        data: categories,
        url: 'category/update/' + id,
        dataType: "json",

        success: function (res) {
            window.alert(res.message);
            window.location.reload(true);
        },
        error: function (err) {
            window.alert("카테고리 편집을 실패하였습니다!!!")
            console.log(err)
        },
    })

}

/**
* 담당자 : 정희성
* 함수 내용 : 카테고리 삭제 함수
* 주요 기능 : 해당 카테고리 삭제 시 confirm을 통해 확인하는 기능
 *          해당 카테고리를 삭제하는 기능
 *          삭제 후 reload하는 기능
**/
/*카테고리 삭제 기능*/
function categoryDelete(id) {
    if (window.confirm("정말 카테고리를 삭제하시겠습니까?") === true) {
        $.ajax({
            type: 'POST',
            url: 'category/delete/' + id,
            dataType: "json",
            success: function (res) {
                window.alert(res.message);
                window.location.reload(true);
            },
            error: function (err) {
                window.alert("카테고리 삭제를 실패하였습니다!!!")
                console.log(err)
            },
        })
    }
}


