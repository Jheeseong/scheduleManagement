document.addEventListener('DOMContentLoaded', function () {
    findMySchedule()
    findMyTag()
})

function allReload() {
    findMySchedule()
    findMyTag()
}

/*내가 작성한 모든 스케줄리스트를 불러오는 함수*/
function findMySchedule() {
    $.ajax({
        type: 'POST',
        url: 'schedule/findByUser',
        dataType: "json",
        success: function (res) {
            updateScheduleList(res.schedule)
        },
        error: function (err) {
            window.alert("일정을 불러오던 중 오류가 발생하였습니다!")
            console.log(err)
        }
    })
}
/*선택한 태그 중 내가 작성한 스케줄리스트 불러오는 함수*/
function findTagSchedule(tagId, event) {
    focusTr(event)
    $.ajax({
        type: "POST",
        url: 'schedule/findTag/' + tagId,
        dataType: "json",
        success: function (res) {
            updateScheduleList(res.selectTag.scheduleInfo)

            const scheduleContentTop = document.querySelector('.scheduleContent__top > div > .selectTitle')
            scheduleContentTop.innerHTML =
                '<div>선택 태그</div>' +
                '<span>' + res.selectTag.content +'</span>'
        },
        error: function (err) {
            window.alert("일정을 찾지 못하였습니다.")
            console.log(err)
        }
    })
}
/*ejs에 스케줄 리스트를 작성하는 함수*/
function updateScheduleList(schedules) {
    const scheduleListCnt = document.querySelector('.scheduleList_cnt')
    scheduleListCnt.innerHTML =
        '<span>' + schedules.length +'</span>'

    const scheduleContentTop = document.querySelector('.scheduleContent__top > div > .selectTitle')
    scheduleContentTop.innerHTML = '';

    const myScheduleTable = document.querySelector('.tr_MyScheduleList')
    myScheduleTable.innerHTML = ''
    schedules.map((result) => {
        let date = result.startDate.substring(0, 10) + " " + result.startDate.substring(11,16) +" ~ "+ result.endDate.substring(0, 10) + " " + result.endDate.substring(11,16);
        myScheduleTable.innerHTML +=
            '<tr class="MyScheduleList_tr" onclick="findScheduleTag(\'' + result._id + '\', this)">' +
            `<td>${(result.status==false ? "미완료" : "완료")}</td>` +
            `<td>${result.title}</td>` +
            `<td>${result.content}</td>` +
            `<td>${date}</td>` +
            '</tr>'
    })
}
/*내가 만든 스케줄에 포함되어있는 태그를 불러오는 함수*/
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
/*선택한 스케줄에 포함되어 있는 태그를 불러오는 함수*/
function findScheduleTag(scheduleId, event) {
    focusTr(event)
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

            updateTagList(selectTagArr)

            const tagContentTop = document.querySelector('.tagContent__top > div > .selectTitle')
            tagContentTop.innerHTML =
                '<div>선택 일정</div>' +
                '<span>' + res.schedule.title +'</span>'
        },
        error: function (err) {
            window.alert("스케줄을 찾지 못하였습니다.")
            console.log(err)
        }
    })
}
/*ejs에 태그 리스트를 작성하는 고드*/
function updateTagList(tags) {
    const tagListCnt = document.querySelector('.tagList_cnt')
    tagListCnt.innerHTML =
        '<span>' + tags.length +'</span>'

    const tagContentTop = document.querySelector('.tagContent__top > div > .selectTitle')
    tagContentTop.innerHTML = ''

    const MyTagList = document.querySelector('.tr_MyTagList')
    MyTagList.innerHTML = '';

    tags.map((result) => {
        MyTagList.innerHTML +=
            '<tr class="MyTagList_tr" onclick="findTagSchedule(\'' + result.id + '\', this)">' +
            `<td>${result.content}</td>` +
            '<td><div style="width: 48%;margin: 0 auto;border-radius: 20px;overflow: hidden">' +
            '<span style="display:inline-block; text-align: left; line-height: 19px; height: 66.6%;width: 98%;border-radius: 20px;background-color: #c7c7c7">' +
            '<span style="text-align: center ; display:inline-block; border-radius: 20px;height: 100%;width:'+ ((result.count/allCnt) * 100).toFixed(1) +'%; background-color: #0098fe;line-height: 19px">' +
            '<span class="MemberProgressText" style="color: rgb(255, 255, 255); display: inline-block; text-align: center; height: 100%; line-height: 19px; min-width: 185px;">' + ((result.count/allCnt) * 100).toFixed(1) + '</span>' +
            '</span></span></div></td>' +
            `<td>${result.count + " / " + allCnt}</td>` +
            '</tr>'
    })
}

function focusTr(event){
    console.log(event)
    const trArr = document.querySelectorAll('tr')
    if(event.classList.length){
        if(event.classList.contains('focusedTr')){
            event.classList.remove('focusedTr')
        }
        else{
            for(let i = 0; i < trArr.length; i++){
                trArr[i].classList.remove('focusedTr')
            }
            event.classList.add('focusedTr')
        }
    }
}
