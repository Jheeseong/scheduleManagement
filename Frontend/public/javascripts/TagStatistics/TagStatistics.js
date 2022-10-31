document.addEventListener('DOMContentLoaded', function () {
    findMySchedule()
    findMyTag()
})

function findMySchedule() {
    $.ajax({
        type: 'POST',
        url: 'schedule/findByUser',
        dataType: "json",
        success: function (res) {

            const scheduleListCnt = document.querySelector('.scheduleList_cnt')
            scheduleListCnt.innerHTML =
                '<span>' + res.schedule.length +'</span>'

            const scheduleContentTop = document.querySelector('.scheduleContent__top > div > .selectTitle')
            scheduleContentTop.innerHTML = '';

            const myScheduleTable = document.querySelector('.tr_MyScheduleList')
            myScheduleTable.innerHTML = ''
            res.schedule.map((result) => {
                let date = result.startDate.substring(0, 10) + " " + result.startDate.substring(11,16) +" ~ "+ result.endDate.substring(0, 10) + " " + result.endDate.substring(11,16);
                myScheduleTable.innerHTML +=
                    '<tr class="MyScheduleList_tr" onclick="findScheduleTag(\'' + result._id + '\', this)">' +
                    `<td>${(result.status==false ? "미완료" : "완료")}</td>` +
                    `<td>${result.title}</td>` +
                    `<td>${result.content}</td>` +
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

            if (myChart != null && myBarChart != null) {
                myBarChart.destroy();
                myChart.destroy();
            }

            setChart(res);
            setBarChart(res.selectScheduleTag);

            const tagListCnt = document.querySelector('.tagList_cnt')
            tagListCnt.innerHTML =
                '<span>' + res.selectScheduleTag.length +'</span>'

            const tagContentTop = document.querySelector('.tagContent__top > div > .selectTitle')
            tagContentTop.innerHTML = ''

            const MyTagList = document.querySelector('.tr_MyTagList')
            MyTagList.innerHTML = '';
            allCnt = res.allScheduleTag.length;

            res.selectScheduleTag.map((result) => {
                MyTagList.innerHTML +=
                    '<tr class="MyTagList_tr" onclick="findTagSchedule(\'' + result.id + '\', this)">' +
                    `<td>${result.content}</td>` +
                    '<td><div style="width: 48%;margin: 0 auto;border-radius: 20px;overflow: hidden">' +
                    '<span style="display:inline-block; text-align: left; line-height: 19px; height: 66.6%;width: 98%;border-radius: 20px;background-color: #c7c7c7">' +
                    '<span style="text-align: center ; display:inline-block; border-radius: 20px;height: 100%;width:'+ ((result.count/allCnt) * 100).toFixed(1) +'%; background-color: #0098fe;line-height: 19px">' +
                    '<span class="MemberProgressText" style="color: rgb(255, 255, 255); display: inline-block; text-align: center; height: 100%; line-height: 19px; min-width: 185px;">' + ((result.count/allCnt) * 100).toFixed(1) + '</span>' +
                    '</span></span></div></td>' +
                    /*`<td><progress value="${((result.count/allCnt) * 100).toFixed(1)}" max="100"></progress></td>` +*/
                    `<td>${result.count + " / " + allCnt}</td>` +
                    '</tr>'
                /*'<div class ="MyTagDiv ' + 'tag' + result.content + '">' +
                '<span class="MyTagValue" id="MyTagValue" value="' + result.content + '">' + result.content + '</span>' +
                '</div>'*/
            })
        },
        error: function (err) {
            window.alert("태그를 불러오던 중 오류가 발생하였습니다!")
            console.log(err)
        }
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

function findScheduleTag(scheduleId, event) {
    console.log('123 : ' + event)
    focusTr(event)

    $.ajax({
        type: 'POST',
        url: 'schedule/find/' + scheduleId,
        dataType: 'json',
        success: function (res) {

            /*const tr_schedule = document.querySelector('.tr_MyScheduleList')
            const tr = tr_schedule.getElementsByTagName("tr")
            for (let i = 0; i < tr.length; i++) {
                tr[i].addEventListener('mouseover',function (){
                    tr[i].setAttribute('class','hover')
                })
                tr[i].addEventListener('mouseout', function (){
                    tr[i].removeAttribute('class')
                })
                tr[i].style.background = "white";
            }
            event.style.backgroundColor = "red";*/

            let selectTagArr = []

            tagArr.map((result) => {
                res.schedule.tagInfo.map((tags) => {
                    if (result.content === tags.content) {
                        selectTagArr.push(result)
                    }
                })
            })

            const tagListCnt = document.querySelector('.tagList_cnt')
            tagListCnt.innerHTML =
                '<span>' + selectTagArr.length +'</span>'

            const tagContentTop = document.querySelector('.tagContent__top > div > .selectTitle')
            tagContentTop.innerHTML =
                '<div>선택 일정</div>' +
                '<span>' + res.schedule.title +'</span>'



            const MyTagList = document.querySelector('.tr_MyTagList')
            MyTagList.innerHTML = '';

           selectTagArr.map((result) => {
               MyTagList.innerHTML +=
                    '<tr class="MyTagList_tr" onclick="findTagSchedule(\'' + result.id + '\', this)">' +
                    `<td>${result.content}</td>` +
                    '<td><div style="width: 48%;margin: 0 auto;border-radius: 20px;overflow: hidden">' +
                    '<span style="display:inline-block; text-align: left; line-height: 19px; height: 66.6%;width: 98%;border-radius: 20px;background-color: #c7c7c7">' +
                    '<span style="text-align: center ; display:inline-block; border-radius: 20px;height: 100%;width:'+ ((result.count/allCnt) * 100).toFixed(1) +'%; background-color: #0098fe;line-height: 19px">' +
                    '<span class="MemberProgressText" style="color: rgb(255, 255, 255); display: inline-block; text-align: center; height: 100%; line-height: 19px; min-width: 185px;">' + ((result.count/allCnt) * 100).toFixed(1) + '</span>' +
                    '</span></span></div></td>' +
                    /*`<td><progress value="${((result.count/allCnt) * 100).toFixed(1)}" max="100"></progress></td>` +*/
                    `<td>${result.count + " / " + allCnt}</td>` +
                    '</tr>'
                /*'<div class ="MyTagDiv ' + 'tag' + result.content + '">' +
                '<span class="MyTagValue" id="MyTagValue" value="' + result.content + '">' + result.content + '</span>' +
                '</div>'*/
            })
        },
        error: function (err) {
            window.alert("스케줄을 찾지 못하였습니다.")
            console.log(err)
        }
    })
}

function findTagSchedule(tagId, event) {
    focusTr(event)

    $.ajax({
        type: "POST",
        url: 'schedule/findTag/' + tagId,
        dataType: "json",
        success: function (res) {
            const scheduleListCnt = document.querySelector('.scheduleList_cnt')
            scheduleListCnt.innerHTML =
                '<span>' + res.selectTag.scheduleInfo.length +'</span>'

            const scheduleContentTop = document.querySelector('.scheduleContent__top > div > .selectTitle')
            scheduleContentTop.innerHTML =
                '<div>선택 태그</div>' +
                '<span>' + res.selectTag.content +'</span>'


            const myScheduleTable = document.querySelector('.tr_MyScheduleList')
            myScheduleTable.innerHTML = ""
            res.selectTag.scheduleInfo.map((result) => {
                let date = result.startDate.substring(0, 10) + " " + result.startDate.substring(11,16) +" ~ "+ result.endDate.substring(0, 10) + " " + result.endDate.substring(11,16);
                myScheduleTable.innerHTML +=
                    '<tr class="MyScheduleList_tr" onclick="findScheduleTag(\'' + result._id + '\', this)">' +
                    `<td>${(result.status==false ? "미완료" : "완료")}</td>` +
                    `<td>${result.title}</td>` +
                    `<td>${result.content}</td>` +
                    `<td>${date}</td>` +
                    '</tr>'
            })
        },
        error: function (err) {
            window.alert("일정을 찾지 못하였습니다.")
            console.log(err)
        }
    })

}

function findScheduleByTag(label){
    $.ajax({
        type: 'POST',
        url: 'schedule/findScheduleByTag',
        data: label,
        dataType: 'json',
        success: function (res) {
            console.log(JSON.stringify(res));
        },
        error: function (err) {
            window.alert("일정 검색 실패")
            console.log(err)
        }
    })
}
