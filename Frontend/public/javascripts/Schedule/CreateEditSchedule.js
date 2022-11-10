/**
 * 담당자 : 배도훈
 * 변수 설명 : body태그와 모달들을 변수로 저장
 */
const body = document.querySelector('body')
const listModal = document.querySelector('.modal_schedule--list')
const editModal = document.querySelector('.modal_schedule--edit')
const mapModal = document.getElementsByClassName('modal_schedule_body')[2];

/**
 * 담당자 : 배도훈
 * 함수 설명 : 모달창을 닫는 이벤트리스너
 * 주요 기능 : 배경 클릭 시 모달창 닫는 기능
 */
listModal.addEventListener('mousedown', closeModal)
editModal.addEventListener('mousedown', closeModal)

/**
 * 담당자 : 배도훈
 * 함수 설명 : 모달창을 닫는 함수
 * 주요 기능 : 배경 또는 닫기 버튼 클릭 시 모달창을 닫는 기능
 */
function closeModal(event, modal) {
    /** 닫기 버튼 클릭 시 */
    if (event.currentTarget == event.target) {
        /** 클릭한 영역에 따라 닫는 모달창 상이 */
        if (modal == 'list') {
            listModal.classList.remove('show');
        } else if (modal == 'edit') {
            editModal.classList.remove('show');

            /** 모달 타이틀과 내용 초기화 */
            document.getElementsByClassName('modal_schedule_body_top')[1].innerText = '';
            const inputTags = document.querySelectorAll('input:not(input[type="hidden"])')
            for (let i = 0; i < inputTags.length; i++) {
                inputTags[i].value = '';
            }
            document.getElementById('endDate').setAttribute('type', 'text');
            document.getElementsByClassName('tagListDiv')[0].innerHTML = '';
            document.getElementsByClassName('scheduleBtnDiv')[1].innerHTML = '';
        /** 배경 클릭 시 */
        } else {
            listModal.classList.remove('show');
            editModal.classList.remove('show');

            /** 내용  초기화 */
            const inputTags = document.querySelectorAll('input:not(input[type="hidden"])')
            for (let i = 0; i < inputTags.length; i++) {
                inputTags[i].value = '';
            }
            document.getElementById('endDate').setAttribute('type', 'text');
            document.getElementsByClassName('tagListDiv')[0].innerHTML = '';
        }
        localStorage.clear()

        /** 체크박스 및 카카오맵 모달 해제 */
        mapModal.classList.remove('show');
        
        /** 빈값일 때 메세지 및 테이블 display 변경 */
        document.querySelector('.modal_schedule_body_mid .scheduleTableDiv table').style.display = 'table'
        document.querySelector('.modal_schedule_body_mid .scheduleTableDiv .emptyMessageDiv').style.display = 'none'
    }

}

/**
 * 담당자 : 정희성, 배도훈
 * 함수 설명 : 일정 목록 모달을 여는 함수
 * 주요 기능 : 캘린더에서 날짜 클릭 시 해당 날짜의 일정 목록을 표시
 */
