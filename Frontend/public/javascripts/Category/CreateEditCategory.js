const categoryModal = document.querySelector('.modal_category--createEdit')
const userModal = document.getElementsByClassName('modal_category_body')[1];
const AdduserModal = document.querySelector('.modal_adduser_body')

/* 배경 클릭 시 모달창 닫는 이벤트리스너 */
categoryModal.addEventListener('mousedown', closeCategoryModal)

function closeCategoryModal(event){
    if(event.currentTarget == event.target){
        categoryModal.classList.remove('show');

        /* 체크박스 및 공유 유저 모달 해제 */
        document.getElementById('userCheckbox').checked = false;
        userModal.classList.remove('show');
    }
}

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

function addUserToggle() {
    let userChecked = document.getElementById('userCheckbox').checked;
    if(userChecked){
        userModal.classList.add('show');
    }
    else{
        userModal.classList.remove('show');
    }
}

function closeAddUserModal() {
    const addUserList = document.querySelector('.modal_adduser_userList');
    addUserList.innerHTML = ""
    AdduserModal.classList.remove('show');
}

function openAddUserModal() {
    const addUserList = document.querySelector('.modal_adduser_userList');

    if (AdduserModal.classList.contains('show')) {
        addUserList.innerHTML = "";
        AdduserModal.classList.remove('show');
    } else {
        const addUserDiv = document.getElementsByClassName('addUserDiv')
        const applyAddUser = [];

        for (let i = 0; i < addUserDiv.length; i++) {
            applyAddUser.push(addUserDiv[i].getAttribute('value'))
        }
        AdduserModal.classList.add('show');
        $.ajax({
            type: 'POST',
            url: 'user/findAll',
            dataType: "json",
            success: function (res) {
                res.user.map((result) => {
                    addUserList.innerHTML += '<div class ="addUserDiv ' + result.name +'">' +
                        '<div>' +
                        '<input type="checkbox" class="adduserCheckbox" id="adduserCheckbox" value="' + result._id + '"' + (applyAddUser.includes(result.name) ? "checked" : "") +'>' +
                        '<img class ="userImage" src="' + result.image + '">' +
                        '<span class = "userName">' + result.name + '</span>' +
                        '</div>' +
                        '<span class = "userEmail">' + (result.email==undefined ? "" : result.email) + '</span>' +
                        '</div>'
                })
            },
            error: function (err) {
                if (err) {
                    window.alert("유저 정보를 불러오지 못하였습니다.")
                    console.log(err)
                }
            }
        })
    }
}
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
/*공유 유저를 찾는 함수*/
function searchAddUser() {
    const addUserList = document.querySelector('.modal_adduser_userList');
    const inputAddUser = document.getElementById('searchUser').value;
    const addUserDiv = document.getElementsByClassName('addUserDiv')
    const applyAddUser = [];

    for (let i = 0; i < addUserDiv.length; i++) {
        applyAddUser.push(addUserDiv[i].getAttribute('value'))
    }

    if (inputAddUser.length) {
        $.ajax({
            type: 'POST',
            url: 'user/find/' + inputAddUser,
            dataType: "json",
            success: function (res) {
                addUserList.innerHTML = "";
                res.user.map((result) => {
                    addUserList.innerHTML += '<div class ="addUserDiv ' + result.name + '">' +
                        '<div>' +
                        '<input type="checkbox" class="adduserCheckbox" id="adduserCheckbox" value="' + result._id + '"' + (applyAddUser.includes(result.name) ? "checked" : "") +'>' +
                        '<img class ="userImage" src="' + result.image + '">' +
                        '<span class = "userName">' + result.name + '</span>' +
                        '</div>' +
                        '<span class = "userEmail">' + (result.email==undefined ? "" : result.email) + '</span>' +
                        '</div>'
                })
            },
            error: function (err) {
                if (err) {
                    window.alert("유저 정보를 불러오지 못하였습니다.")
                }
            }
        });
    } else {
        $.ajax({
            type: 'POST',
            url: 'user/findAll',
            dataType: "json",
            success: function (res) {
                addUserList.innerHTML = "";
                res.user.map((result) => {
                    addUserList.innerHTML += '<div class ="addUserDiv ' + result.name +'">' +
                        '<div>' +
                        '<input type="checkbox" class="adduserCheckbox" id="adduserCheckbox" value="' + result._id + '"' + (applyAddUser.includes(result.name) ? "checked" : "") +'>' +
                        '<img class ="userImage" src="' + result.image + '">' +
                        '<span class = "userName">' + result.name + '</span>' +
                        '</div>' +
                        '<span class = "userEmail">' + (result.email==undefined ? "" : result.email) + '</span>' +
                        '</div>'
                })
            },
            error: function (err) {
                if (err) {
                    window.alert("유저 정보를 불러오지 못하였습니다.")
                    console.log(err)
                }
            }
        })
    }

}
/*체크한 유저를 카테고리등록 모달창으로 이동해주는 함수*/
function getCheckboxAddUser()  {
    const AdduserMid = document.querySelector('.modal_category_body_Adduser_mid');
    // 선택된 목록 가져오기
    const query = 'input[id="adduserCheckbox"]:checked';
    const selectedEls =
        document.querySelectorAll(query);
    AdduserMid.innerHTML = "";
    closeAddUserModal()
    selectedEls.forEach((el) => {
        $.ajax({
            type: 'POST',
            url: 'user/findById/' + el.value,
            dataType: "json",
            success: function (res) {
                console.log(res)
                AdduserMid.innerHTML += '<div class ="addUserDiv ' + res.user.name + '" value = "'+ res.user._id + '">' +
                    '<div>' +
                    '<img class ="userImage" src="' + res.user.image + '">' +
                    '<span class = "userName">' + res.user.name + '</span>' +
                    '</div>' +
                    '<span class = "userEmail">' + (res.user.email==undefined ? "" : res.user.email) + '</span>' +
                    '</div>'

            },
            error: function (err) {
                if (err) {
                    window.alert("유저 정보를 불러오지 못하였습니다.")
                    console.log(err)
                }
            }
        });
    });
}

