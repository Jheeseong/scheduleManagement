document.addEventListener('DOMContentLoaded', function () {
    findMySchedule()
    findMyTag()
})

/**
 * 담당자 : 정희성
 * 함수 내용 : 태그 및 일정 리스트 초기화 함수
 * 주요 기능 : 기존의 태그 및 일정 리스트로 초기화 기능
 **/
function allReload() {
    findMySchedule()
    findMyTag()
}

/**
 * 담당자 : 정희성
 * 함수 내용 : 내가 작성한 모든 스케줄 리스트 불러오는 함수
 * 주요 기능 : 내가 작성한 모든 스케줄 리스트 불러오는 함수
 **/
function findMySchedule() {
    $.ajax({
        type: 'POST',
        url: 'schedule/findByUser',
        dataType: "json",
        success: function (res) {
            /*일정 리스트에 바인딩*/
            updateScheduleList(res.schedule)
        },
        error: function (err) {
            window.alert("일정을 불러오던 중 오류가 발생하였습니다!")
            console.log(err)
        }
    })
}

/**
 * 담당자 : 정희성
 * 함수 내용 :선택한 태그 중 내가 작성한 스케줄리스트 불러오는 함수
 * 주요 기능 : 선택 태그 중 내가 작성한 스케줄들을 불러오는 기능
 *          선택된 태그를 일정 제목 옆에 표시해주는 기능
 **/
function findTagSchedule(tagId, event) {
    if(focusTr(event)){
        return;
    }
    $.ajax({
        type: "POST",
        url: 'schedule/findTag/' + tagId,
        dataType: "json",
        success: function (res) {
            /*일정 리스트에 바인딩*/
            updateScheduleList(res.selectTag.scheduleInfo)
            /*선택한 태그 표시*/
            const scheduleContentTop = document.querySelector('.scheduleContent__top > div > .selectTitle')
            scheduleContentTop.innerHTML =
                '<div>선택 태그 </div>' +
                '<span>' + res.selectTag.content + '</span>' +
                '<div class="tagScheduleReload">' +
                '<i class="fa-solid fa-rotate-right" style="color: #222222" onclick="findMySchedule()"></i>' +
                '</div>'
        },
        error: function (err) {
            window.alert("일정을 찾지 못하였습니다.")
            console.log(err)
        }
    })
}

/**
 * 담당자 : 정희성
 * 함수 내용 : 길어진 글자를 잘라내는 함수
 * 주요 기능 : 글자가 10글자 이상 시 ...으로 표시하는 기능
 **/
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

/**
 * 담당자 : 정희성
 * 함수 내용 : 스케줄들을 리스트에 바인딩 해주는 함수
 * 주요 기능 : 태그 클릭 시 포함된 일정들을 리스트에 바인딩하는 기능
 *          일정이 없을 시 메시지 표시 기능
 **/
function updateScheduleList(schedules) {
    const scheduleListCnt = document.querySelector('.scheduleList_cnt')
    scheduleListCnt.innerHTML =
        '<span>' + schedules.length + '</span>'

    const scheduleContentTop = document.querySelector('.scheduleContent__top > div > .selectTitle')
    scheduleContentTop.innerHTML = '';

    const myScheduleTable = document.querySelector('.tr_MyScheduleList')
    myScheduleTable.innerHTML = ''
    schedules.map((result) => {
        let date = result.startDate.substring(0, 10) + " " + result.startDate.substring(11, 16) + " ~ " + result.endDate.substring(0, 10) + " " + result.endDate.substring(11, 16);
        myScheduleTable.innerHTML +=
            '<tr class="MyScheduleList_tr" onclick="findScheduleTag(\'' + result._id + '\', this)">' +
            `<td>${(result.status == false ? "미완료" : "완료")}</td>` +
            `<td>${stringCut(result.title)}</td>` +
            `<td>${result.content}</td>` +
            `<td>${date}</td>` +
            '</tr>'
    })
    /*데이터 없을 시 메시지 표시*/
    if (schedules.length == 0) {
        document.querySelector('.ScheduleContent__mid').innerHTML = '<div class="emptyMessageDiv">일정이 없습니다.</div>'
    }
}

/**
 * 담당자 : 정희성
 * 함수 내용 : 새로고침 클릭 시 내가 만든 일정에 포함되어 있는 태그를 불러오는 함수
 * 주요 기능 : 내가 만든 일정 내 포함된 태그를 불러오는 기능
 *           동시에 차트도 새로 세팅하는 기능
 **/
function findMyTag() {
    $.ajax({
        type: 'POST',
        url: 'schedule/findCnt',
        dataType: 'json',
        success: function (res) {

            if (myChart != null && myBarChart != null) {
                myBarChart.destroy();
                myChart.destroy();
            }
            allCnt = res.allScheduleTag.length;

            setChart(res);
            setBarChart(res.selectScheduleTag);
            updateTagList(res.selectScheduleTag, res.allScheduleTag)
        },
        error: function (err) {
            window.alert("태그를 불러오던 중 오류가 발생하였습니다!")
            console.log(err)
        }
    })
}