function openListModal(selectedEventList, infoDate) {
    /**
     * 담당자 : 정희성
     * 함수 설명 :
     * 주요 기능 :
     */
    function getDate(dateValue) {
        const years = dateValue.substring(0,4)
        const month = dateValue.substring(5,7)
        const date = dateValue.substring(8,10)
        const ampm = parseInt(dateValue.substring(11,13)) >= 12 ? 'pm' : 'am';
        const hours = parseInt(dateValue.substring(11,13)) % 12 ? (parseInt(dateValue.substring(11,13)) % 12 < 10 ? '0' + parseInt(dateValue.substring(11,13)) % 12 : parseInt(dateValue.substring(11,13)) % 12) : '0' + 0;
        const minutes = dateValue.substring(14,16)
        const customDate = `${years}-${month}-${date}. ${ampm} ${hours}:${minutes}`;

        return customDate;
    }
    const date = new Date(infoDate)
    document.querySelector('.modal_schedule_body_top').innerHTML = '<span>'+ date.getFullYear() +'년 ' + (date.getMonth() + 1) +'월 '+ date.getDate()+'일 일정 목록' +'</span>'

    /**
     * 담당자 : 배도훈
     * 일정 생성 시 오늘 날짜를 인자로 가지는 함수를 onclick으로 지정
     */
    document.querySelector('.scheduleAdd__div').setAttribute('onclick', 'openCreateModal(\'' + infoDate + '\')')
    let tbodyTag = document.getElementById('scheduleTbody');

    /** 일정 데이터 바인딩 */
    let str = '';
    for (let i = 0; i < selectedEventList.length; i++) {
        str += '<tr>';
        str += '<td onclick="openDetailModal(\'' + selectedEventList[i].id + '\')">' + selectedEventList[i].title + '</td>';
        str += '<td onclick="openDetailModal(\'' + selectedEventList[i].id + '\')">' + getDate(selectedEventList[i].start) + '</td>';
        str += '<td onclick="openDetailModal(\'' + selectedEventList[i].id + '\')">' + getDate(selectedEventList[i].end) + '</td>';
        str += '</tr>';
    }
    tbodyTag.innerHTML = str;
    /** 해당 날짜에 일정이 없을 때 */
    if(selectedEventList.length == 0){
        document.querySelector('.modal_schedule_body_mid .scheduleTableDiv table').style.display = 'none'
        document.querySelector('.modal_schedule_body_mid .scheduleTableDiv .emptyMessageDiv').style.display = 'flex'
    }

    listModal.classList.add('show')
    if (listModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 일정 목록 정렬 함수
 * 주요 기능 : thead의 th 클릭 시 해당 컬럼의 데이터를 기준으로 오름차순, 내림차순 정렬
 */
function sortList(item, order) {
    /** tr 배열 */
    let rows = document.querySelectorAll('.scheduleTable tbody tr')
    /** 정렬을 위한 배열 */
    let arr = [];
    for (let i = 0; i < rows.length; i++) {
        arr.push(rows[i])
    }

    /** order 변수에 따라 오름차순인지 내림차순인지 결정하여 정렬 */
    let condition
    arr.sort((a, b) => {
        switch (item) {
            case 'title'
            :   condition = a.firstElementChild.innerText > b.firstElementChild.innerText;
                break;
            case 'startDate'
            :   condition = a.children[1].innerText > b.children[1].innerText;
                break;
            case 'endDate'
            :   condition = a.lastElementChild.innerText > b.lastElementChild.innerText;
            break;
        }

        if (order == 'asc') {
            return condition ? 1 : -1;
        } else {
            return condition ? -1 : 1;
        }
    })

    /** 정렬한 데이터를 화면에 표시 */
    let str = ''
    let onclick = ''
    for (let i = 0; i < arr.length; i++) {
        onclick = arr[i].getAttribute('onclick');
        str += '<tr onclick="' + onclick + '">' + arr[i].innerHTML + '</tr>'
    }
    document.querySelector('#scheduleTbody').innerHTML = str;

    /** 제목, 시작일, 종료일 중 onclick 속성 함수의 order 인자가 변경될 요소 지정 */
    let target = document.querySelectorAll('.scheduleTable th');
    switch (item) {
        case 'title'
        :   target = target[0];
            break;
        case 'startDate'
        :   target = target[1];
            break;
        case 'endDate'
        :   target = target[2];
            break;
    }
    if (order == 'asc') {
        target.setAttribute('onclick', 'sortList(\'' + item + '\', \'desc\')')
    } else {
        target.setAttribute('onclick', 'sortList(\'' + item + '\', \'asc\')')
    }

}

/**
 * 담당자 : 정희성
 * 함수 설명 :
 * 주요 기능 :
 */
function tagSearch() {
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

    /* 일정상태 */
    document.getElementsByClassName('scheduleStatusDiv')[0].innerHTML
        = '<label>일정 상태</label>'
        + '<div id="scheduleStatus" class="scheduleStatus"></div>';

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

    document.getElementsByClassName('scheduleCreator')[0].innerHTML
        = '<label>생성자</label>'
        + '<div id="scheduleCreator" class="scheduleCreator"></div>'

    /* 버튼 div */
    let scheduleBtnDiv = document.getElementsByClassName('scheduleBtnDiv')[1]
    scheduleBtnDiv.innerHTML = '<button class="btn-empty" onclick="closeModal(this, \'edit\')">닫기</button>'


    $.ajax({
        type: 'POST',
        url: 'schedule/find/' + scheduleId,
        dataType: "json",
        success: function (res) {

            if (res.schedule.userInfo._id == document.getElementById('userElement').value) {
                scheduleBtnDiv.innerHTML
                    += '<button class="saveBtn btn-red" onclick="deleteSchedule(\'' + scheduleId + '\')">삭제</button>'
                    + '<button class="saveBtn" onclick="openEditModal(\'' + scheduleId + '\')">편집</button>'
            }
            /*시간 포맷 지정*/
            function getDate(dateValue) {
                const years = dateValue.substring(0,4)
                const month = dateValue.substring(5,7)
                const date = dateValue.substring(8,10)
                const ampm = parseInt(dateValue.substring(11,13)) >= 12 ? 'PM' : 'AM';
                const hours = parseInt(dateValue.substring(11,13)) % 12 ? (parseInt(dateValue.substring(11,13)) % 12 < 10 ? '0' + parseInt(dateValue.substring(11,13)) % 12 : parseInt(dateValue.substring(11,13)) % 12) : '0' + 0;
                const minutes = dateValue.substring(14,16)
                const customDate = `${years}-${month}-${date} ${ampm} ${hours}:${minutes}`;

                return customDate;
            }
            /*문자 자르기*/
            function stringCut(text) {
                let title;
                if (text.length > 10) {
                    title = text.substring(0, 10);
                    title += '...';
                } else {
                    title = text
                }
                return title;
            }


            /* 시작일, 종료일 */
            document.getElementById('startDate').innerText = getDate(res.schedule.startDate)
            document.getElementById('endDate').innerText = getDate(res.schedule.endDate)

            /* 일정제목 */
            document.getElementById('scheduleName').innerText = stringCut(res.schedule.title);

            /* 일정상태 */
            document.getElementById('scheduleStatus').innerText = res.schedule.status ? '완료' : '미완료';

            /* 일정내용 */
            document.getElementById('scheduleContent').innerText = res.schedule.content;

            /* 우선순위 */
            document.getElementById('schedulePriority').innerText = res.schedule.priority;

            /* 태그입력란 */
            document.getElementById('scheduleTag').style.display = 'none';

            /*작성자란*/
            document.getElementById('scheduleCreator').innerHTML =
                '<div class="creatorUser">' +
                '<img class="userImage" src="'+ res.schedule.userInfo.image +'">' +
                '<div class="userName">'+ res.schedule.userInfo.name +'</div>' +
                '</div>'

            /* 주소 사용 여부 */
            if (!res.schedule.address == '') {
                document.getElementById('scheduleAddr').innerText = res.schedule.address;
            } else {
                document.getElementById('scheduleAddr').innerText = '주소 미등록'
            }

            /* 희성이코드 */
            const tagListDiv = document.querySelector('.tagListDiv');
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

    /* 일정상태 */
    document.getElementsByClassName('scheduleStatusDiv')[0].innerHTML
        = '<label>일정 상태</label>'
        + '<select type="text" id="scheduleStatus" class="scheduleStatus">' +
        '<option value="false">미완료</option>' +
        '<option value="true">완료</option>' +
        '</select>';

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

    /*생성자*/
    document.getElementsByClassName('scheduleCreator')[0].innerHTML = ''

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

            /* 제목, 상태, 내용, 우선순위, 주소 */
            document.getElementById('scheduleName').value = res.schedule.title;
            let statusOptions = document.getElementById('scheduleStatus').children;
            res.schedule.status ? statusOptions[1].selected = true : statusOptions[0].selected = true;
            document.getElementById('scheduleContent').value = res.schedule.content;
            document.getElementById('schedulePriority').value = res.schedule.priority;
            document.getElementById('addrInput').value = res.schedule.address;
            document.getElementById('value1').innerHTML = document.getElementById('schedulePriority').value;

            /* 희성이코드 */
            const tagListDiv = document.querySelector('.tagListDiv');
            tagListDiv.innerHTML = '';
            res.schedule.tagInfo.map((result) => {
                tagListDiv.innerHTML += '<div class ="autoTagDiv ' + 'tag' + result.content + '"  onclick="deleteTag(this)">' +
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
    const tagValue = document.getElementsByClassName('tagValue');
    const arrayTag = [];

    for (let i = 0; i < tagValue.length; i++) {
        arrayTag.push(tagValue[i].getAttribute('value'))
    }
    const schedules = {
        startDate: setTime(document.getElementById('startDate').value),
        endDate: setTime(document.getElementById('endDate').value),
        title: document.getElementById('scheduleName').value,
        status: document.getElementById('scheduleStatus').value,
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
        /* 일정 편집 API 요청 */
        $.ajax({
            type: 'POST',
            url: 'schedule/update/' + scheduleId,
            data: schedules,
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
        status: document.getElementById('scheduleStatus').value,
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
            tagListDiv.innerHTML += '<div class ="autoTagDiv ' + 'tag' + selectedTag + '"  onclick="deleteTag(this)">' +
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
        tagListDiv.innerHTML += '<div class = "autoTagDiv ' + 'tag' + str + '" onclick="deleteTag(this)">' +
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
    selectedTag.remove();
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

    calendar.refetchEvents();
}