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
                let date = result.startDate.substring(0, 10) + " " + result.startDate.substring(11,16) +" ~ "+ result.endDate.substring(0, 10) + " " + result.endDate.substring(11,16);
                myScheduleTable.innerHTML +=
                    '<tr onclick="findScheduleTag(\'' + result._id + '\')">' +
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
function findScheduleTag(scheduleId) {
    $.ajax({
        type: 'POST',
        url: 'schedule/find/' + scheduleId,
        dataType: 'json',
        success: function (res) {
            const selectTagArr = []
            tagArr.map((result) => {
                if (result.content === res.schedule.tagInfo.content) {
                    selectTagArr.push(result)
                }
            })
            console.log(selectTagArr)
        },
        error: function (err) {

        }
    })
}
function findMyTag() {
    $.ajax({
        type: 'POST',
        url: 'schedule/findCnt',
        dataType: 'json',
        success: function (res) {
            setChart(res);
            setBarChart(res.selectScheduleTag);
            /*const MyTagList = document.querySelector('.MyTagList')
            res.selectScheduleTag.map((result) => {
                MyTagList.innerHTML +=
                    '<div class ="MyTagDiv ' + 'tag' + result.content + '">' +
                    '<span class="MyTagValue" id="MyTagValue" value="' + result.content + '">'+ result.content + '</span>' +
                    '</div>'
            })*/
        },
        error: function (err) {
            window.alert("태그를 불러오던 중 오류가 발생하였습니다!")
            console.log(err)
        }
    })
}

const tagArr = [];
function setBarChart(tagData) {
    const tagNameArr = [];
    const tagCntArr = [];
    tagData.map((result) => {
        tagNameArr.push(result.content)
        tagCntArr.push(result.count)
        tagArr.push(result)
    })

    var context = document
        .getElementById('myBarChart')

    var myBarChart = new Chart(context, {
        type: 'bar', // 차트의 형태
        data: { // 차트에 들어갈 데이터
            labels: tagNameArr,
            datasets: [
                { //데이터
                    label: '사용 횟수', //차트 제목
                    data: tagCntArr,
                    backgroundColor: [
                        //색상
                        '#bf1932',
                        '#e2583e',
                        '#f0c05a',
                        '#88b04b',
                        '#93a9d1',
                        '#0f4c81',
                        '#6667ab',
                        '#8e8e8e',
                    ],
                    borderColor: [],
                    borderWidth: 0 //경계선 굵기
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            },
            scale: {
              ticks: {
                  stepSize: 1
              }
            },
            scales: {
                x: {
                  grid: {
                      display: false
                  }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            },
        }
    });
}

function setChart(tagData) {
    console.log(JSON.stringify(tagData.selectScheduleTag))
    const tagNameArr = [];
    const tagCntArr = [];
    const tagCntPer = [];
    let totalCnt = 0;
    for(let i = 0; i < tagData.selectScheduleTag.length; i++){
        tagNameArr.push(tagData.selectScheduleTag[i].content)
        tagCntArr.push(tagData.selectScheduleTag[i].count)
        totalCnt += tagData.selectScheduleTag[i].count;
    }
    console.log('tagNameArr : ' + tagNameArr)
    console.log('tagCntArr : ' + tagCntArr)
    console.log('totalCnt : ' + totalCnt)

    for(let i = 0; i < tagCntArr.length; i++){
        tagCntPer.push(((tagCntArr[i] / totalCnt) * 100).toFixed(1) + '(' + tagCntArr[i] + ')')
    }
    console.log('percent : ' + tagCntPer)

    var context = document
        .getElementById('myChart')
        .getContext('2d');

    var myChart = new Chart(context, {
        type: 'pie', // 차트의 형태
        data: { // 차트에 들어갈 데이터
            labels: tagNameArr,
            datasets: [
                { //데이터
                    label: 'tagChart', //차트 제목
                    fill: false, // line 형태일 때, 선 안쪽을 채우는지 안채우는지
                    data: tagCntArr,
                    backgroundColor: [
                        //색상
                        '#bf1932',
                        '#e2583e',
                        '#f0c05a',
                        '#88b04b',
                        '#93a9d1',
                        '#0f4c81',
                        '#6667ab',
                        '#8e8e8e',
                    ],
                    borderColor: [],
                    borderWidth: 0 //경계선 굵기
                }
            ]
        },
        options: {
            legend: {
                display: false
            },
            plugins: {
                tooltips: {
                    enabled: false
                },
                datalabels: {
                    formatter: function (value, context) {
                        return Math.round(value / context.chart.getDatasetMeta(0).total * 100) + "%";
                    },
                    color: '#fff',
                }
            }
        }
    });
}