/**
 * 담당자 : 정희성
 * 함수 내용 : 선택한 일정에 포함되어 있는 태그를 불러오는 함수
 * 주요 기능 : 일정 선택 시 해당 일정에 포함된 태그를 불러오는 기능
 *          선택 일정을 태그 목록 위에 표시해주는 기능
 **/
function findScheduleTag(scheduleId, event) {
    if(focusTr(event)){
        return;
    }
    $.ajax({
        type: 'POST',
        url: 'schedule/find/' + scheduleId,
        dataType: 'json',
        success: function (res) {

            let selectTagArr = []

            tagArr.map((result) => {
                res.schedule.tagInfo.map((tags) => {
                    if (result.content === tags.content) {
                        selectTagArr.push(result)
                    }
                })
            })

            /*선택된 일정에 담긴 태그를 바인딩*/
            updateTagList(selectTagArr)
            /*선택 일정 표시*/
            const tagContentTop = document.querySelector('.tagContent__top > div > .selectTitle')
            tagContentTop.innerHTML =
                '<div>선택 일정 </div>' +
                '<span>' + stringCut(res.schedule.title) + '</span>' +
                '<div class="tagScheduleReload">' +
                '<i class="fa-solid fa-rotate-right" style="color: #222222" onclick="findMyTag()"></i>' +
                '</div>'
        },
        error: function (err) {
            window.alert("스케줄을 찾지 못하였습니다.")
            console.log(err)
        }
    })
}

/**
 * 담당자 : 정희성
 * 함수 내용 : 태그들을 리스트에 바인딩하는 함수
 * 주요 기능 : 파라미터에서 받은 태그를 바인딩하는 기능
 *          태그 사용량을 퍼센트로 변환하여 progress로 표시하는 기능
 *          태그 전체 개수 표시 기능
 **/

/*ejs에 태그 리스트를 작성하는 고드*/
function updateTagList(tags) {
    const tagListCnt = document.querySelector('.tagList_cnt')
    tagListCnt.innerHTML =
        '<span>' + tags.length + '</span>'

    const tagContentTop = document.querySelector('.tagContent__top > div > .selectTitle')
    tagContentTop.innerHTML = ''

    const MyTagList = document.querySelector('.tr_MyTagList')
    MyTagList.innerHTML = '';

    /*태그 바인딩 및 progress*/
    tags.map((result) => {
        MyTagList.innerHTML +=
            '<tr class="MyTagList_tr" onclick="findTagSchedule(\'' + result.id + '\', this)">' +
            `<td>${result.content}</td>` +
            '<td><div style="width: 48%;margin: 0 auto;border-radius: 20px;overflow: hidden">' +
            '<span style="display:inline-block; text-align: left; line-height: 19px; height: 66.6%;width: 98%;border-radius: 20px;background-color: #c7c7c7">' +
            '<span style="text-align: center ; display:inline-block; border-radius: 20px;height: 100%;width:' + ((result.count / allCnt) * 100).toFixed(1) + '%; background-color: #0098fe;line-height: 19px">' +
            '<span class="MemberProgressText" style="color: rgb(255, 255, 255); display: inline-block; text-align: center; height: 100%; line-height: 19px; min-width: 135px;">' + ((result.count / allCnt) * 100).toFixed(1) + '</span>' +
            '</span></span></div></td>' +
            `<td>${result.count + " / " + allCnt}</td>` +
            '</tr>'
    })
    /*태그 정보 없을 시 메시지 표시*/
    if (tags.length == 0) {
        document.querySelector('.tagContent__mid').innerHTML = '<div class="emptyMessageDiv">태그가 없습니다.</div>'
        document.querySelector('.content--chart .content__mid').innerHTML = '<div class="emptyMessageDiv">태그가 없습니다.</div>'
    }
}

/**
 * 담당자 : 배도훈
 * 함수 설명 : 일정목록, 태그목록에서 클릭한 tr에 하이라이트 효과를 표시하는 함수
 * 주요 기능 : 클릭한 tr 하이라이트 효과
 */
let selectedTagTr;
let selectedScheduleTr;
function focusTr(event) {
    console.log(event)
    /** 모든 tr을 배열로 저장 */
    const trArr = document.querySelectorAll('tr')

    /** 클릭한 tr이 이미 focusedTr 클래스를 포함하고 있을 경우 */
    if (event.classList.contains('focusedTr')) {
        /** 클릭한 tr이 일정목록의 tr일 경우 */
        if(event.classList.contains('MyScheduleList_tr')){
            selectedScheduleTr = event;
            findMyTag()
        }

        /** 클릭한 tr이 태그목록의 tr일 경우 */
        if(event.classList.contains('MyTagList_tr')){
            selectedTagTr = event;
            findMySchedule()
        }

        /** focusedTr 클래스 제거 */
        event.classList.remove('focusedTr')
        return true;
    /** 클릭한 tr이 focusedTr 클래스가 없는 경우 */
    } else {
        /** focusedTr 클래스를 가진 tr의 focusedTr 클래스를 제거 */
        for (let i = 0; i < trArr.length; i++) {
            if(trArr[i].classList.contains('focusedTr')){
                trArr[i].classList.remove('focusedTr')
                break;
            }
        }
        event.classList.add('focusedTr')
        return false;
    }
}
