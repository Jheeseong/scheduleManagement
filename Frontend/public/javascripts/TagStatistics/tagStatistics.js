document.addEventListener('DOMContentLoaded', function () {
    findMySchedule()
    findMyTag()
})

function findScheduleCnt(){
    $.ajax({
        type: 'POST',
        url: 'schedule/findCnt',
        dataType: "json",

        success: function (res) {
            alert(res.scheduleCnt);
        },
        err: function (err) {
            console.log(err)
        }
    })
}
function findMySchedule() {
    const myScheduleTable = document.querySelector('.tr_MyScheduleList')
    $.ajax({
        type: 'POST',
        url: 'schedule/findByUser',
        dataType: "json",
        success: function (res) {
            res.schedule.map((result) => {
                let date = result.startDate +" ~ "+ result.endDate;
                myScheduleTable.innerHTML +=
                    '<tr>' +
                    `<td>${(result.status==false ? "미완료" : "완료")}</td>` +
                    `<td>${result.title}</td>` +
                    `<td>${date}</td>` +
                    '</tr>'
            })
        },
        error: function (err) {
            window.alert("일정을 불러오던 중 오류가 발생하였습니다!")
            console.log(err)
        }
    })
}
function findMyTag() {
    $.ajax({
        type: 'POST',
        url: 'schedule/findCnt',
        dataType: 'json',
        success: function (res) {
            const MyTagList = document.querySelector('.MyTagList')
            res.selectScheduleTag.map((result) => {
                MyTagList.innerHTML +=
                    '<div class ="MyTagDiv ' + 'tag' + result.content + '">' +
                    '<span class="MyTagValue" id="MyTagValue" value="' + result.content + '">'+ result.content + '</span>' +
                    '</div>'
            })
        },
        error: function (err) {
            window.alert("태그를 불러오던 중 오류가 발생하였습니다!")
            console.log(err)
        }
    })
}