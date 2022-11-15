/**
 * 담당자 : 배도훈
 * 함수 설명 : 일정 토글 함수
 * 주요 기능 : 일정 체크박스 토글
 */
function scheduleToggle(e){
    e.firstElementChild.classList.toggle('closed')
    e.parentElement.nextElementSibling.classList.toggle('closed')
}

/**
 * 담당자 : 정희성, 배도훈
 * 함수 설명 : 오늘 나의 일정 리스트를 불러오는 함수
 * 주요 기능 : 나의 일정 중 오늘이 포함된 일정을 불러오는 기능 - 배도훈
 *            일정들 완료 미완료 기준으로 구분 기능 - 배도훈
 *            체크 버튼 클릭 시 완료 미완료 처리 기능 - 배도훈
 *            드래그 앤 드롭으로 완료 미완료 처리 기능 - 정희성, 배도훈
 *            일정 클릭 시 일정 세부 정보 확인 기능 - 정희성
 *            오늘 일정의 완료율 차르 확인 기능 - 정희성
 */
function findScheduleList() {
    const scheduleChart = document.querySelector('.scheduleChart')
    const emptyMessageDiv = document.querySelector('.emptyMessageDiv')
    let scheduleList = document.querySelector('.scheduleList')
    let user = document.getElementById('userElement').value

    scheduleChart.style.display = 'flex'
    emptyMessageDiv.style.display = 'none'
    $.ajax({
        type: 'POST',
        url: 'schedule/findDate',
        dataType: "json",
        success: function (res) {
            document.querySelector('.visibleCol > .content__top > .content__title').innerHTML =
                '<i class="fa-solid fa-clipboard-list" style="color: #CE9462"></i>\n' +
                '오늘 나의 일정'

            let complete = '';
            let incomplete = '';

            /*완료율 차트 함수*/
            scheduleChartLib(res.schedule);


            /*일정 데이터 없을 시 메시지 표시*/
            if (res.schedule.length === 0) {
                scheduleChart.style.display = 'none'
                emptyMessageDiv.style.display = 'flex'
            }

            /*일정 바인딩*/
            for (let i = 0; i < res.schedule.length; i++) {
                let cbClasses;
                res.schedule[i].status == true ? cbClasses = 'cb checked' : cbClasses = 'cb';
                let str = '';
                str += '<div class="scheduleRow" draggable="true" id="scheduleRow' + i + '" onclick="detailSchedule(\'' + res.schedule[i]._id + '\',event)">';
                str += '<div class="scheduleTitle">';
                str += '<div class="' + cbClasses + '" id="cb' + i + '" value="\'' + res.schedule[i]._id + '\'" onclick="toggleCb(this, \'' + res.schedule[i]._id + '\', \'check\')"><i class="fa-solid fa-check fa-2xs"></i></div>' + '<span>' + res.schedule[i].title + '</span>';
                str += '</div>';
                str += '<div class="scheduleContent">' + res.schedule[i].content + '</div>';
                str += '<div>';
                str += '<i class="fa-regular fa-calendar"></i> ' + getDate(res.schedule[i].startDate) + ' ~ ' + getDate(res.schedule[i].endDate);
                str += '</div>';
                str += '</div>';

                /*일정 상태 별로 구분*/
                if (res.schedule[i].status == true) {
                    complete += str;
                } else {
                    incomplete += str;
                }

                const selectCategory = document.querySelector('.selectCategory')
                selectCategory.innerHTML = ''
            }
            document.querySelector('.scheduleList.incomplete').innerHTML = incomplete;
            document.querySelector('.scheduleList.complete').innerHTML = complete;
            draggable();
        },
        error: function (err) {
            window.alert("일정을 불러오지 못하였습니다.")
            console.log(err)
        }

    })
}

/**
* 담당자 : 정희성
* 함수 내용 : 시간 변경 함수
* 주요 기능 : locatTime으로 변환 및 am/pm 형식 변환
**/
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

let sortable;

/**
 * 담당자 : 정희성, 배도훈
 * 함수 설명 : sortable 라이브러리를 이용한 드래그앤 드롭 함수
 * 주요 기능 : 일정 리스트 중 하나 드래그가 가능한 기능 - 정희성, 배도훈
 *            다른 클래스로 이동 시 일정 완료 미완료 변경 기능 - 배도훈
 */
