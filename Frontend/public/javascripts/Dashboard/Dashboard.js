document.addEventListener('DOMContentLoaded', function () {
    findLog()
    categoryList()
    findScheduleList();
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

    const today = new Date()
    $.ajax({
        type: 'POST',
        url: 'schedule/findDate',
        data: {
            year: today.getFullYear(),
            month: today.getMonth(),
            day: today.getDay()
        },
        dataType: "json",
        success: function (res) {
            document.querySelector('.visibleCol > .content__top > .content__title').innerHTML =
                '<i class="fa-solid fa-clipboard-list" style="color: #CE9462"></i>\n' +
                '오늘 나의 일정'

            let complete = '';
            let incomplete = '';

            for (let i = 0; i < res.schedule.length; i++) {
                let cbClasses;
                res.schedule[i].status == true ? cbClasses = 'cb checked' : cbClasses = 'cb';
                let str = '';
                str += '<div class="scheduleRow" draggable="true" id="scheduleRow' + i + '">';
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


function draggable() {
    const lists = document.querySelectorAll('.scheduleList');
    let startArea;
    let endArea;

    lists.forEach((list) => {
        list.addEventListener('dragstart', (e) => {
            startArea = e.target.parentNode;
        })
        list.addEventListener('dragend', (e) => {
            endArea = e.target.parentNode;
            if (startArea != endArea) {
                eventCb = document.querySelector('#' + e.target.id + ' .cb');
                toggleCb(eventCb, eventCb.getAttribute('value').replaceAll('\'', ''), 'drag')
            }
        })
        new Sortable(list, {
            group: "shared",
            animation: 150,
            ghostClass: "blue-background-class"
        });
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
        success: function (res) {
            console.log(res.schedule.status)
        },
        error: function (err) {
            window.alert("일정 상태 변경 실패")
            console.log(err)
        }
    })
}

function setDate(date) {
    let dateSplitArr = date.split('T');
    let toDate = dateSplitArr[0];
    let toTime = dateSplitArr[1];
    let newDate = toDate + ' ' + toTime.split(':')[0] + ':' + toTime.split(':')[1];

    return newDate;
}

function findLog() {
    const logList = document.querySelector('.logList')
    $.ajax({
        type: 'POST',
        url: 'log/findLog',
        dataType: "json",
        success: function (res) {
            let str = ''
            res.logs.map((log) => {
                str += '<div class = "logRow">' +
                    '<img class = "userImage" src="' + log.creator.image + '">'
                if (log.name.beforeName === log.name.afterName) {
                    str += '<span class = "logMessage">' + log.creator.name + "님이 " + log.name.beforeName + " " + log.content + "하였습니다." + '</span>';

                } else {
                    str += '<span class="logMessage">' + log.creator.name + "님이 " + log.name.beforeName + "에서 " + log.name.afterName + "로 " + log.content + "하였습니다." + '</span>'
                }
                str += '</div>';
            })

            logList.innerHTML = str;
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
    const today = new Date()

    $.ajax({
        type: 'POST',
        url: 'category/findDate',
        data: {
            id: id, creator: creator,
            year: today.getFullYear(),
            month: today.getMonth(),
            day: today.getDay()
        },
        dataType: "json",
        async: false,
        success: function (res) {
            document.querySelector('.visibleCol > .content__top > .content__title').innerHTML =
                '<i class="fa-solid fa-clipboard-list" style="color: #CE9462"></i>\n' +
                '오늘 공유 일정'

            res.schedules.map((schedule, index) => {
                let cbClasses;
                schedule.status == true ? cbClasses = 'cb checked' : cbClasses = 'cb';
                let str = '';
                str += '<div class="scheduleRow" draggable="true" id="scheduleRow' + index + '">';
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
            draggable();
        },
        error: function (err) {
            window.alert("일정 불러오기 실패")
            console.log(err)
        }
    })
}

