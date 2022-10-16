const categoryModal = document.querySelector('.modal_category--createEdit')
const userModal = document.getElementsByClassName('modal_category_body')[1];
const AdduserModal = document.querySelector('.modal_adduser_body')

/* 배경 클릭 시 모달창 닫는 이벤트리스너 */
categoryModal.addEventListener('mousedown', closeCategoryModal)

function closeCategoryModal(event){
    if(event.currentTarget == event.target){
        categoryModal.classList.remove('show');
        localStorage.clear()
        /* 체크박스 및 공유 유저 모달 해제 */
        document.getElementById('userCheckbox').checked = false;
        userModal.classList.remove('show');
    }
}

/*카테고리 생성 모달창*/
function openCategoryModal() {
    $.ajax({
        type: 'POST',
        url: 'schedule/tagsearch',
        dataType: "json",
        success: function (res) {
            console.log(res)
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
    categoryModal.classList.add('show')
    if (categoryModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }else{
        body.style.overflow = 'auto';
    }
}

function openUpdateCategoryModal(id) {
    const tagListDiv = document.querySelector('.AddUserTagListDiv');
    const AdduserMid = document.querySelector('.modal_category_body_Adduser_mid');
    const categoryBtn = document.querySelector('.categoryBtnDiv');

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
    $.ajax({
        type: 'POST',
        url: 'category/findById/' + id,
        dataType: "json",
        success: function (res) {
            tagListDiv.innerHTML = ''
            AdduserMid.innerHTML = ''
            document.getElementById('categoryName').value = res.category.title;
            res.category.tagInfo.map((result) => {
                tagListDiv.innerHTML += '<div class ="AddUserAutoTagDiv ' + result.content + '"  onclick="AddUserDeleteTag(\'' + result.content + '\')">' +
                    '<span class="AddUserTagValue" id="AddUserTagValue" value="' + result.content +'">' + result.content + '</span>' +
                    '<i class="fa-regular fa-circle-xmark AddUserDeleteTagValue" style="display: none"></i>' +
                    '</div>'
            })
            res.category.userInfo.map((result) => {
                AdduserMid.innerHTML += '<div class ="addUserDiv ' + result.name + '" value = "'+ result._id + '">' +
                    '<div>' +
                    '<img class ="userImage" src="' + result.image + '">' +
                    '<span class = "userName">' + result.name + '</span>' +
                    '</div>' +
                    '<span class = "userEmail">' + (result.email===undefined ? "" : result.email) + '</span>' +
                    '</div>'
            })
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

/*카테고리 저장 기능*/
function saveCategory() {
    const categoryTagValue = document.getElementsByClassName('AddUserTagValue')
    const arrayCategoryTag = [];

    for (let i = 0; i < categoryTagValue.length; i++) {
        arrayCategoryTag.push(categoryTagValue[i].getAttribute('value'))
    }

    const categoryUserValue = document.getElementsByClassName('addUserDiv')
    const arrayCategoryUser = [];

    for (let i = 0; i < categoryUserValue.length; i++) {
        arrayCategoryUser.push(categoryUserValue[i].getAttribute('value'))
    }

    const categories = {
        title: document.getElementById('categoryName').value,
        tagName: arrayCategoryTag,
        userName: arrayCategoryUser
    }

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

/*카테고리 수정 기능*/
function categoryUpdate(id) {
    const categoryTagValue = document.getElementsByClassName('AddUserTagValue')
    const arrayCategoryTag = [];

    for (let i = 0; i < categoryTagValue.length; i++) {
        arrayCategoryTag.push(categoryTagValue[i].getAttribute('value'))
    }

    const categoryUserValue = document.getElementsByClassName('addUserDiv')
    const arrayCategoryUser = [];

    for (let i = 0; i < categoryUserValue.length; i++) {
        arrayCategoryUser.push(categoryUserValue[i].getAttribute('value'))
    }

    const categories = {
        title: document.getElementById('categoryName').value,
        tagName: arrayCategoryTag,
        userName: arrayCategoryUser
    }
    console.log(categories)

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


