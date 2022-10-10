const body = document.querySelector('body')
const listModal = document.querySelector('.modal_schedule--list')
const editModal = document.querySelector('.modal_schedule--edit')
const mapModal = document.getElementsByClassName('modal_schedule_body')[2];

/* 배경 클릭 시 모달창 닫는 이벤트리스너 */
listModal.addEventListener('mousedown', closeModal)
editModal.addEventListener('mousedown', closeModal)

/* 모달창 닫는 함수 */
function closeModal(event){
    if(event.currentTarget == event.target){
        listModal.classList.remove('show');
        editModal.classList.remove('show');
        localStorage.clear()

        /* 체크박스 및 카카오맵 모달 해제 */
        document.getElementById('addrCheckbox').checked = false;
        mapModal.classList.remove('show');
    }
}

function openListModal() {
    listModal.classList.add('show')
    if (listModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }else{
        body.style.overflow = 'auto';
    }
}

function openEditModal() {
    $.ajax({
        type: 'POST',
        url: 'schedule/tagsearch',
        dataType: "json",
        success: function (res) {
            const tagList = [];
            res.tags.map((result) => {
                tagList.push(result.content)
            })
            console.log(tagList)
            localStorage.setItem('content', JSON.stringify(tagList))
        },
        error: function (err) {

        }
    })
    listModal.classList.remove('show');
    editModal.classList.add('show')
    if (editModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }else{
        body.style.overflow = 'auto';
    }
}

function addrToggle() {
    addrChecked = document.getElementById('addrCheckbox').checked;
    if(addrChecked){
        mapModal.classList.add('show');
    }
    else{
        mapModal.classList.remove('show');
    }
    if(mapModal.classList.contains('show')){
        map.relayout();
    }
}

function saveSchedule() {
    const tagValue = document.getElementsByClassName('tagValue')
    const arrayTag = [];

    for (let i = 0; i < tagValue.length; i++) {
        arrayTag.push(tagValue[i].getAttribute('value'))
    }
    const schedules = {
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            title: document.getElementById('scheduleName').value,
            content: document.getElementById('scheduleContent').value,
            priority: document.getElementById('schedulePriority').value,
            address: document.getElementById('addrInput').value,
            tagInfo: arrayTag,
    }
        $.ajax({
            type: 'POST',
            data: schedules,
            url: 'schedule/create',
            dataType: "json",

            success: function (res) {
                if (res.scheduleSuccess === true) {
                    window.alert(res.message);
                } else {
                    window.alert(res.message);
                }
                window.location.reload(true);
            },
            error: function (err) {
                if (err) {
                    window.alert("일정등록을 실패하였습니다!!!!")
                    console.log(err)
                }
            }
        })
}

function searchTag(event) {
    const tags = JSON.parse(localStorage.getItem('content'))
    const str = document.getElementById('scheduleTag').value;
    const tagList = document.querySelector('.tagList')
    const tagListDiv = document.querySelector('.tagListDiv')

    console.log(tags)
    if (str.length) {
        tagList.innerHTML =
            '<ul id="autoTagListUl" class="autoTagList"></ul>';
        const autoTagList = document.querySelector('.autoTagList');
        tags.map((res) => {
            if (res.indexOf(str) > -1) {
                autoTagList.innerHTML +=
                    '<li class="autoTag" value="'+ res +'">' + res + '</li>'
            }
        });
    } else {
        tagList.innerHTML = '';
    }

    const autoTag = document.getElementsByClassName('autoTag');

    for(let i = 0; i < autoTag.length; i++){
        autoTag[i].addEventListener('click', function () {
            let selectedTag = autoTag[i].getAttribute('value');
            tagListDiv.innerHTML += '<div class ="autoTagDiv">' +
                '<span class="tagValue" id="tagValue" value="' + selectedTag +'">' + selectedTag + '</span>' +
                '<img class="deleteTagValue" src="/img/cancel.png">' +
                '</div>'
            tagList.innerHTML=''
            document.getElementById('scheduleTag').value = null
            tagMotion()
        })
    }

    if (event.keyCode == 13) {
        tagListDiv.innerHTML += '<div class = "autoTagDiv">' +
            '<span class="tagValue" id="tagValue" value="' + str +'">' + str + '</span>' +
            '<img class="deleteTagValue" src="/img/cancel.png">' +
            '</div>'
        tagList.innerHTML=''
        document.getElementById('scheduleTag').value = null
    }
    tagMotion()

    function tagMotion() {
        const autoTagDiv = document.getElementsByClassName('autoTagDiv')

        for (let i = 0; i < autoTagDiv.length; i++) {
            document.getElementsByClassName('autoTagDiv')[i].addEventListener('mouseover', function () {
                document.getElementsByClassName('deleteTagValue')[i].style.display = 'flex';
            })
            document.getElementsByClassName('autoTagDiv')[i].addEventListener('mouseleave', function () {
                document.getElementsByClassName('deleteTagValue')[i].style.display = 'none';
            })
            document.getElementsByClassName('deleteTagValue')[i].addEventListener('click', function () {
                autoTagDiv[i].remove();
            })
        }
    }
}
