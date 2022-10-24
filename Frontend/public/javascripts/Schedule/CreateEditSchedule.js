const body = document.querySelector('body')
const listModal = document.querySelector('.modal_schedule--list')
const editModal = document.querySelector('.modal_schedule--edit')
const mapModal = document.getElementsByClassName('modal_schedule_body')[2];

/* 배경 클릭 시 모달창 닫는 이벤트리스너 */
listModal.addEventListener('mousedown', closeModal)
editModal.addEventListener('mousedown', closeModal)

/* 모달창 닫는 함수 */
function closeModal(event, modal) {
    if (event.currentTarget == event.target) {
        if (modal == 'list') {
            listModal.classList.remove('show');
        } else if (modal == 'edit') {
            editModal.classList.remove('show');
            /* 타이틀 초기화 */
            document.getElementsByClassName('modal_schedule_body_top')[1].innerText = '';
            /* 내용  초기화 */
            const inputTags = document.querySelectorAll('input:not(input[type="hidden"])')
            for (let i = 0; i < inputTags.length; i++) {
                inputTags[i].value = '';
            }
            document.getElementById('endDate').setAttribute('type', 'text');
            document.getElementsByClassName('tagListDiv')[0].innerHTML = '';
            document.getElementsByClassName('scheduleBtnDiv')[1].innerHTML = '';
        } else {
            listModal.classList.remove('show');
            editModal.classList.remove('show');

            /* 내용  초기화 */
            const inputTags = document.querySelectorAll('input:not(input[type="hidden"])')
            for (let i = 0; i < inputTags.length; i++) {
                inputTags[i].value = '';
            }
            document.getElementById('endDate').setAttribute('type', 'text');
            document.getElementsByClassName('tagListDiv')[0].innerHTML = '';
        }
        localStorage.clear()

        /* 체크박스 및 카카오맵 모달 해제 */
        mapModal.classList.remove('show');
    }

}