function draggable() {
    const lists = document.querySelectorAll('.scheduleList');
    let startArea;
    let endArea;

    lists.forEach((list) => {
        /*처음으로 함수 실행 시*/
        if (scheduleCheck === false) {
            sortable = new Sortable(list, {
                group: "shared",
                animation: 150,
                ghostClass: "blue-background-class",
                /*일정 첫 드래그*/
                onStart: (evt) => {
                    startArea = evt.to
                },
                /*일정 드래그 마지막 지점*/
                onEnd: (evt) => {
                    endArea = evt.to
                    if(startArea != endArea){
                        eventCb = document.querySelector('#' + evt.item.id + ' .cb');
                        toggleCb(eventCb, eventCb.getAttribute('value').replaceAll('\'', ''), 'drag')
                    }
                }
            });
        } else {
            sortable.options.group.name = 'shared'
        }
    });
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 드래그앤 드롭 종료 함수
 * 주요 기능 : 드래그앤 드롭 기능 종료 기능
 *            공유 카테고리의 일정 표시 시 드래그앤 드롭 기능 종료 기능
 */
function RemoveDraggable(){
    const lists = document.querySelectorAll('.scheduleList');

    lists.forEach((list) => {
        sortable.options.group.name = ''
        scheduleCheck = true;
    });
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 일정 목록에서 체크박스 클릭 시 토글, status 변경 API를 호출하는 함수
 * 주요 기능 : 체크박스 클릭 시 체크박스의 색상과 일정의 위치가 변경되고 status 변경 API를 호출
 */
function toggleCb(cb, id, method) {
    /** 변수 저장 : 선택 일정, 완료 영역, 미완료 영역 */
    let selectedRow = cb.parentElement.parentElement;
    let completed = document.querySelector('.complete.scheduleList');
    let incompleted = document.querySelector('.incomplete.scheduleList');
    /** DB에 저장할 데이터 */
    let status;

    /** 클래스 토글 */
    cb.classList.toggle('checked');
    /** 클래스명 포함 여부에 따라 요소를 제거 및 새 위치에 추가, status 변수에 boolean값 저장 */
    if (cb.classList.contains('checked')) {
        if (method == 'check') {
            selectedRow.remove();
            completed.appendChild(selectedRow);
        }
        status = true;
    } else {
        if (method == 'check') {
            selectedRow.remove();
            incompleted.appendChild(selectedRow);
        }
        status = false;
    }
    /** 일정 상태 변경 API 호출 */
    $.ajax({
        type: 'POST',
        url: 'schedule/updateStatus/' + id,
        data: {status: status},
        dataType: "json",
        async: false,
        success: function (res) {
        },
        error: function (err) {
            window.alert("일정 상태 변경 실패")
            console.log(err)
        }
    })

    scheduleStatusChart()
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 일정 날짜 정리 함수
 * 주요 기능 : 일정 날짜를 분 단위까지 정리해서 리턴
 */
function setDate(date) {
    let dateSplitArr = date.split('T');
    let toDate = dateSplitArr[0];
    let toTime = dateSplitArr[1];
    let newDate = toDate + ' ' + toTime.split(':')[0] + ':' + toTime.split(':')[1];

    return newDate;
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 일정 및 카테고리의 활동 로그 기록 함수
 * 주요 기능 : 내가 만든 일정이나 공유 받은 카테고리의 활동 로그 기록을 가져오는 기능
 *            변경 후 흐른 시간 표시 기능
 *            활동 로그를 시간 순으로 표시 기능
 *            한번 당 20개씩 데이터 불러오는 기능
 *            더보기 클릭 시 그 다음 20개 데이터 불러오는 기능
 *            활동 로그 없을 시 메시지 표시 기능
 *
 */
function findLog(page) {
    const logList = document.querySelector('.logList')
    /*ajax를 통해 일정이나 카테고리 활동 로그를 첫번 쨰 페이지부터 호출*/
    $.ajax({
        type: 'POST',
        url: `log/findLog/${page}`,
        dataType: "json",
        success: function (res) {
            let str = ''
            let date = new Date();
            if (page > 1) {
                document.querySelector('.viewMore').remove()
            }
            /*페이지 수 더하기 1*/
            page++;
            /*활동로그 생성으로부터 시간 계싼*/
            res.logs.map((log) => {
                const interval = date.getTime() - new Date(log.createDate).getTime();
                const time = interval / (1000 * 60)
                let logTime;
                if (Math.floor(interval / 1000) < 60) {
                    logTime = "방금 전"
                }
                else if (Math.floor(time) < 60) {
                    logTime = Math.floor(time) + "분 전";
                } else if (Math.floor(time / 60) < 24) {
                    logTime = Math.floor(time / 60) + "시간 전";
                } else {
                    logTime = Math.floor(time / (60 * 24)) + "일 전";
                }

                /*활동로그 데이터 바인딩*/
                str += '<div class = "logRow">' +
                    '<div style="width: 100%">' +
                    '<img class = "userImage" src="' + log.creator.image + '">' +
                    '<div class="logBody"><div class="logMessage">';
                if (log.name.beforeName === log.name.afterName) {
                    str += '<span><strong>' + log.creator.name + "</strong>님이 <strong>" + log.name.beforeName + "</strong> " + log.content + "하였습니다." + '</span>';

                } else {
                    str += '<span><strong>' + log.creator.name + "</strong>님이 <strong>" + log.name.beforeName + "</strong>에서 <strong>" + log.name.afterName + "</strong>로 " + log.content + "하였습니다." + '</span>'
                }
                str += '</div>' +
                    '<div class="logBottom">' +
                    '<span>' + logTime + '</span>' +
                    '<div class="logType">' +
                    '<span>' + log.type + '</span>' +
                    '</div>' +
                    '</div></div></div>' +

                    '</div>'
            });

            /*더 보기 표시 기능*/
            if (res.logs.length == 20) {
                str += '<div class="viewMore" onclick="findLog(\'' + page + '\')">더 보기</div>'
            }
            /*데이터 없을 시 메시지 표시*/
            if(res.logs.length == 0){
                str = '<div class="emptyMessageDiv">활동 로그가 없습니다.</div>'
            }

            logList.innerHTML += str;
        },
        error: function (err) {
            window.alert("로그 불러오기 실패")
            console.log(err)
        }

    })
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 오늘 일정이 담긴 카테고리 표시 함수
 * 주요 기능 : 내가 공유받은 카테고리 중 오늘 일정이 포함되어 있는 카테고리 불러오는 기능
 *            각 카테고리에 있는 태그 표시 기능
 */
function categoryList() {
    const categoryList = document.querySelector('.categoryList')
    /*ajax를 통해 내가 공유받은 카테고리 중 오늘 일정이 포함된 카테고리 호출*/
    $.ajax({
        type: 'POST',
        url: 'category/find/todayCategoryList',
        dataType: "json",
        success: function (res) {
            let str = ''
            /*데이터 바인딩*/
            res.categories.map((category) => {
                str += '<div class="categoryRow" onclick="categoryInSchedule(\'' + category._id + '\', \'' + category.creator._id + '\')">' +
                    '<div class="categoryContent">' +
                    '<div class="categoryTitle"><span>' + category.title + '</span></div>' +
                    '<div class="categoryBottom">' +
                    '<div class="categoryTag">'
                category.tagInfo.map((tag) => {
                    str += '<span>' + tag.content + '</span>';
                })
                str += '</div>' +
                    '<div class="categoryCreator">' +
                    '<img class="userImage" src="' + category.creator.image + '">' +
                    '<p>' + category.creator.name + '</p>' +
                    '</div></div></div>' +
                    '</div>'
            })
            /*데이터 없을 시 메시지 표시*/
            if(res.categories.length == 0){
                str = '<div class="emptyMessageDiv">공유받은 카테고리가 없습니다.</div>'
            }
            categoryList.innerHTML = str;
        },
        error: function (err) {
            window.alert("카테고리 불러오기 실패")
            console.log(err)
        }

    })
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 공유 카테고리 클릭 시 오늘 일정 불러오는 함수
 * 주요 기능 : 공유 카테고리 클릭 시 기존 오늘 일정 리스트에서 공유받은 오늘 일정 리스트로 변경 기능
 *            일정 클릭 시 세부 정보 확인 기능
 *            일정 상태 수정이 불가능한 기능
 *            데이터 없을 시 메시지 표시 기능
 *            일정 제목이 길면 ...으로 표시 생략 기능
 *            선택한 카테고리 표시 기능
 *
 */
function categoryInSchedule(id, creator) {
    let complete = '';
    let incomplete = '';
    /*드래그 앤 드롭 종료*/
    RemoveDraggable()

    const scheduleChart = document.querySelector('.scheduleChart')
    const emptyMessageDiv = document.querySelector('.emptyMessageDiv')

    /*데이터 없을 시 메시지 표시*/
    scheduleChart.style.display = 'flex'
    emptyMessageDiv.style.display = 'none'

    /*공유 받은 오늘 일정 바인딩*/
    $.ajax({
        type: 'POST',
        url: 'category/findDate',
        data: {id: id, creator: creator,},
        dataType: "json",
        async: false,
        success: function (res) {
            scheduleChartLib(res.schedules)

            const scheduleChart = document.querySelector('.scheduleChart')
            if (res.schedules.length === 0) {
                scheduleChart.innerHTML = '<div class="emptyMessageDiv">오늘 일정이 없습니다.</div>'
            }

            /*오늘 공유 일정으로 이름 변경*/
            document.querySelector('.visibleCol > .content__top > .content__title').innerHTML =
                '<i class="fa-solid fa-clipboard-list" style="color: #CE9462"></i>\n' +
                '오늘 공유 일정'

            /*오늘 공유 일정 바인딩*/
            res.schedules.map((schedule,index) => {
                let cbClasses;
                schedule.status == true ? cbClasses = 'cb checked' : cbClasses = 'cb';
                let str = '';
                str += '<div class="scheduleRow" onclick="detailSchedule(\'' + schedule._id + '\',event)" id="scheduleRow' + index + '">';
                str += '<div class="scheduleTitle">';
                str += '<div class="' + cbClasses + '" id="cb' + index + '" value="\'' + schedule._id + '\'"><i class="fa-solid fa-check fa-2xs"></i></div>' + '<span>' + schedule.title + '</span>';
                str += '</div>';
                str += '<div>';
                str += '<i class="fa-regular fa-calendar"></i> ' + getDate(schedule.startDate) + ' ~ ' + getDate(schedule.endDate);
                str += '</div>';
                str += '</div>';

                /*일정 상태 별 분류*/
                if (schedule.status == true) {
                    complete += str;
                } else {
                    incomplete += str;
                }
            })
            /*일정 제목 생략*/
            let title;
            if (res.category.title.length > 10) {
                title = res.category.title.substring(0, 10);
                title += '...';
            } else {
                title = res.category.title
            }
            /*선택 카테고리 표시*/
            const selectCategory = document.querySelector('.selectCategory');
            selectCategory.innerHTML =
                '<div>선택 카테고리</div>' +
                '<span>' + title + '</span>'

            document.querySelector('.scheduleList.incomplete').innerHTML = incomplete;
            document.querySelector('.scheduleList.complete').innerHTML = complete;
        },
        error: function (err) {
            window.alert("일정 불러오기 실패")
            console.log(err)
        }
    })
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 일정 상세 모달 실행 함수
 * 주요 기능 : 일정의 상세 정보 표시 기능
 *            일정 수정 불가능 기능
 */
function detailSchedule(scheduleId, event) {
    let targetDiv = event.currentTarget.querySelectorAll('.cb > i, .cb')
    for (let i = 0; i < targetDiv.length; i++) {
        if (event.target == targetDiv[i]) {
            return;
        }
    }

    const body = document.querySelector('body');
    const editModal = document.querySelector('.modal_schedule--edit')

    editModal.classList.add('show')
    if (editModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
    /* 모달 탑 */
    document.getElementsByClassName('modal_schedule_body_top')[0].innerHTML = '일정 상세';

    /* 시작일, 종료일 */
    document.getElementsByClassName('dateDiv')[0].innerHTML
        = '<div id="startDate" clsss="startDate date"></div>'
        + '<div id="endDate" clsss="endDate date"></div>';

    /* 일정제목 */
    document.getElementsByClassName('scheduleNameDiv')[0].innerHTML
        = '<label>일정 제목</label>'
        + '<div id="scheduleName" class="scheduleName"></div>';

    /*일정 상태*/
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

    /* 버튼 div */
    let scheduleBtnDiv = document.getElementsByClassName('scheduleBtnDiv')[0]
    scheduleBtnDiv.innerHTML = '<button class="btn-empty" onclick="closeModal(this, \'edit\')">닫기</button>'

    /*일정 세부 정보 바인딩*/
    $.ajax({
        type: 'POST',
        url: 'schedule/find/' + scheduleId,
        dataType: "json",
        success: function (res) {

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

            /*일정상태*/
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

            /*포함되어 있는 태그 바인딩*/
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
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 일정 세부 정보 모달창 종료 함수
 * 주요 기능 : 일정 세부 모달창 종료 기능
 *            일정 세부 정보 비우는 기능
 */
function closeModal(event, modal) {
    const editModal = document.querySelector('.modal_schedule--edit')
    if (modal == 'edit') {
        editModal.classList.remove('show');
        /* 타이틀 초기화 */
        document.getElementsByClassName('modal_schedule_body_top')[0].innerText = '';
        /* 내용  초기화 */
        const inputTags = document.querySelectorAll('input:not(input[type="hidden"])')
        for (let i = 0; i < inputTags.length; i++) {
            inputTags[i].value = '';
        }
        document.getElementById('endDate').setAttribute('type', 'text');
        document.getElementsByClassName('tagListDiv')[0].innerHTML = '';
        document.getElementsByClassName('scheduleBtnDiv')[0].innerHTML = '';
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
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 일정 완료율 차트 함수
 * 주요 기능 : 가져온 일정리스트들의 완료율을 차트에 표시 기능
 */
function scheduleStatusChart() {
    $.ajax({
        type: 'POST',
        url: 'schedule/findDate',
        dataType: "json",
        success: function (res) {
            scheduleChartLib(res.schedule)
        },
        error: function (err) {
            window.alert("차트를 생성하지 못하였습니다.")
            console.log(err)
        }
    });
}