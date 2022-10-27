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
            const myScheduleTable = document.querySelector('.tr_MyScheduleList')
            myScheduleTable.innerHTML = ''
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

            const MyTagList = document.querySelector('.tr_MyTagList')
            MyTagList.innerHTML = '';
            allCnt = res.allScheduleTag.length;

            res.selectScheduleTag.map((result) => {
                MyTagList.innerHTML +=
                    '<tr onclick="findTagSchedule(\'' + result.id + '\')">' +
                    `<td>${result.content}</td>` +
                    '<td><div style="width: 48%;margin: 0 auto;border-radius: 20px;overflow: hidden">' +
                    '<span style="display:inline-block; text-align: left; line-height: 19px; height: 66.6%;width: 98%;border-radius: 20px;background-color: #c7c7c7">' +
                    '<span style="text-align: center ; display:inline-block; border-radius: 20px;height: 100%;width:'+ ((result.count/allCnt) * 100).toFixed(1) +'%; background-color: #0098fe;line-height: 19px">' +
                    '<span class="MemberProgressText" style="color: rgb(255, 255, 255); display: inline-block; text-align: center; height: 100%; line-height: 19px; width: 98%;">' + ((result.count/allCnt) * 100).toFixed(1) + '</span>' +
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
function findScheduleTag(scheduleId) {
    $.ajax({
        type: 'POST',
        url: 'schedule/find/' + scheduleId,
        dataType: 'json',
        success: function (res) {
            let selectTagArr = []
            let tagId
            tagArr.map((result) => {
                res.schedule.tagInfo.map((tags) => {
                    if (result.content === tags.content) {
                        selectTagArr.push(result)
                    }
                })
            })
            console.log(selectTagArr)

            const MyTagList = document.querySelector('.tr_MyTagList')
            MyTagList.innerHTML = '';

           selectTagArr.map((result) => {
               MyTagList.innerHTML +=
                    '<tr onclick="findTagSchedule(\'' + result.id + '\')">' +
                    `<td>${result.content}</td>` +
                    '<td><div style="width: 48%;margin: 0 auto;border-radius: 20px;overflow: hidden">' +
                    '<span style="display:inline-block; text-align: left; line-height: 19px; height: 66.6%;width: 98%;border-radius: 20px;background-color: #c7c7c7">' +
                    '<span style="text-align: center ; display:inline-block; border-radius: 20px;height: 100%;width:'+ ((result.count/allCnt) * 100).toFixed(1) +'%; background-color: #0098fe;line-height: 19px">' +
                    '<span class="MemberProgressText" style="color: rgb(255, 255, 255); display: inline-block; text-align: center; height: 100%; line-height: 19px; width: 98%;">' + ((result.count/allCnt) * 100).toFixed(1) + '</span>' +
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

function findTagSchedule(tagId) {
    $.ajax({
        type: "POST",
        url: 'schedule/findTag/' + tagId,
        dataType: "json",
        success: function (res) {
            const myScheduleTable = document.querySelector('.tr_MyScheduleList')
            myScheduleTable.innerHTML = ""
            res.selectTag.scheduleInfo.map((result) => {
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
            window.alert("일정을 찾지 못하였습니다.")
            console.log(err)
        }
    })

}

let allCnt
let tagArr = [];
var myBarChart
function setBarChart(tagData) {
    const tagNameArr = [];
    const tagCntArr = [];
    tagArr = []
    tagData.map((result) => {
        tagNameArr.push(result.content)
        tagCntArr.push(result.count)
        tagArr.push(result)
    })

    var context = document
        .getElementById('myBarChart')

    myBarChart = new Chart(context, {
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

var myChart
function setChart(tagData) {
    const tagNameArr = [];
    const tagCntArr = [];
    const tagCntPer = [];
    let totalCnt = 0;
    for (let i = 0; i < tagData.selectScheduleTag.length; i++) {
        tagNameArr.push(tagData.selectScheduleTag[i].content)
        tagCntArr.push(tagData.selectScheduleTag[i].count)
        totalCnt += tagData.selectScheduleTag[i].count;
    }


    for (let i = 0; i < tagCntArr.length; i++) {
        tagCntPer.push(((tagCntArr[i] / totalCnt) * 100).toFixed(1) + '(' + tagCntArr[i] + ')')
    }

    var context = document
        .getElementById('myChart')
        .getContext('2d');

    myChart = new Chart(context, {
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
                    hoverOffset: 20,
                    borderColor: [],
                    borderWidth: 0 //경계선 굵기
                }
            ]
        },
        options: {
            radius: '90%',
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        generateLabels: function (myChart) {
                            let str = '';
                            for(let i = 0; i < myChart.data.labels.length; i++){
                                str += '<div class="legend"><div class="label" style="background-color: ' + myChart.data.datasets[0].backgroundColor[i] + '"></div>' + myChart.data.labels[i] + '</div>';
                            }
                            document.getElementById('legendDiv').innerHTML = str;
                        },
                },
                htmlLegend:{
                    containerID: 'legendDiv'
                },


                },
                tooltips: {
                    enabled: false
                },
                datalabels: {
                    formatter: function (value, context) {
                        return Math.round(value / context.myChart.getDatasetMeta(0).total * 100) + "%";
                    },
                    color: '#fff',
                }

            }
        },
    });
}