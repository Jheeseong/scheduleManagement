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
 *            시간 형식을 am/pm으로 변환 - 정희성
 *            일정 생성 시 오늘 날짜를 인자로 가지는 함수를 onclick으로 지정 - 배도훈
 *            일정 데이터 바인딩 - 배도훈
 *            해당 날짜에 일정 없을 때 display 처리 - 배도훈
 */
function openListModal(selectedEventList, infoDate) {
    /** 시간 형식을 am/pm으로 변환 */
    function getDate(dateValue) {
        const eventDate = new Date(dateValue)
        const years = eventDate.getFullYear()/*dateValue.substring(0,4)*/
        const month = eventDate.getMonth() < 10 ? '0' + eventDate.getMonth() : eventDate.getMonth()/*dateValue.substring(5,7)*/
        const date = eventDate.getDate() < 10 ? '0' + eventDate.getDate() : eventDate.getDate()/*dateValue.substring(8,10)*/
        const ampm = eventDate.getHours() >= 12 ? 'pm' : 'am';
        const hours = eventDate.getHours() % 12 ? eventDate.getHours() % 12 < 10 ? '0' + eventDate.getHours() % 12 : eventDate.getHours() % 12 : '0' + 0; /*parseInt(dateValue.substring(11,13)) % 12 ? (parseInt(dateValue.substring(11,13)) % 12 < 10 ? '0' + parseInt(dateValue.substring(11,13)) % 12 : parseInt(dateValue.substring(11,13)) % 12) : '0' + 0;*/
        const minutes = eventDate.getMinutes() < 10 ? '0' + eventDate.getMinutes() : eventDate.getMinutes();/*dateValue.substring(14,16)*/
        const customDate = `${years}-${month}-${date}. ${ampm} ${hours}:${minutes}`;

        return customDate;
    }
    const date = infoDate
    document.querySelector('.modal_schedule_body_top').innerHTML = '<span>'+ date.getFullYear() +'년 ' + (date.getMonth() + 1) +'월 '+ date.getDate()+'일 일정 목록' +'</span>'

    /** 일정 생성 시 오늘 날짜를 인자로 가지는 함수를 onclick으로 지정 */
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
 * 함수 설명 : 모든 태그를 찾아오는 함수
 * 주요 기능 : 모든 태그를 찾는 기능
 *            찾은 태그들을 localStorage에 저장하는 기능
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
/**
 * 담당자 : 정희성, 배도훈
 * 함수 설명 : 일정의 상세내용을 모달창에 표시하는 함수
 * 주요 기능 : 일정의 상세내용을 모달창에 표시
 *            각 요소에 데이터 바인딩 - 배도훈
 *            생성자 바인딩 - 정희성
 *            일정 내용 조회 API 호출 - 배도훈
 *            날짜 형식 변환 - 정희성
 *            태그 영역 - 정희성
 */
function openDetailModal(scheduleId) {
    /** 모달 탑 */
    document.getElementsByClassName('modal_schedule_body_top')[1].innerHTML = '일정 상세';

    /** 시작일, 종료일 */
    document.getElementsByClassName('dateDiv')[0].innerHTML
        = '<div id="startDate" clsss="startDate date"></div>'
        + '<div id="endDate" clsss="endDate date"></div>';

    /** 일정제목 */
    document.getElementsByClassName('scheduleNameDiv')[0].innerHTML
        = '<label>일정 제목</label>'
        + '<div id="scheduleName" class="scheduleName"></div>';

    /** 일정상태 */
    document.getElementsByClassName('scheduleStatusDiv')[0].innerHTML
        = '<label>일정 상태</label>'
        + '<div id="scheduleStatus" class="scheduleStatus"></div>';

    /** 일정내용 */
    document.getElementsByClassName('scheduleContentDiv')[0].innerHTML
        = '<label>일정 내용</label>'
        + '<div id="scheduleContent" class="scheduleContent"></div>';

    /** 우선순위 */
    document.getElementsByClassName('schedulePriorityDiv')[0].innerHTML
        = '<label>우선순위</label>'
        + '<div id="schedulePriority" class="schedulePriority"></div>'

    /** 주소 사용 여부 */
    document.getElementsByClassName('addressDiv')[0].innerHTML
        = '<label>주소</label>'
        + '<div id="scheduleAddr" class="scheduleAddr"></div>'
    /** 생성자 */
    document.getElementsByClassName('scheduleCreator')[0].innerHTML
        = '<label>생성자</label>'
        + '<div id="scheduleCreator" class="scheduleCreator"></div>'

    /** 버튼 div */
    let scheduleBtnDiv = document.getElementsByClassName('scheduleBtnDiv')[1]
    scheduleBtnDiv.innerHTML = '<button class="btn-empty" onclick="closeModal(this, \'edit\')">닫기</button>'

    /** 일정의 내용을 조회하는 API 호출 */
    $.ajax({
        type: 'POST',
        url: 'schedule/find/' + scheduleId,
        dataType: "json",
        success: function (res) {
            /** 일정의 생성자가 현재 유저와 동일할 시 삭제, 편집 버튼 생성 */
            if (res.schedule.userInfo._id == document.getElementById('userElement').value) {
                scheduleBtnDiv.innerHTML
                    += '<button class="saveBtn btn-red" onclick="deleteSchedule(\'' + scheduleId + '\')">삭제</button>'
                    + '<button class="saveBtn" onclick="openEditModal(\'' + scheduleId + '\')">편집</button>'
            }
            /*시간 포맷 지정*/
            /** 날짜를 am/pm 형식으로 변환 */
            function getDate(dateValue) {
                const eventDate = new Date(dateValue)
                const years = eventDate.getFullYear()/*dateValue.substring(0,4)*/
                const month = eventDate.getMonth() < 10 ? '0' + eventDate.getMonth() : eventDate.getMonth()/*dateValue.substring(5,7)*/
                const date = eventDate.getDate() < 10 ? '0' + eventDate.getDate() : eventDate.getDate()/*dateValue.substring(8,10)*/
                const ampm = eventDate.getHours() >= 12 ? 'PM' : 'AM';
                const hours = eventDate.getHours() % 12 ? eventDate.getHours() % 12 < 10 ? '0' + eventDate.getHours() % 12 : eventDate.getHours() % 12 : '0' + 0; /*parseInt(dateValue.substring(11,13)) % 12 ? (parseInt(dateValue.substring(11,13)) % 12 < 10 ? '0' + parseInt(dateValue.substring(11,13)) % 12 : parseInt(dateValue.substring(11,13)) % 12) : '0' + 0;*/
                const minutes = eventDate.getMinutes() < 10 ? '0' + eventDate.getMinutes() : eventDate.getMinutes();/*dateValue.substring(14,16)*/
                const customDate = `${years}-${month}-${date}. ${hours}:${minutes}${ampm}`;

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


            /** 시작일, 종료일 */
            document.getElementById('startDate').innerText = getDate(res.schedule.startDate)
            document.getElementById('endDate').innerText = getDate(res.schedule.endDate)

            /* 일정제목 */
            document.getElementById('scheduleName').innerText = stringCut(res.schedule.title);

            /** 일정상태 */
            document.getElementById('scheduleStatus').innerText = res.schedule.status ? '완료' : '미완료';

            /** 일정내용 */
            document.getElementById('scheduleContent').innerText = res.schedule.content;

            /** 우선순위 */
            document.getElementById('schedulePriority').innerText = res.schedule.priority;

            /** 태그입력란 */
            document.getElementById('scheduleTag').style.display = 'none';

            /*작성자란*/
            document.getElementById('scheduleCreator').innerHTML =
                '<div class="creatorUser">' +
                '<img class="userImage" src="'+ res.schedule.userInfo.image +'">' +
                '<div class="userName">'+ res.schedule.userInfo.name +'</div>' +
                '</div>'

            /** 주소 사용 여부 */
            if (!res.schedule.address == '') {
                document.getElementById('scheduleAddr').innerText = res.schedule.address;
            } else {
                document.getElementById('scheduleAddr').innerText = '주소 미등록'
            }

            /** 태그 영역 */
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

/**
 * 담당자 : 배도훈
 * 함수 설명 : 일정 생성 또는 편집 시 일정 날짜의 전후관계를 성립시키는 함수
 * 주요 기능 : 일정 시작일과 종료일 선택 시 시작일 이전의 종료일이나 종료일 이후의 시작일은 선택할 수 없도록 제한하는 기능
 */
function setMinMaxDate() {
    let startDate = document.getElementById('startDate')
    let endDate = document.getElementById('endDate')

    startDate.setAttribute('max', endDate.value)
    endDate.setAttribute('min', startDate.value)
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 일정 생성 모달 표시 함수
 * 주요 기능 : 일정 생성 모달을 표시
 */
function openCreateModal(infoDate) {
    /** 모달 타이틀 */
    document.getElementsByClassName('modal_schedule_body_top')[1].innerText = '일정 생성'

    /** 시작일, 종료일 */
    document.getElementsByClassName('dateDiv')[0].innerHTML
        = '<input onfocus="(this.type=\'datetime-local\'), setMinMaxDate()" type="text" id="startDate" clsss="startDate date" placeholder="시작일 선택">'
        + '<input onfocus="(this.type=\'datetime-local\'), setMinMaxDate()" type="input" id="endDate" clsss="endDate date" placeholder="종료일 선택">';

    /** 오늘 날짜 9시간 계산 및 분단위까지 표현 */
    let date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);
    let startDate = document.getElementById('startDate');
    let endDate = document.getElementById('endDate');
    startDate.type = 'datetime-local';
    startDate.value = infoDate;


    /** 일정제목 */
    document.getElementsByClassName('scheduleNameDiv')[0].innerHTML
        = '<label>일정 제목</label>'
        + '<input type="text" id="scheduleName" class="scheduleName" oninput="checkTextLength(this,200)" maxlength="200">';

    /** 일정상태 */
    document.getElementsByClassName('scheduleStatusDiv')[0].innerHTML
        = '<label>일정 상태</label>'
        + '<select type="text" id="scheduleStatus" class="scheduleStatus">' +
        '<option value="false">미완료</option>' +
        '<option value="true">완료</option>' +
        '</select>';

    /** 일정내용 */
    document.getElementsByClassName('scheduleContentDiv')[0].innerHTML
        = '<label>일정 내용</label>'
        + '<input type="text" id="scheduleContent" class="scheduleContent">';

    /** 우선순위 */
    document.getElementsByClassName('schedulePriorityDiv')[0].innerHTML
        = '<label>우선순위</label>'
        + '<input type="range" id="schedulePriority" class="schedulePriority"\n' +
        'min="0" max="5" step="1" value="0" oninput="document.getElementById(\'value1\').innerHTML=this.value;">'
        + '<span id="value1">0</span>';

    /** 태그 검색하는 함수 */
    tagSearch()

    /** 생성자 */
    document.getElementsByClassName('scheduleCreator')[0].innerHTML = ''

    /** 태그입력란 */
    document.getElementById('scheduleTag').style.display = 'flex';

    /** 주소 사용 여부 */
    document.getElementsByClassName('addressDiv')[0].innerHTML
        = '<label>주소</label>'
        + '<input onclick="addrToggle()" type="checkbox" id="addrCheckbox" class="addrCheckbox">'
        + '<div>주소 사용 여부</div>';

    /** 버튼 div */
    document.getElementsByClassName('scheduleBtnDiv')[1].innerHTML
        = '<button class="btn-empty" onclick="closeModal(this, \'edit\')">닫기</button>'
        + '<button class="saveBtn" onclick="saveSchedule()">완료</button>'

    /** 지도 모달 */
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

/**
 * 담당자 : 배도훈
 * 함수 설명 : 일정 편집 모달 표시 함수
 * 주요 기능 : 일정 편집 모달을 표시
 */
function openEditModal(scheduleId) {
    /** 함수 실행 시 일정 생성 형태로 모달 표시 */
    openCreateModal()

    /** 모달 탑 */
    document.getElementsByClassName('modal_schedule_body_top')[1].innerHTML = '일정 편집';

    /** 버튼 div */
    document.getElementsByClassName('scheduleBtnDiv')[1].innerHTML
        = '<button class="btn-empty" onclick="openDetailModal(\'' + scheduleId + '\')">취소</button>'
        + '<button class="saveBtn" onclick="editSchedule(\'' + scheduleId + '\')">완료</button>'

    /** 일정을 검색하는 API 호출 */
    $.ajax({
        type: 'POST',
        url: 'schedule/find/' + scheduleId,
        dataType: "json",
        success: function (res) {
            const startDate = new Date(res.schedule.startDate)
            const endDate = new Date(res.schedule.endDate)

            /** 시작일, 종료일 */
            document.getElementById('startDate').value = setTime(startDate)/*res.schedule.startDate.substring(0, 16)*/;
            document.getElementById('endDate').type = 'datetime-local';
            document.getElementById('endDate').value =setTime(endDate)/*.substring(0, 16)*/;

            /** 제목, 상태, 내용, 우선순위, 주소 */
            document.getElementById('scheduleName').value = res.schedule.title;
            let statusOptions = document.getElementById('scheduleStatus').children;
            res.schedule.status ? statusOptions[1].selected = true : statusOptions[0].selected = true;
            document.getElementById('scheduleContent').value = res.schedule.content;
            document.getElementById('schedulePriority').value = res.schedule.priority;
            document.getElementById('addrInput').value = res.schedule.address;
            document.getElementById('value1').innerHTML = document.getElementById('schedulePriority').value;

            /**
             * 담당자 : 정희성
             * 함수 설명 : 일정 내 저장된 태그들을 불러오는 함수
             * 주요 기능 : 일정 내 태그들 바인딩 기능
             *            태그위에 커서 올려둘 시 데이터 삭제 버튼 생성
             *            주소 사용 여부 확인 체크 및 사용 시 지도 모달 띄어주는 기능
             */
            const tagListDiv = document.querySelector('.tagListDiv');
            tagListDiv.innerHTML = '';
            res.schedule.tagInfo.map((result) => {
                tagListDiv.innerHTML += '<div class ="autoTagDiv ' + 'tag' + result.content + '"  onclick="deleteTag(this)">' +
                    '<span class="tagValue" id="tagValue" value="' + result.content + '">' + result.content + '</span>' +
                    '<i class="fa-regular fa-circle-xmark deleteTagValue"></i>' +
                    '</div>'
            })
            /** 주소 사용 여부 및 주소 데이터 유무 확인 */
            if (document.getElementsByClassName('addrInput')[0].value) {
                document.getElementsByClassName('addrCheckbox')[0].disabled = false;
                document.getElementsByClassName('addrCheckbox')[0].checked = true;
                /** 주소 사용 여부 토글 */
                addrToggle()
            }
        },
        error: function (err) {
            window.alert("일정 정보를 불러오지 못하였습니다.")
            console.log(err)
        }
    })

    /** 태그 검색 함수 */
    tagSearch()

    mapModal.classList.remove('show');
    editModal.classList.add('show')
    if (editModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 화면의 날짜 데이터를 DB에 한국 시간으로 저장하기 위한 시차 계산 함수
 * 주요 기능 : 일정 저장 시 날짜 데이터의 시차를 계산
 */
function setTime(date) {
    let date1 = new Date(date + ':00');
    let newDate = new Date(date1.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);
    return newDate;
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 일정 편집 함수
 * 주요 기능 : 일정 편집 API를 호출
 */
function editSchedule(scheduleId) {
    /** 태그를 배열로 저장 */
    const tagValue = document.getElementsByClassName('tagValue');
    const arrayTag = [];

    for (let i = 0; i < tagValue.length; i++) {
        arrayTag.push(tagValue[i].getAttribute('value'))
    }
    /** DB에 저장하기 위한 일정 데이터 */
    const schedules = {
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        title: document.getElementById('scheduleName').value,
        status: document.getElementById('scheduleStatus').value,
        content: document.getElementById('scheduleContent').value,
        priority: document.getElementById('schedulePriority').value,
        address: document.getElementById('addrInput').value,
        tagInfo: arrayTag,
    }
    /** 유효성 검사 */
    if (schedules.startDate > schedules.endDate) {
        toast('시작일, 종료일을 다시 확인해주세요.')
        return
    } else if (!schedules.title) {
        toast('일정 제목을 입력해주세요.')
        return
    } else if (!schedules.content) {
        toast('일정 내용을 입력해주세요.')
        return
    } else if (!schedules.priority) {
        toast('우선순위를 입력해주세요.')
        return
    } else if (schedules.tagInfo.length == 0) {
        toast('태그를 입력해주세요.')
        return
    } else {
        /** 일정 편집 API 요청 */
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

/**
 * 담당자 : 배도훈
 * 함수 설명 : 일정 삭제 함수
 * 주요 기능 : 삭제 버튼 클릭 시 일정 삭제 API 호출
 */
function deleteSchedule(scheduleId) {
    if (confirm('일정을 삭제하시겠습니까?')) {
        /** 일정 삭제 API 요청 */
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

/**
 * 담당자 : 배도훈
 * 함수 설명 : 주소 사용 여부 토글 함수
 * 주요 기능 : 주소 사용 여부 체크박스가 체크되면 카카오맵 모달 표시
 */
function addrToggle() {
    /** 주소 사용 여부 체크박스 체크 */
    let addrChecked = document.getElementById('addrCheckbox').checked;
    /** 체크박스 체크되었을 시 */
    if (addrChecked) {
        mapModal.style.height = editModal.firstElementChild.offsetHeight + 'px';
        mapModal.classList.add('show');
        searchAddr();
    /** 체크박스 체크되지 않았을 시 */
    } else {
        mapModal.classList.remove('show');
        document.getElementById('addrInput').value = '';
    }
    /** 카카오맵 모달이 표시되면 카카오맵의 사이즈 재조정 */
    if (mapModal.classList.contains('show')) {
        map.relayout();
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 일정 저장 함수
 * 주요 기능 : 저장 버튼 클릭 시 일정 저장 API 호출
 */
function saveSchedule() {
    /** 태그 목록을 배열로 저장 */
    const tagValue = document.getElementsByClassName('tagValue')
    const arrayTag = [];

    for (let i = 0; i < tagValue.length; i++) {
        arrayTag.push(tagValue[i].getAttribute('value'))
    }
    /** DB에 저장할 일정 데이터 */
    const schedules = {
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        title: document.getElementById('scheduleName').value,
        status: document.getElementById('scheduleStatus').value,
        content: document.getElementById('scheduleContent').value,
        priority: document.getElementById('schedulePriority').value,
        address: document.getElementById('addrInput').value,
        tagInfo: arrayTag,
    }
    /** 유효성 검사 */
    if (schedules.startDate > schedules.endDate) {
        toast('시작일, 종료일을 다시 확인해주세요.')
        return
    } else if (!schedules.title) {
        toast('일정 제목을 입력해주세요.')
        return
    } else if (!schedules.content) {
        toast('일정 내용을 입력해주세요.')
        return
    } else if (!schedules.priority) {
        toast('우선순위를 입력해주세요.')
        return
    } else if (schedules.tagInfo.length === 0) {
        toast('태그를 입력해주세요.')
        return
    } else {
        /** 일정 생성 API 호출 */
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
                    window.alert("일정등록을 실패하였습니다.")
                    console.log(err)
                }
            }
        })
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 태그 자동완성 목록을 닫는 함수
 * 주요 기능 : 태그 입력란에서 focus 해제 시 태그 목록 닫음
 */
function ScheduleTagOnblur() {
    window.onmouseup = function (e) {
        let targetClass = e.target.classList[0]
        if (targetClass != 'autoTag' && targetClass != 'scheduleTag' && targetClass != 'autoTagList') {
            const tagList = document.querySelector('.tagList')
            tagList.innerHTML = '';
        }
    }
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 태그 검색 함수
 * 주요 기능 : localstorage에 저장된 태그를 불러오는 기능
 *           태그 검색한 단어가 포함된 태그를 불러오는 기능
 *           검색이 없을 경우 전체 태그를 불러오는 기능
 *           태그가 포거스 되어 있지 않는 경우 전체 태그리스트 창 종료 기능
 *           태그 클릭 시 스케줄 태그 목록으로 이동하는 기능
 *           엔터 시 해당 태그가 스케줄 태그 목록으로 이동하는 기능
 */
function searchTag(event) {
    const tags = JSON.parse(localStorage.getItem('content'))
    const str = document.getElementById('scheduleTag').value;
    const tagList = document.querySelector('.tagList')
    const tagListDiv = document.querySelector('.tagListDiv')

    /*태그 입력란에 입력 시 그 단어가 포함된 태그 표시*/
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
        /*아무것도 없을 시 태그 리스트 종료*/
        if (bool == false) {
            tagList.innerHTML = '';
        }
        /*입력 중이지 않을 경우 전체 태그 표시*/
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
    let tagCheck = false;
    /* 클릭으로 태그 선택 */
    for (let i = 0; i < autoTag.length; i++) {
        autoTag[i].addEventListener('click', function () {
            //태그 중복 검사
            for (let j = 0; j < tagListDiv.children.length; j++) {
                if (tagListDiv.children[j].children[0].getAttribute('value') === autoTag[i].getAttribute('value')) {
                    toast("중복된 태그가 존재합니다.")
                    tagCheck = true;
                }
            }
            if (tagCheck === false) {
                let selectedTag = autoTag[i].getAttribute('value');
                tagListDiv.innerHTML += '<div class = "autoTagDiv ' + 'tag' + selectedTag + '" onclick="deleteTag(this)">' +
                    '<span class="tagValue" id="tagValue" value="' + selectedTag + '">' + selectedTag + '</span>' +
                    '<i class="fa-regular fa-circle-xmark deleteTagValue"></i>' +
                    '</div>';
            }
            tagList.innerHTML = ''
            document.getElementById('scheduleTag').value = null
            /*tagMotion();*/
        })
    }
    /* 엔터로 태그 선택 또는 등록 */
    if (event.keyCode == 13) {
        //태그 중복 검사
        for (let j = 0; j < tagListDiv.children.length; j++) {
            if (tagListDiv.children[j].children[0].getAttribute('value') === str) {
                toast("중복된 태그가 존재합니다.")
                tagCheck = true;
            }
        }
        if (tagCheck === false) {
            tagListDiv.innerHTML += '<div class = "autoTagDiv ' + 'tag' + str + '" onclick="deleteTag(this)">' +
                '<span class="tagValue" id="tagValue" value="' + str + '">' + str + '</span>' +
                '<i class="fa-regular fa-circle-xmark deleteTagValue"></i>' +
                '</div>';
        }
        tagList.innerHTML = ''
        document.getElementById('scheduleTag').value = null
        /*tagMotion();*/
    }
}
/**
 * 담당자 : 정희성
 * 함수 설명 : 작성 태그 삭제 함수
 * 주요 기능 : 화면에서 입력한 함수 삭제
 */
function deleteTag(selectedTag) {
    selectedTag.remove();
}
/**
* 담당자 : 정희성
* 함수 내용 : 토스트 팝업창 함수
* 주요 기능 : 토스트 팝업창을 띄우는 기능
 *           일정 시간이 지나면 사라지는 기능
**/
let removeToast;

function toast(string) {
    const toast = document.getElementById("toast");

    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1500)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1500)
    toast.classList.add("reveal"),
        toast.innerText = string
}
/**
* 담당자 : 정희성
* 함수 내용 : 글자 길이 체크 후 팝업창 띄우는 함수
* 주요 기능 : 글자 길이 체크 기능
 *          초과 시 팝업창 ㅍ시 기능
**/
function checkTextLength(element, cnt) {
    let inputValue = element.value;
    if (inputValue.length >= cnt) {
        toast(cnt + "자 이하만 작성이 가능합니다.")
    }

}