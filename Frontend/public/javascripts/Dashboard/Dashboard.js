/**
 * 담당자 : 정희성
 * 함수 설명 :
 * 주요 기능 :
 */

let scheduleCheck = false;
document.addEventListener('DOMContentLoaded', function () {
    findLog(1)
    categoryList()
    findScheduleList(scheduleCheck);
    findMemoList();
})

/**
 * 담당자 : 배도훈
 * 함수 설명 : 메모 목록을 조회하는 함수
 * 주요 기능 : 메모 목록을 조회
 */
function findMemoList() {
    /** 메모 영역을 목록 형태로 변환 */
    showMemoList()
    /** 메모 목록 조회 API 호출 */
    $.ajax({
        type: 'POST',
        url: 'memo/findMemoList/',
        dataType: "json",
        success: function (memos) {
            let memoList = document.querySelector('.memoList');
            memoList.innerHTML = '';
            /** 메모 개수만큼 요소를 생성하여 목록에 추가 */
            for (let i = 0; i < memos.memo.length; i++) {
                let memoRow = document.createElement('div');
                memoRow.classList.add('memoRow');
                memoRow.setAttribute('value', memos.memo[i]._id)
                memoRow.setAttribute('onclick', 'memoDetail(this)')
                memoRow.innerText = memos.memo[i].content;
                memoList.appendChild(memoRow)
            }
            /** 메모가 없으면 메시지 표시 */
            if(memos.memo.length == 0){
                let emptyMessageDiv = document.createElement('div');
                emptyMessageDiv.classList.add('emptyMessageDiv')
                emptyMessageDiv.innerText = '등록된 메모가 없습니다.'
                memoList.appendChild(emptyMessageDiv)
            }
        },
        error: function (err) {
            window.alert("등록된 메모가 없습니다")
            console.log(err)
        }
    })
}
/**
 * 담당자 : 배도훈
 * 함수 설명 : 메모 상세 조회 함수
 * 주요 기능 : 메모 클릭 시 해당 메모의 내용을 조회
 */
function memoDetail(el){
    /** 요소의 value 속성에 저장된 id를 파라미터로 받아 상세 조회 API 호출 */
    let memoId = el.getAttribute('value')
    $.ajax({
        type: 'POST',
        url: 'memo/findMemoDetail/' + memoId,
        dataType: "json",
        success: function (result) {
            showMemoText(memoId, result.memo.content)
        },
        error: function (err) {
            window.alert("메모를 찾지 못하였습니다.")
            console.log(err)
        }
    })
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 메모 영역을 목록 형태로 전환하는 함수
 * 주요 기능 : 메모 영역의 요소들을 목록 형태로 전환
 */
function showMemoList(){
    let notepad = document.querySelector('.notepad');
    let icons = document.querySelectorAll('.content--memo i.fa-chevron-left, .content--memo i.fa-check, .content--memo i.fa-trash')
    document.querySelector('.memoList').style.display = 'block';
    document.querySelector('.memoTextDiv').style.display = 'none';
    document.querySelector('.memoText').value = '';
    notepad.style.backgroundColor = 'inherit';
    notepad.style.boxShadow = 'none';
    icons.forEach(function (i) {
        i.style.display = 'none';
    })
    icons[2].setAttribute('onclick', 'saveMemo()')
    document.querySelector('.content--memo .fa-plus').style.display = 'inline-block';
}
/**
 * 담당자 : 배도훈
 * 함수 설명 : 메모 영역을 글쓰기 형태로 전환하는 함수
 * 주요 기능 : 메모 영역의 요소들을 글쓰기 형태로 전환
 */
function showMemoText(id, content){
    document.querySelector('.memoList').style.display = 'none';
    document.querySelector('.memoTextDiv').style.display = 'block';
    document.querySelector('.notepad').style.backgroundColor = '#FFF7D1';

    let selector;
    id ? selector = '.content--memo i.fa-chevron-left, .content--memo i.fa-check, .content--memo i.fa-trash' : selector = '.content--memo i.fa-chevron-left, .content--memo i.fa-check'

    let icons = document.querySelectorAll(selector)
    icons.forEach(function (i) {
        i.style.display = 'inline-block';
    })
    document.querySelector('.content--memo .fa-plus').style.display = 'none';

    if(id){
        icons[1].setAttribute('onclick', 'deleteMemo(\'' + id + '\')')
        icons[2].setAttribute('onclick', 'saveMemo(\'' + id + '\')')
        document.querySelector('.memoTextDiv textarea').value = content;
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 작성한 메모를 저장(생성, 수정)하는 함수
 * 주요 기능 : 메모의 아이디 존재 시 해당 아이디의 메모를 수정하고, 존재하지 않을 시 새로운 메모 생성하는 기능
 */
function saveMemo(id) {
    let content = document.querySelector('.memoText').value
    let url;
    /** 아이디 유무에 따라 상이한 url로 API 통신 */
    id ? url = 'memo/updateMemo/' + id : url = 'memo/saveMemo/';
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            content: content,
        },
        dataType: "json",
        success: function (result) {
            findMemoList()
        },
        error: function (err) {
            console.log(err)
            alert(err)
        }
    })
}
/**
 * 담당자 : 배도훈
 * 함수 설명 : 선택한 메모를 삭제하는 함수
 * 주요 기능 : 삭제 버튼 클릭 시 선택한 메모를 삭제
 */
function deleteMemo(id){
    $.ajax({
        type: 'POST',
        url: 'memo/deleteMemo/' + id,
        dataType: "json",
        success: function (result) {
            findMemoList()
        },
        error: function (err) {
            console.log(err)
            alert(err)
        }
    })
}

