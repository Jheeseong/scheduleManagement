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
            /* 내용  초기화 */
            const inputTags = document.querySelectorAll('input')
            for(let i = 0; i < inputTags.length; i++){
                inputTags[i].value = '';
            }
            document.getElementById('endDate').setAttribute('type', 'text');
            document.getElementById('value1').innerHTML = '3';
            document.getElementsByClassName('tagListDiv')[0].innerHTML = '';
        }
        else{
            listModal.classList.remove('show');
            editModal.classList.remove('show');

            /* 내용  초기화 */
            const inputTags = document.querySelectorAll('input')
            for(let i = 0; i < inputTags.length; i++){
                inputTags[i].value = '';
            }
            document.getElementById('endDate').setAttribute('type', 'text');
            document.getElementById('value1').innerHTML = '';
            document.getElementsByClassName('tagListDiv')[0].innerHTML = '';
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
        str += '<tr onclick="openEditModal(\'' + selectedEventList[i].id + '\')">';
        str += '<td>' + selectedEventList[i].title + '</td>';
        str += '<td>' + selectedEventList[i].start.substring(0, 10) + ' ' + selectedEventList[i].start.substring(11, 16) + '</td>';
        str += '<td>' + selectedEventList[i].end.substring(0, 10) + ' ' + selectedEventList[i].end.substring(11, 16) + '</td>';
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

function openEditModal(scheduleId) {
    if(scheduleId){
        /* 희성이코드 */
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
            url: 'schedule/find/' + scheduleId,
            dataType: "json",
            success: function (res) {
                /* 모달 탑 */
                document.getElementsByClassName('modal_schedule_body_top')[1].innerHTML = '일정 편집';
                document.getElementsByClassName('saveBtn')[0].innerHTML = '완료';
                document.getElementsByClassName('scheduleBtnDiv')[1].innerHTML
                    = '<button class="btn-empty" onclick="closeModal(this, \'edit\')">닫기</button>'
                        + '<button class="saveBtn" onclick="editSchedule(\'' + scheduleId + '\')">완료</button>'
                /*document.getElementsByClassName('saveBtn')[0].setAttribute('onclick', 'editSchedule(\'' + scheduleId + '\')')*/
                console.log(document.getElementsByClassName('modal_schedule_body_top')[0].innerHTML);

                /* 시작일, 종료일 */
                document.getElementById('startDate').type = 'datetime-local';
                document.getElementById('startDate').value = res.schedule.startDate.substring(0, 16);
                document.getElementById('endDate').type = 'datetime-local';
                document.getElementById('endDate').value = res.schedule.endDate.substring(0, 16);

                /* 제목, 내용, 우선순위, 주소 */
                document.getElementById('scheduleName').value = res.schedule.title;
                document.getElementById('scheduleContent').value = res.schedule.content;
                document.getElementById('schedulePriority').value = res.schedule.priority;
                document.getElementById('addrInput').value = res.schedule.address;
                document.getElementById('value1').innerHTML = document.getElementById('schedulePriority').value;
                /* 희성이코드 */
                const tagListDiv = document.querySelector('.tagListDiv');
                tagListDiv.innerHTML = '';
                console.log('tag : ' + JSON.stringify(res.schedule));
                res.schedule.tagInfo.map((result) => {
                    tagListDiv.innerHTML += '<div class ="autoTagDiv ' + 'tag' + result.content + '"  onclick="deleteTag(\'' + result.content + '\')">' +
                        '<span class="tagValue" id="tagValue" value="' + result.content +'">' + result.content + '</span>' +
                        '<i class="fa-regular fa-circle-xmark deleteTagValue" style="display: none"></i>' +
                        '</div>'
                })
                searchAddr();
                tagMotion();

            },
            error: function (err) {
                window.alert("일정 정보를 불러오지 못하였습니다.")
                console.log(err)
            }
        })
    }
    else{
        /* 오늘 날짜 9시간 계산 및 분단위까지 표현 */
        let date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);
        document.getElementById('startDate').setAttribute('type', 'datetime-local');
        document.getElementById('startDate').value = date;
    }

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
    tagMotion();

}
/* 시차 세팅 */
function setTime(date){
    let splitTime = date.split('T');
    let newTime = 1 * (splitTime[1]).split(':')[0] + 9;
    let newDay = splitTime[0];
    if(newTime > 24){
        newTime -= 24;
    }
    if(newTime.toString().length < 2){
        newTime = '0' + newTime;
        console.log('split : ' + (1 * newDay.slice(8) + 1))
        newDay = 1 * splitTime[0].slice(8) + 1;
        console.log(splitTime[0])

        console.log('0 to 8 : ' + splitTime[0].substring(0, 8))
        newDay = splitTime[0].substring(0, 8) + newDay
        console.log('newDay: ' + newDay)
    }
    console.log('newTime: ' + newTime)
    let newDate = newDay + 'T' + newTime + ':' + splitTime[1].split(':')[1]
    console.log('newDate: ' + newDate)
    return newDate;
}
function editSchedule(scheduleId){
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    const title = document.getElementById('scheduleName').value;
    const content = document.getElementById('scheduleContent').value;
    const priority = document.getElementById('schedulePriority').value;
    const address = document.getElementById('addrInput').value;
    const tagValue = document.getElementsByClassName('tagValue');
    const arrayTag = [];

    for(let i = 0; i < tagValue.length; i++){
        arrayTag.push(tagValue[i].getAttribute('value'))
    }
    console.log('1 : ' + startDate + ' - ' + endDate)
    startDate = setTime(startDate);
    endDate = setTime(endDate);

    /* 일정 편집 API 요청 */
    $.ajax({
        type: 'POST',
        url: 'schedule/update/' + scheduleId,
        data: {startDate: startDate,
                endDate: endDate,
                title: title,
                content: content,
                priority: priority,
                address: address,
                tagInfo: arrayTag},
        dataType: "json",
        success: function (res) {
            alert('일정 편집이 완료되었습니다.');
            window.location.reload();
        },
        error: function (err) {
            window.alert("수정 실패")
            console.log(err)
        }
    })
}

function deleteSchedule(scheduleId){
    if(confirm('일정을 삭제하시겠습니까?')){
        /* 일정 삭제 API 요청 */
        $.ajax({
            type: 'POST',
            url: 'schedule/delete/' + scheduleId,
            dataType: "json",
            success: function (res) {
                alert('일정을 삭제했습니다.');
                window.location.reload();
            },
            error: function (err) {
                window.alert("삭제 실패")
                console.log(err)
            }
        })
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
    /* 클릭으로 태그 선택 */
    for(let i = 0; i < autoTag.length; i++){
        autoTag[i].addEventListener('click', function () {
            let selectedTag = autoTag[i].getAttribute('value');
            tagListDiv.innerHTML += '<div class ="autoTagDiv ' + 'tag' + selectedTag + '"  onclick="deleteTag(\'' + selectedTag + '\')">' +
                '<span class="tagValue" id="tagValue" value="' + selectedTag +'">' + selectedTag + '</span>' +
                '<i class="fa-regular fa-circle-xmark deleteTagValue" style="display: none"></i>' +
                '</div>'
            tagList.innerHTML= ''
            document.getElementById('scheduleTag').value = null
            tagMotion();
        })
    }
    /* 엔터로 태그 선택 또는 등록 */
    if (event.keyCode == 13) {
        tagListDiv.innerHTML += '<div class = "autoTagDiv ' + 'tag' + str + '" onclick="deleteTag(\'' + str + '\')">' +
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
    document.querySelector(`.autoTagDiv.tag${selectedTag}`).remove();
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