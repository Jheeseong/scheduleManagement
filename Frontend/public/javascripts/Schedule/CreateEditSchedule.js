const body = document.querySelector('body')
const listModal = document.querySelector('.modal_schedule--list')
const editModal = document.querySelector('.modal_schedule--edit')
const mapModal = document.getElementsByClassName('modal_schedule_body')[2];

/* 배경 클릭 시 모달창 닫는 이벤트리스너 */
listModal.addEventListener('mousedown', closeModal)
editModal.addEventListener('mousedown', closeModal)

/* 모달창 닫는 함수 */
function closeModal(event, modal){
    if(event.currentTarget == event.target){
        if(modal == 'list'){
            listModal.classList.remove('show');
        }
        else if(modal == 'edit'){
            editModal.classList.remove('show');
        }
        else{
            listModal.classList.remove('show');
            editModal.classList.remove('show');
        }
        localStorage.clear()

        /* 체크박스 및 카카오맵 모달 해제 */
        document.getElementById('addrCheckbox').checked = false;
        mapModal.classList.remove('show');
    }
}

function openListModal(selectedEventList) {
    let tbodyTag = document.getElementById('scheduleTbody');
    let str = '';
    for(let i = 0; i < selectedEventList.length; i++){
        str += '<tr>';
        str += '<td>생성자</td>';
        str += '<td>' + selectedEventList[i].title + '</td>';
        str += '<td>' + selectedEventList[i].address + '</td>';
        str += '<td>' + selectedEventList[i].start + ' ~ ' + selectedEventList[i].end + '</td>';
        str += '<td>tags</td>';
        str += '<td><button onclick="" class="btn-red">삭제</button></td>';
        str += '</tr>';
    }
    tbodyTag.innerHTML = str;

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
            localStorage.setItem('content', JSON.stringify(tagList))
        },
        error: function (err) {
            window.alert("태그 정보를 불러오지 못하였습니다.")
            console.log(err)
        }
    })
    mapModal.classList.remove('show');
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
function ScheduleTagOnfocus() {
    const tags = JSON.parse(localStorage.getItem('content'))
    const tagList = document.querySelector('.tagList')

    tagList.innerHTML =
        '<ul id="autoTagListUl" class="autoTagList"></ul>';
    const autoTagList = document.querySelector('.autoTagList');

    tags.map((res) => {
        autoTagList.innerHTML +=
            '<li class="autoTag" value="'+ res +'">' + res + '</li>'

    })
}

function ScheduleTagOnblur() {
    const tagList = document.querySelector('.tagList')
    tagList.innerHTML = '';
}

function searchTag(event) {
    const tags = JSON.parse(localStorage.getItem('content'))
    const str = document.getElementById('scheduleTag').value;
    const tagList = document.querySelector('.tagList')
    const tagListDiv = document.querySelector('.tagListDiv')

    if (str.length) {
        tagList.innerHTML =
            '<ul id="autoTagListUl" class="autoTagList"></ul>';
        const autoTagList = document.querySelector('.autoTagList');
        let bool = false;
        tags.map((res) => {
            if (res.indexOf(str) > -1) {
                autoTagList.innerHTML +=
                    '<li class="autoTag" value="'+ res +'">' + res + '</li>'
                    bool = true;
            }
        });
        if(bool == false){
            tagList.innerHTML = '';
        }
    } else {
        tagList.innerHTML =
            '<ul id="autoTagListUl" class="autoTagList"></ul>';
        const autoTagList = document.querySelector('.autoTagList');

        tags.map((res) => {
            autoTagList.innerHTML +=
                '<li class="autoTag" value="'+ res +'">' + res + '</li>'

        })
    }

    const autoTag = document.getElementsByClassName('autoTag');

    for(let i = 0; i < autoTag.length; i++){
        autoTag[i].addEventListener('click', function () {
            let selectedTag = autoTag[i].getAttribute('value');
            tagListDiv.innerHTML += '<div class ="autoTagDiv ' + selectedTag + '"  onclick="deleteTag(\'' + selectedTag + '\')">' +
                '<span class="tagValue" id="tagValue" value="' + selectedTag +'">' + selectedTag + '</span>' +
                '<i class="fa-regular fa-circle-xmark deleteTagValue" style="display: none"></i>' +
                '</div>'
            tagList.innerHTML= ''
            document.getElementById('scheduleTag').value = null
            tagMotion();
        })
    }

    if (event.keyCode == 13) {
        tagListDiv.innerHTML += '<div class = "autoTagDiv ' + str + '" onclick="deleteTag(\'' + str + '\')">' +
            '<span class="tagValue" id="tagValue" value="' + str +'">' + str + '</span>' +
            '<i class="fa-regular fa-circle-xmark deleteTagValue" style="display: none"></i>' +
            '</div>'
        tagList.innerHTML = ''
        document.getElementById('scheduleTag').value = null
        tagMotion();
    }
}
function tagMotion() {
    let autoTagDiv = document.getElementsByClassName('autoTagDiv')

    for (let i = 0; i < autoTagDiv.length; i++) {
        document.getElementsByClassName('autoTagDiv')[i].addEventListener('mouseover', function () {
            document.getElementsByClassName('deleteTagValue')[i].style.display = 'flex';
        })
        document.getElementsByClassName('autoTagDiv')[i].addEventListener('mouseleave', function () {
            document.getElementsByClassName('deleteTagValue')[i].style.display = 'none';
        })
    }
}

function deleteTag(selectedTag){
    /*document.getElementsByClassName('aaa')[0].remove();*/
    document.querySelector(`.autoTagDiv.${selectedTag}`).remove();
    tagMotion();
}

/* 캘린더에 일정 바인딩 */
function readEvents(){
    let eventData = {
        title: '취침',
        start: '2022-08-15',
        end: '2022-08-15',
        id: '123123'
    }
    calendar.currentData.calendarOptions.events.push(eventData);
    console.log(calendar.currentData.calendarOptions.events);

    calendar.refetchEvents();
}