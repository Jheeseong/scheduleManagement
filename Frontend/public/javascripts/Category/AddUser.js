/**
* 담당자 : 정희성
* 파일 내용 : 공유 유저 및 태그를 프론트에 표시에주는 파일
**/
/**
* 담당자 : 정희성
* 함수 내용 : 공유 유저 모달창 닫는 함수
* 주요 기능 : 공유 유저 모달찾 닫는 기능
**/
function closeAddUserModal() {
    const addUserList = document.querySelector('.modal_adduser_userList');
    addUserList.innerHTML = ""
    AdduserModal.classList.remove('show');
}
/**
* 담당자 : 정희성
* 함수 내용 : 공유 유저 모달창을 여는 함수
* 주요 기능 : 공유 유저 모달창 여는 기능
 *          모든 유저를 보여주는 기능
 *          체크한 유저를 카테고리 모달창 공유 유저로 넘기는 기능
**/
function openAddUserModal() {
    const addUserList = document.querySelector('.modal_adduser_userList');
    /*공유 유저 모달창 여는 기능*/
    if (AdduserModal.classList.contains('show')) {
        addUserList.innerHTML = "";
        AdduserModal.classList.remove('show');
    } else {
        const addUserDiv = document.getElementsByClassName('addUserDiv')
        const applyAddUser = [];

        for (let i = 0; i < addUserDiv.length; i++) {
            applyAddUser.push(addUserDiv[i].getAttribute('value'))
        }
        /*ajax를 통해 모든 유저를 불러와서 innerHTML을 통해 바인딩*/
        AdduserModal.classList.add('show');
        $.ajax({
            type: 'POST',
            url: 'user/findAll',
            dataType: "json",
            success: function (res) {
                res.user.map((result) => {
                    addUserList.innerHTML += '<div class ="addUserDiv ' + result.name +'">' +
                        '<div>' +
                        '<input type="checkbox" class="adduserCheckbox" id="adduserCheckbox" value="' + result._id + '"' + (applyAddUser.includes(result._id) ? "checked" : "") +'>' +
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
/**
* 담당자 : 정희성
* 함수 내용 : 검색한 공유 유저를 찾는 함수
* 주요 기능 : 공유 유저 모달창에서 검색한 유저 정보를 찾는 기능
 *          로그인 유저를 제외한 유저의 이미지, 이름 이메일 바인딩 기능
 *          이메일 없을 시 빈칸으로 표시하는 기능
**/
function searchAddUser() {
    const addUserList = document.querySelector('.modal_adduser_userList');
    const inputAddUser = document.getElementById('searchUser').value;
    const addUserDiv = document.getElementsByClassName('addUserDiv')
    const applyAddUser = [];

    for (let i = 0; i < addUserDiv.length; i++) {
        applyAddUser.push(addUserDiv[i].getAttribute('value'))
    }
    /*ajax를 통해 검색한 유저의 정보를 가져옴*/
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
                        '<input type="checkbox" class="adduserCheckbox" id="adduserCheckbox" value="' + result._id + '"' + (applyAddUser.includes(result._id) ? "checked" : "") +'>' +
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
        /*검색한 것이 없을 시 로그인 유저를 제외한 모든 유저를 바인딩*/
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
                        '<input type="checkbox" class="adduserCheckbox" id="adduserCheckbox" value="' + result._id + '"' + (applyAddUser.includes(result._id) ? "checked" : "") +'>' +
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
/**
* 담당자 : 정희성
* 함수 내용 : 체크한 유저를 카테고리등록 모달창으로 이동해주는 함수
* 주요 기능 : 체크한 유저를 카테고리 공유 유저 칸으로 이동해주는 기능
 *          체크 후 확인 버튼 클릭 시 공유 유저 모달창을 꺼주는 기능
**/
function getCheckboxAddUser()  {
    const AdduserMid = document.querySelector('.modal_category_body_Adduser_mid');
    const AddUserTop = document.querySelector('.modal_category_body_Adduser_top > div > span');
    // 선택된 목록 가져오기
    const query = 'input[id="adduserCheckbox"]:checked';
    const selectedEls =
        document.querySelectorAll(query);
    AdduserMid.innerHTML = "";
    /*공유 유저창 종료*/
    closeAddUserModal()
    /*공유자 수 바인딩*/
    AddUserTop.innerText = '공유자 ' + selectedEls.length
    /*선택한 유저의 정보를 찾아와서 바인딩 작업*/
    selectedEls.forEach((el) => {
        $.ajax({
            type: 'POST',
            url: 'user/findById/' + el.value,
            dataType: "json",
            success: function (res) {
                AdduserMid.innerHTML +=
                    '<div class ="addUserDiv ' + res.user.name + '" value = "'+ res.user._id + '">' +
                    '<div>' +
                    '<img class ="userImage" src="' + res.user.image + '">' +
                    '<span class = "userName">' + res.user.name + '</span>' +
                    '</div>' +
                    '<span class = "userEmail">' + (res.user.email==undefined ? "" : res.user.email) + '</span>' +
                    '<i class="fa-solid fa-trash addUserDivDeleteValue" onclick="deleteAddUser(this)"></i>' +
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
/**
* 담당자 : 정희성
* 함수 내용 : 공유 유저 삭제 함수
* 주요 기능 : 공유 유저 삭제 버튼 클릭 시 삭제 기능
**/
function deleteAddUser(addUser) {
    const AddUserTop = document.querySelector('.modal_category_body_Adduser_top > div > span');
    const AddUserCnt = document.querySelectorAll('.addUserDiv').length - 1
    AddUserTop.innerText = "공유자 " + AddUserCnt

    addUser.parentNode.remove()
}
/**
* 담당자 : 정희성
* 함수 내용 : 태그 input 포커스 해제 시 태그 리스트 창 종료해주는 함수
* 주요 기능 : 태그 input 포커스 헤제 시에 태그 리스트 창 종료하는 기능
**/
function AddUserTagOnblur() {
    window.onmouseup = function(e){
        let targetClass = e.target.classList[0]
        if(targetClass != 'AddUserAutoTag' && targetClass != 'categoryTag' && targetClass != 'AddUserAutoTagList'){
            const tagList = document.querySelector('.AddUserTagList')
            tagList.innerHTML = '';
        }
    }
}
/**
* 담당자 : 정희성
* 함수 내용 : 태그 인풋 입력 시 포함 태그 정보들 표시하는 함수
* 주요 기능 : 태그 input 포커스 시 태그리스트 및 정보 표시 기능
 *          태그 정보 입력 시 localstorage에 담긴 태그들 중 단어가 포함된 태그를 가져오는 기능
 *          태그 input 클릭 시 나타나는 태그리스트 중 태그 하나 클릭 시 카테고리 태그에 담기는 기능
 *          입력된 태그 위에 커서 올려둘 시 삭제 버튼이 생기고 클릭시 제거되는 기능
**/
function AddUserSearchTag() {
    /*localStorage를 통해 저장된 태그를 가져온 변수*/
    const tags = JSON.parse(localStorage.getItem('content'))
    const str = document.getElementById('categoryTag').value;
    const tagList = document.querySelector('.AddUserTagList')
    const tagListDiv = document.querySelector('.AddUserTagListDiv')

    /*태그 입력 시 입력된 단어가 포함된 태그를 불러움*/
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
        /*아무 값 없을 시 태그리스트 종료*/
        if(bool == false){
            tagList.innerHTML = '';
        }
        /*입력 태그가 없을 시 모든 태그를 불러옴*/
    } else {
        tagList.innerHTML =
            '<ul id="AddUserAutoTagListUl" class="AddUserAutoTagList"></ul>';
        const autoTagList = document.querySelector('.AddUserAutoTagList');

        tags.map((res) => {
            autoTagList.innerHTML +=
                '<li class="AddUserAutoTag" value="'+ res +'">' + res + '</li>'
        })
    }

    const autoTag = document.getElementsByClassName('AddUserAutoTag');

    /*태그리스트에서 태그 하나 클릭 시 해당 태그를 카테고리 태그에 담음*/
    for(let i = 0; i < autoTag.length; i++){
        autoTag[i].addEventListener('click', function () {
            let selectedTag = autoTag[i].getAttribute('value');
            tagListDiv.innerHTML += '<div class ="AddUserAutoTagDiv ' + 'tag' + selectedTag + '"  onclick="AddUserDeleteTag(this)">' +
                '<span class="AddUserTagValue" id="AddUserTagValue" value="' + selectedTag +'">' + selectedTag + '</span>' +
                '<i class="fa-regular fa-circle-xmark AddUserDeleteTagValue"></i>' +
                '</div>'
            tagList.innerHTML= ''
            document.getElementById('categoryTag').value = null
            /*AddUserTagMotion();*/
        })
    }
}

/**
* 담당자 : 정희성
* 함수 내용 : 입력된 태그 옆 삭제 버튼 클릭 시 제거되는 함수
* 주요 기능 : 태그 옆 삭제 클릭 시 입력 태그에서 제거
**/
function AddUserDeleteTag(selectedTag){
    /*document.getElementsByClassName('aaa')[0].remove();*/
    selectedTag.remove();
    /*AddUserTagMotion();*/
}