function AddUserSearchTag() {
    const tags = JSON.parse(localStorage.getItem('content'))
    const str = document.getElementById('categoryTag').value;
    const tagList = document.querySelector('.AddUserTagList')
    const tagListDiv = document.querySelector('.AddUserTagListDiv')

    if (str.length) {
        tagList.innerHTML =
            '<ul id="AddUserAutoTagListUl" class="AddUserAutoTagList"></ul>';
        const autoTagList = document.querySelector('.AddUserAutoTagList');
        let bool = false;
        tags.map((res) => {
            if (res.indexOf(str) > -1) {
                autoTagList.innerHTML +=
                    '<li class="AddUserAutoTag" value="'+ res +'">' + res + '</li>'
                bool = true;
            }
        });
        if(bool == false){
            tagList.innerHTML = '';
        }
    } else {
        tagList.innerHTML = '';
    }

    const autoTag = document.getElementsByClassName('AddUserAutoTag');

    for(let i = 0; i < autoTag.length; i++){
        autoTag[i].addEventListener('click', function () {
            let selectedTag = autoTag[i].getAttribute('value');
            tagListDiv.innerHTML += '<div class ="AddUserAutoTagDiv ' + selectedTag + '"  onclick="AddUserDeleteTag(\'' + selectedTag + '\')">' +
                '<span class="AddUserTagValue" id="AddUserTagValue" value="' + selectedTag +'">' + selectedTag + '</span>' +
                '<i class="fa-regular fa-circle-xmark AddUserDeleteTagValue" style="display: none"></i>' +
                '</div>'
            tagList.innerHTML= ''
            document.getElementById('categoryTag').value = null
            AddUserTagMotion();
        })
    }
}
function AddUserTagMotion() {
    let autoTagDiv = document.getElementsByClassName('AddUserAutoTagDiv')

    for (let i = 0; i < autoTagDiv.length; i++) {
        document.getElementsByClassName('AddUserAutoTagDiv')[i].addEventListener('mouseover', function () {
            document.getElementsByClassName('AddUserDeleteTagValue')[i].style.display = 'flex';
        })
        document.getElementsByClassName('AddUserAutoTagDiv')[i].addEventListener('mouseleave', function () {
            document.getElementsByClassName('AddUserDeleteTagValue')[i].style.display = 'none';
        })
    }
}

function AddUserDeleteTag(selectedTag){
    /*document.getElementsByClassName('aaa')[0].remove();*/
    document.querySelector(`.AddUserAutoTagDiv.${selectedTag}`).remove();
}

