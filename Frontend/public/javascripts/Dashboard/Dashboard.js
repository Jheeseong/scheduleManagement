let scheduleCheck = false;
document.addEventListener('DOMContentLoaded', function () {
    findLog(1)
    categoryList()
    findScheduleList(scheduleCheck);
    findMemoList();
})

function findMemoList() {
    showMemoList()

    $.ajax({
        type: 'POST',
        url: 'memo/findMemoList/',
        dataType: "json",
        success: function (memos) {
            let memoList = document.querySelector('.memoList');
            memoList.innerHTML = '';
            for (let i = 0; i < memos.memo.length; i++) {
                let memoRow = document.createElement('div');
                memoRow.classList.add('memoRow');
                memoRow.setAttribute('value', memos.memo[i]._id)
                memoRow.setAttribute('onclick', 'memoDetail(this)')
                memoRow.innerText = memos.memo[i].content;
                memoList.appendChild(memoRow)
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}
function memoDetail(el){
    let memoId = el.getAttribute('value')
    $.ajax({
        type: 'POST',
        url: 'memo/findMemoDetail/' + memoId,
        dataType: "json",
        success: function (result) {
            showMemoText(memoId, result.memo.content)
        },
        error: function (err) {
            console.log(err)
        }
    })
}
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

function saveMemo(id) {
    let content = document.querySelector('.memoText').value
    let url;
    id ? url = 'memo/updateMemo/' + id : url = 'memo/saveMemo/';
    console.log('id: ' + id)
    console.log('url: ' + url)
    console.log(content)
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            content: content,
        },
        dataType: "json",
        success: function (result) {
            console.log(result)
            findMemoList()
        },
        error: function (err) {
            console.log(err)
            alert(err)
        }
    })
}

function deleteMemo(id){
    $.ajax({
        type: 'POST',
        url: 'memo/deleteMemo/' + id,
        dataType: "json",
        success: function (result) {
            console.log(result)
            findMemoList()
        },
        error: function (err) {
            console.log(err)
            alert(err)
        }
    })
}



function findScheduleList() {
    let scheduleList = document.querySelector('.scheduleList')
    let user = document.getElementById('userElement').value

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
            scheduleChartLib(res.schedule)
            for (let i = 0; i < res.schedule.length; i++) {
                let cbClasses;
                res.schedule[i].status == true ? cbClasses = 'cb checked' : cbClasses = 'cb';
                let str = '';
                str += '<div class="scheduleRow" draggable="true" id="scheduleRow' + i + '" onclick="detailSchedule(\'' + res.schedule[i]._id + '\',event)">';
                str += '<div class="scheduleTitle">';
                str += '<div class="' + cbClasses + '" id="cb' + i + '" value="\'' + res.schedule[i]._id + '\'" onclick="toggleCb(this, \'' + res.schedule[i]._id + '\', \'check\')"><i class="fa-solid fa-check fa-2xs"></i></div>' + res.schedule[i].title;
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
            console.log(err)
        }

    })
}

let sortable;

function draggable() {
    const lists = document.querySelectorAll('.scheduleList');
    let startArea;
    let endArea;

    /*const dragStartEvent =  (e) => {
        startArea = e.target.parentNode;
    }

    const dragEndEvent =  (e) => {
        endArea = e.target.parentNode;
        if(startArea != endArea){
            eventCb = document.querySelector('#' + e.target.id + ' .cb');
            toggleCb(eventCb, eventCb.getAttribute('value').replaceAll('\'', ''), 'drag')
        }
    }*/
    lists.forEach((list) => {
        console.log(list)
        /*list.addEventListener('dragstart', dragStartEvent)
        list.addEventListener('dragend', dragEndEvent)*/
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
            /*list.addEventListener('dragstart', dragStartEvent)
            list.addEventListener('dragend', dragEndEvent)*/
            sortable.options.group.name = 'shared'
        }
    });
}