/**
 * 담당자 : 정희성
 * 함수 설명 :
 * 주요 기능 :
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

            scheduleChartLib(res.schedule);


            if (res.schedule.length === 0) {
                scheduleChart.style.display = 'none'
                emptyMessageDiv.style.display = 'flex'
            }

            for (let i = 0; i < res.schedule.length; i++) {
                let cbClasses;
                res.schedule[i].status == true ? cbClasses = 'cb checked' : cbClasses = 'cb';
                let str = '';
                str += '<div class="scheduleRow" draggable="true" id="scheduleRow' + i + '" onclick="detailSchedule(\'' + res.schedule[i]._id + '\',event)">';
                str += '<div class="scheduleTitle">';
                str += '<div class="' + cbClasses + '" id="cb' + i + '" value="\'' + res.schedule[i]._id + '\'" onclick="toggleCb(this, \'' + res.schedule[i]._id + '\', \'check\')"><i class="fa-solid fa-check fa-2xs"></i></div>' + '<span>' + res.schedule[i].title + '</span>';
                str += '</div>';
                str += '<div>';
                str += '<i class="fa-regular fa-calendar"></i> ' + setDate(res.schedule[i].startDate) + ' ~ ' + setDate(res.schedule[i].endDate);
                str += '</div>';
                str += '</div>';

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

let sortable;

/**
 * 담당자 : 정희성, 배도훈
 * 함수 설명 : 드래그 관련 기능을 추가하는 함수
 * 주요 기능 : sortable 라이브러리 적용 및 커스텀
 */
function draggable() {
    const lists = document.querySelectorAll('.scheduleList');
    let startArea;
    let endArea;

    lists.forEach((list) => {
        if (scheduleCheck === false) {
            sortable = new Sortable(list, {
                group: "shared",
                animation: 150,
                ghostClass: "blue-background-class",
                onStart: (evt) => {
                    startArea = evt.to
                },
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
 * 함수 설명 :
 * 주요 기능 :
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
 * 담당자 : 정희성
 * 함수 설명 :
 * 주요 기능 :
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
 * 함수 설명 :
 * 주요 기능 :
 */
function findLog(page) {
    const logList = document.querySelector('.logList')
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
            page++;
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

                if (logTime === 0) {
                    let min = date.getMinutes() - new Date(log.createDate).getMinutes();
                }

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

            if (res.logs.length == 20) {
                str += '<div class="viewMore" onclick="findLog(\'' + page + '\')">더 보기</div>'
            }
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
 * 함수 설명 :
 * 주요 기능 :
 */
function categoryList() {
    const categoryList = document.querySelector('.categoryList')
    const today = new Date();

    $.ajax({
        type: 'POST',
        url: 'category/find/todayCategoryList',
        data: {
            year: today.getFullYear(),
            month: today.getMonth(),
            day: today.getDay()
        },
        dataType: "json",
        success: function (res) {
            let str = ''
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
 * 함수 설명 :
 * 주요 기능 :
 */
function categoryInSchedule(id, creator) {
    let complete = '';
    let incomplete = '';
    RemoveDraggable()

    const scheduleChart = document.querySelector('.scheduleChart')
    const emptyMessageDiv = document.querySelector('.emptyMessageDiv')

    scheduleChart.style.display = 'flex'
    emptyMessageDiv.style.display = 'none'

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

            document.querySelector('.visibleCol > .content__top > .content__title').innerHTML =
                '<i class="fa-solid fa-clipboard-list" style="color: #CE9462"></i>\n' +
                '오늘 공유 일정'


            res.schedules.map((schedule,index) => {
                let cbClasses;
                schedule.status == true ? cbClasses = 'cb checked' : cbClasses = 'cb';
                let str = '';
                str += '<div class="scheduleRow" onclick="detailSchedule(\'' + schedule._id + '\',event)" id="scheduleRow' + index + '">';
                str += '<div class="scheduleTitle">';
                str += '<div class="' + cbClasses + '" id="cb' + index + '" value="\'' + schedule._id + '\'"><i class="fa-solid fa-check fa-2xs"></i></div>' + '<span>' + schedule.title + '</span>';
                str += '</div>';
                str += '<div>';
                str += '<i class="fa-regular fa-calendar"></i> ' + setDate(schedule.startDate) + ' ~ ' + setDate(schedule.endDate);
                str += '</div>';
                str += '</div>';

                if (schedule.status == true) {
                    complete += str;
                } else {
                    incomplete += str;
                }
            })

            let title;
            if (res.category.title.length > 10) {
                title = res.category.title.substring(0, 10);
                title += '...';
            } else {
                title = res.category.title
            }

            const selectCategory = document.querySelector('.selectCategory');
            selectCategory.innerHTML =
                '<div>선택 카테고리</div>' +
                '<span>' + title + '</span>'

            document.querySelector('.scheduleList.incomplete').innerHTML = incomplete;
            document.querySelector('.scheduleList.complete').innerHTML = complete;
            /*document.querySelector('.scheduleList.incomplete').setAttribute("class", "CategoryScheduleList incomplete")
            document.querySelector('.scheduleList.complete').setAttribute("class", "CategoryScheduleList complete")*/
            },
        error: function (err) {
            window.alert("일정 불러오기 실패")
            console.log(err)
        }
    })
}

/**
 * 담당자 : 정희성
 * 함수 설명 :
 * 주요 기능 :
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


    $.ajax({
        type: 'POST',
        url: 'schedule/find/' + scheduleId,
        dataType: "json",
        success: function (res) {
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
 * 함수 설명 :
 * 주요 기능 :
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
 * 함수 설명 :
 * 주요 기능 :
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