function openListModal(selectedEventList, infoDate) {
    /* 일정 생성 시 오늘 날짜를 인자로  */
    document.querySelector('.scheduleAdd__div').setAttribute('onclick', 'openCreateModal(\'' + infoDate + '\')')

    let tbodyTag = document.getElementById('scheduleTbody');
    let str = '';
    for (let i = 0; i < selectedEventList.length; i++) {
        str += '<tr onclick="openDetailModal(\'' + selectedEventList[i].id + '\')">';
        str += '<td>' + selectedEventList[i].title + '</td>';
        str += '<td>' + selectedEventList[i].start.substring(0, 10) + ' ' + selectedEventList[i].start.substring(11, 16) + '</td>';
        str += '<td>' + selectedEventList[i].end.substring(0, 10) + ' ' + selectedEventList[i].end.substring(11, 16) + '</td>';
        str += '</tr>';
    }
    tbodyTag.innerHTML = str;

    listModal.classList.add('show')
    if (listModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
}

function tagSearch() {
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
}

/* 일정 상세 모달 */
function openDetailModal(scheduleId) {
    /* 모달 탑 */
    document.getElementsByClassName('modal_schedule_body_top')[1].innerHTML = '일정 상세';

    /* 시작일, 종료일 */
    document.getElementsByClassName('dateDiv')[0].innerHTML
        = '<div id="startDate" clsss="startDate date"></div>'
        + '<div id="endDate" clsss="endDate date"></div>';

    /* 일정제목 */
    document.getElementsByClassName('scheduleNameDiv')[0].innerHTML
        = '<label>일정 제목</label>'
        + '<div id="scheduleName" class="scheduleName"></div>';

    /* 일정내용 */
    document.getElementsByClassName('scheduleContentDiv')[0].innerHTML
        = '<label>일정 내용</label>'
        + '<div id="scheduleContent" class="scheduleContent"></div>';

    /* 우선순위 */
    document.getElementsByClassName('schedulePriorityDiv')[0].innerHTML
        = '<label>우선순위</label>'
        + '<div id="schedulePriority" class="schedulePriority"></div>'

    /* 주소 사용 여부 */
    document.getElementsByClassName('addressDiv')[0].innerHTML
        = '<label>주소</label>'
        + '<div id="scheduleAddr" class="scheduleAddr"></div>'

    /* 버튼 div */
    let scheduleBtnDiv = document.getElementsByClassName('scheduleBtnDiv')[1]
    scheduleBtnDiv.innerHTML = '<button class="btn-empty" onclick="closeModal(this, \'edit\')">닫기</button>'


    $.ajax({
        type: 'POST',
        url: 'schedule/find/' + scheduleId,
        dataType: "json",
        success: function (res) {
            console.log('creator : ' + res.schedule.userInfo)
            console.log('user : ' + document.getElementById('userElement').value)

            if (res.schedule.userInfo == document.getElementById('userElement').value) {
                scheduleBtnDiv.innerHTML
                    += '<button class="saveBtn btn-red" onclick="deleteSchedule(\'' + scheduleId + '\')">삭제</button>'
                    + '<button class="saveBtn" onclick="openEditModal(\'' + scheduleId + '\')">편집</button>'
            }


            /* 시작일, 종료일 */
            document.getElementById('startDate').innerText = res.schedule.startDate.substring(0, 16);
            document.getElementById('endDate').innerText = res.schedule.endDate.substring(0, 16);

            /* 일정제목 */
            document.getElementById('scheduleName').innerText = res.schedule.title;

            /* 일정내용 */
            document.getElementById('scheduleContent').innerText = res.schedule.content;

            /* 우선순위 */
            document.getElementById('schedulePriority').innerText = res.schedule.priority;

            /* 태그입력란 */
            document.getElementById('scheduleTag').style.display = 'none';

            /* 주소 사용 여부 */
            if (!res.schedule.address == '') {
                document.getElementById('scheduleAddr').innerText = res.schedule.address;
            } else {
                document.getElementById('scheduleAddr').innerText = '주소 미등록'
            }

            /* 희성이코드 */
            const tagListDiv = document.querySelector('.tagListDiv');
            console.log('tag : ' + JSON.stringify(res.schedule));
            tagListDiv.innerHTML = '';
            res.schedule.tagInfo.map((result) => {
                tagListDiv.innerHTML += '<div class ="autoTagDiv ' + 'tag' + result.content + '">' +
                    '<span class="tagValue" id="tagValue" value="' + result.content + '" style="cursor: auto">' + result.content + '</span>' +
                    '</div>'
            })

        },
        error: function (err) {
            window.alert("일정 정보를 불러오지 못하였습니다.")
            console.log(err)
        }
    })
    mapModal.classList.remove('show');
    editModal.classList.add('show')
    if (editModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
}

function setMinMaxDate() {
    let startDate = document.getElementById('startDate')
    let endDate = document.getElementById('endDate')

    startDate.setAttribute('max', endDate.value)
    endDate.setAttribute('min', startDate.value)
}

function openCreateModal(infoDate) {
    /* 모달 타이틀 */
    document.getElementsByClassName('modal_schedule_body_top')[1].innerText = '일정 생성'

    /* 시작일, 종료일 */
    document.getElementsByClassName('dateDiv')[0].innerHTML
        = '<input onfocus="(this.type=\'datetime-local\'), setMinMaxDate()" type="text" id="startDate" clsss="startDate date" placeholder="시작일 선택">'
        + '<input onfocus="(this.type=\'datetime-local\'), setMinMaxDate()" type="input" id="endDate" clsss="endDate date" placeholder="종료일 선택">';

    /* 오늘 날짜 9시간 계산 및 분단위까지 표현 */
    let date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);
    let startDate = document.getElementById('startDate');
    let endDate = document.getElementById('endDate');
    startDate.type = 'datetime-local';
    startDate.value = infoDate;


    /* 일정제목 */
    document.getElementsByClassName('scheduleNameDiv')[0].innerHTML
        = '<label>일정 제목</label>'
        + '<input type="text" id="scheduleName" class="scheduleName">';

    /* 일정내용 */
    document.getElementsByClassName('scheduleContentDiv')[0].innerHTML
        = '<label>일정 내용</label>'
        + '<input type="text" id="scheduleContent" class="scheduleContent">';

    /* 우선순위 */
    document.getElementsByClassName('schedulePriorityDiv')[0].innerHTML
        = '<label>우선순위</label>'
        + '<input type="range" id="schedulePriority" class="schedulePriority"\n' +
        'min="0" max="5" step="1" value="3" oninput="document.getElementById(\'value1\').innerHTML=this.value;">'
        + '<span id="value1">3</span>';

    /* 태그 검색하는 함수 */
    tagSearch()

    /* 태그입력란 */
    document.getElementById('scheduleTag').style.display = 'flex';

    /* 주소 사용 여부 */
    document.getElementsByClassName('addressDiv')[0].innerHTML
        = '<label>주소</label>'
        + '<input onclick="addrToggle()" type="checkbox" id="addrCheckbox" class="addrCheckbox">'
        + '<div>주소 사용 여부</div>';

    /* 버튼 div */
    document.getElementsByClassName('scheduleBtnDiv')[1].innerHTML
        = '<button class="btn-empty" onclick="closeModal(this, \'edit\')">닫기</button>'
        + '<button class="saveBtn" onclick="saveSchedule()">완료</button>'

    /* 지도 모달 */
    document.getElementsByClassName('scheduleAddrInputDiv')[0].innerHTML
        = '<input class="addrInput" id="addrInput" type="text" placeholder="주소를 입력하세요" onkeyup="enterSearchAddr()">'
        + '<button class="btn-gray" onclick="searchAddr()">검색</button>'

    mapModal.classList.remove('show');
    editModal.classList.add('show')
    if (editModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
}

function openEditModal(scheduleId) {
    tagSearch()
    openCreateModal()

    /* 모달 탑 */
    document.getElementsByClassName('modal_schedule_body_top')[1].innerHTML = '일정 편집';

    /* 버튼 div */
    document.getElementsByClassName('scheduleBtnDiv')[1].innerHTML
        = '<button class="btn-empty" onclick="openDetailModal(\'' + scheduleId + '\')">취소</button>'
        + '<button class="saveBtn" onclick="editSchedule(\'' + scheduleId + '\')">완료</button>'

    $.ajax({
        type: 'POST',
        url: 'schedule/find/' + scheduleId,
        dataType: "json",
        success: function (res) {

            /* 시작일, 종료일 */
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
                    '<span class="tagValue" id="tagValue" value="' + result.content + '">' + result.content + '</span>' +
                    '<i class="fa-regular fa-circle-xmark deleteTagValue"></i>' +
                    '</div>'
            })
            /* 주소 사용 여부 및 주소 데이터 유무 확인 */
            if (document.getElementsByClassName('addrInput')[0].value) {
                document.getElementsByClassName('addrCheckbox')[0].disabled = false;
                document.getElementsByClassName('addrCheckbox')[0].checked = true;
                addrToggle()
            }
        },
        error: function (err) {
            window.alert("일정 정보를 불러오지 못하였습니다.")
            console.log(err)
        }
    })

    tagSearch()
    mapModal.classList.remove('show');
    editModal.classList.add('show')
    if (editModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
}

function setTime(date) {
    let date1 = new Date(date + ':00');
    let newDate = new Date(date1.getTime() - new Date().getTimezoneOffset() * 120000).toISOString().slice(0, -8);
    return newDate;
}

function editSchedule(scheduleId) {
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    const title = document.getElementById('scheduleName').value;
    const content = document.getElementById('scheduleContent').value;
    const priority = document.getElementById('schedulePriority').value;
    const address = document.getElementById('addrInput').value;
    const tagValue = document.getElementsByClassName('tagValue');
    const arrayTag = [];

    for (let i = 0; i < tagValue.length; i++) {
        arrayTag.push(tagValue[i].getAttribute('value'))
    }
    console.log('1 : ' + startDate + ' - ' + endDate)
    startDate = setTime(startDate);
    endDate = setTime(endDate);
    if (startDate > endDate) {
        alert('일정 시작일과 종료일을 다시 확인해주세요.')
    }
    /* 일정 편집 API 요청 */
    $.ajax({
        type: 'POST',
        url: 'schedule/update/' + scheduleId,
        data: {
            startDate: startDate,
            endDate: endDate,
            title: title,
            content: content,
            priority: priority,
            address: address,
            tagInfo: arrayTag
        },
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

function deleteSchedule(scheduleId) {
    if (confirm('일정을 삭제하시겠습니까?')) {
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
    if (addrChecked) {
        mapModal.classList.add('show');
        searchAddr();
    } else {
        mapModal.classList.remove('show');
        document.getElementById('addrInput').value = '';
    }
    if (mapModal.classList.contains('show')) {
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
        startDate: setTime(document.getElementById('startDate').value),
        endDate: setTime(document.getElementById('endDate').value),
        title: document.getElementById('scheduleName').value,
        content: document.getElementById('scheduleContent').value,
        priority: document.getElementById('schedulePriority').value,
        address: document.getElementById('addrInput').value,
        tagInfo: arrayTag,
    }
    if (schedules.startDate > schedules.endDate) {
        alert('시작일, 종료일을 다시 확인해주세요.')
        return
    } else if (!schedules.title) {
        alert('일정 제목을 입력해주세요.')
        return
    } else if (!schedules.content) {
        alert('일정 내용을 입력해주세요.')
        return
    } else if (!schedules.priority) {
        alert('우선순위를 입력해주세요.')
        return
    } else if (schedules.tagInfo.length == 0) {
        alert('태그를 입력해주세요.')
        return
    } else {
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
}

/* 태그 input onblur 시 */
function ScheduleTagOnblur() {
    /* mouseup의 타겟이  */
    window.onmouseup = function (e) {
        let targetClass = e.target.classList[0]
        if (targetClass != 'autoTag' && targetClass != 'scheduleTag' && targetClass != 'autoTagList') {
            const tagList = document.querySelector('.tagList')
            tagList.innerHTML = '';
        }
    }
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
                    '<li class="autoTag" value="' + res + '">' + res + '</li>'
                bool = true;
            }
        });
        if (bool == false) {
            tagList.innerHTML = '';
        }
    } else {
        tagList.innerHTML =
            '<ul id="autoTagListUl" class="autoTagList"></ul>';
        const autoTagList = document.querySelector('.autoTagList');

        tags.map((res) => {
            autoTagList.innerHTML +=
                '<li class="autoTag" value="' + res + '">' + res + '</li>'

        })
    }

    const autoTag = document.getElementsByClassName('autoTag');
    /* 클릭으로 태그 선택 */
    for (let i = 0; i < autoTag.length; i++) {
        autoTag[i].addEventListener('click', function () {
            let selectedTag = autoTag[i].getAttribute('value');
            tagListDiv.innerHTML += '<div class ="autoTagDiv ' + 'tag' + selectedTag + '"  onclick="deleteTag(\'' + selectedTag + '\')">' +
                '<span class="tagValue" id="tagValue" value="' + selectedTag + '">' + selectedTag + '</span>' +
                '<i class="fa-regular fa-circle-xmark deleteTagValue"></i>' +
                '</div>'
            tagList.innerHTML = ''
            document.getElementById('scheduleTag').value = null
            /*tagMotion();*/
        })
    }
    /* 엔터로 태그 선택 또는 등록 */
    if (event.keyCode == 13) {
        tagListDiv.innerHTML += '<div class = "autoTagDiv ' + 'tag' + str + '" onclick="deleteTag(\'' + str + '\')">' +
            '<span class="tagValue" id="tagValue" value="' + str + '">' + str + '</span>' +
            '<i class="fa-regular fa-circle-xmark deleteTagValue"></i>' +
            '</div>'
        tagList.innerHTML = ''
        document.getElementById('scheduleTag').value = null
        /*tagMotion();*/
    }
}

/*function tagMotion() {
    let autoTagDiv = document.getElementsByClassName('autoTagDiv')

    for (let i = 0; i < autoTagDiv.length; i++) {
        document.getElementsByClassName('autoTagDiv')[i].addEventListener('mouseover', function () {
            document.getElementsByClassName('deleteTagValue')[i].style.display = 'flex';
        })
        document.getElementsByClassName('autoTagDiv')[i].addEventListener('mouseleave', function () {
            document.getElementsByClassName('deleteTagValue')[i].style.display = 'none';
        })
    }
}*/

function deleteTag(selectedTag) {
    /*document.getElementsByClassName('aaa')[0].remove();*/
    document.querySelector(`.autoTagDiv.tag${selectedTag}`).remove();
    /*tagMotion()*/
}

/* 캘린더에 일정 바인딩 */
function readEvents() {
    let eventData = {
        title: '취침',
        start: '2022-08-15',
        end: '2022-08-15',
        id: '123123'
    }
    calendar.currentData.calendarOptions.events.push(eventData);
    /*console.log(calendar.currentData.calendarOptions.events);*/

    calendar.refetchEvents();
}