function RemoveDraggable(){
    const lists = document.querySelectorAll('.scheduleList');

    lists.forEach((list) => {
        console.log(list)
        sortable.options.group.name = ''
        scheduleCheck = true;
    });
}

function toggleCb(cb, id, method) {
    console.log('cb : ' + cb + '\nid : ' + id)
    let selectedRow = cb.parentElement.parentElement;
    let completed = document.querySelector('.complete.scheduleList');
    let incompleted = document.querySelector('.incomplete.scheduleList');
    let status;
    cb.classList.toggle('checked');

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

    $.ajax({
        type: 'POST',
        url: 'schedule/updateStatus/' + id,
        data: {status: status},
        dataType: "json",
        async: false,
        success: function (res) {
            console.log(res.schedule.status)
        },
        error: function (err) {
            window.alert("일정 상태 변경 실패")
            console.log(err)
        }
    })

    scheduleStatusChart()
}

function setDate(date) {
    let dateSplitArr = date.split('T');
    let toDate = dateSplitArr[0];
    let toTime = dateSplitArr[1];
    let newDate = toDate + ' ' + toTime.split(':')[0] + ':' + toTime.split(':')[1];

    return newDate;
}

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
                    '<div>' +
                    '<img class = "userImage" src="' + log.creator.image + '">' +
                    '<div><div class="logMessage">';
                if (log.name.beforeName === log.name.afterName) {
                    str += '<span><strong>' + log.creator.name + "</strong>님이 <strong>" + log.name.beforeName + "</strong> " + log.content + "하였습니다." + '</span>';

                } else {
                    str += '<span><strong>' + log.creator.name + "</strong>님이 <strong>" + log.name.beforeName + "</strong>에서 <strong>" + log.name.afterName + "</strong>로 " + log.content + "하였습니다." + '</span>'
                }
                str += '</div>' +
                    '<div class="logBottom">' +
                    '<span>' + logTime + '</span>' +
                    '</div></div></div>' +
                    '<div class="logType">' +
                    '<span>' + log.type + '</span>' +
                    '</div>' +
                    '</div>'
            });

            if (res.logs.length == 20) {
                str += '<div class="viewMore" onclick="findLog(\'' + page + '\')">더 보기</div>'
            }

            logList.innerHTML += str;
        },
        error: function (err) {
            window.alert("로그 불러오기 실패")
            console.log(err)
        }

    })
}

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

            categoryList.innerHTML = str;
        },
        error: function (err) {
            window.alert("카테고리 불러오기 실패")
            console.log(err)
        }

    })
}

function categoryInSchedule(id, creator) {
    let complete = '';
    let incomplete = '';
    RemoveDraggable()

    $.ajax({
        type: 'POST',
        url: 'category/findDate',
        data: {id: id, creator: creator,},
        dataType: "json",
        async: false,
        success: function (res) {
            scheduleChartLib(res.schedules)
            document.querySelector('.visibleCol > .content__top > .content__title').innerHTML =
                '<i class="fa-solid fa-clipboard-list" style="color: #CE9462"></i>\n' +
                '오늘 공유 일정'


            res.schedules.map((schedule,index) => {
                let cbClasses;
                schedule.status == true ? cbClasses = 'cb checked' : cbClasses = 'cb';
                let str = '';
                str += '<div class="scheduleRow" onclick="detailSchedule(\'' + schedule._id + '\',event)" id="scheduleRow' + index + '">';
                str += '<div class="scheduleTitle">';
                str += '<div class="' + cbClasses + '" id="cb' + index + '" value="\'' + schedule._id + '\'"><i class="fa-solid fa-check fa-2xs"></i></div>' + schedule.title;
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

            const selectCategory = document.querySelector('.selectCategory')
            selectCategory.innerHTML =
                '<div>선택 카테고리</div>' +
                '<span>' + res.category.title + '</span>'

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
            console.log('creator : ' + res.schedule.userInfo)
            console.log('user : ' + document.getElementById('userElement').value)

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
}

/* 모달창 닫는 함수 */
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

