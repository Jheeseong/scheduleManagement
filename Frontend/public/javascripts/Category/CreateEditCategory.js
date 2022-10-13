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
        AdduserModal.classList.add('show');
        $.ajax({
            type: 'POST',
            url: 'user/findAll',
            dataType: "json",
            success: function (res) {
                console.log(res)
                res.user.map((result) => {
                    addUserList.innerHTML += '<div class ="addUserDiv ' + result.name +'">' +
                        '<div>' +
                        '<input type="checkbox" class="adduserCheckbox" id="adduserCheckbox" value="' + result.name + '">' +
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

function searchAddUser() {
    const addUserList = document.querySelector('.modal_adduser_userList');
    const inputAddUser = document.getElementById('searchUser').value;
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
                        '<input type="checkbox" class="adduserCheckbox" id="adduserCheckbox" value="' + result.name + '">' +
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
                    $.ajax({
                        type: 'POST',
                        url: 'user/findAll',
                        dataType: "json",
                        success: function (res) {
                            console.log(res)
                            res.user.map((result) => {
                                addUserList.innerHTML += '<div class ="addUserDiv ' + result.name +'">' +
                                    '<div>' +
                                    '<input type="checkbox" class="adduserCheckbox" id="adduserCheckbox" value="' + result.name + '">' +
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
                        '<input type="checkbox" class="adduserCheckbox" id="adduserCheckbox" value="' + result.name + '">' +
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

function getCheckboxAddUser()  {
    const AdduserMid = document.querySelector('.modal_category_body_Adduser_mid');
    // 선택된 목록 가져오기
    const query = 'input[id="adduserCheckbox"]:checked';
    const selectedEls =
        document.querySelectorAll(query);
    AdduserMid.innerHTML = "";

    selectedEls.forEach((el) => {
        $.ajax({
            type: 'POST',
            url: 'user/find/' + el.value,
            dataType: "json",
            success: function (res) {
                res.user.map((result) => {
                    AdduserMid.innerHTML += '<div class ="addUserDiv ' + result.name + '">' +
                        '<div>' +
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
        });
    });
}

