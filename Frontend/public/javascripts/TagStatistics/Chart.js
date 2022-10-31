let allCnt
let tagArr = [];
var myBarChart
var myChart
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
            onClick: (evt) => {
                const points = myBarChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

                if (points.length) {
                    const firstPoint = points[0];
                    var label = myBarChart.data.labels[firstPoint.index];
                    var value = myBarChart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
                    console.log(label +" : "+ value);

                    /*findScheduleByTag();*/
                }
            },
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
    const tagNameArr = [];
    const tagCntArr = [];
    const tagCntPer = [];
    let totalCnt = 0;

    for (let i = 0; i < tagData.selectScheduleTag.length ; i++) {
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
                        '#EE657A',
                        '#DB3838',
                        '#F6621F',
                        '#F9A228',
                        '#FECC2F',
                        '#B2C225',
                        '#40A4D8',
                        '#A363D9',
                    ],
                    hoverOffset: 20,
                    borderColor: [],
                    borderWidth: 0 //경계선 굵기
                }
            ]
        },
        options: {
            onClick: (evt) => {
                const points = myChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

                if (points.length) {
                    const firstPoint = points[0];
                    var label = myChart.data.labels[firstPoint.index];
                    var value = myChart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
                    console.log(label +" : "+ value);

                    $.ajax({
                        type: 'POST',
                        url: 'schedule/findTagByContent/',
                        data: {content: label},
                        dataType: 'json',
                        success: function (res) {
                            /*그래프에서 클릭한 태그가 포함되어 있는 스케줄을 불러오는 함수*/
                            updateScheduleList(res.selectTag.scheduleInfo)

                            const scheduleContentTop = document.querySelector('.scheduleContent__top > div > .selectTitle')
                            scheduleContentTop.innerHTML =
                                '<div>선택 태그</div>' +
                                '<span>' + res.selectTag.content +'</span>'

                            let selectTagArr = []

                            tagArr.map((result) => {
                                if (result.content === res.selectTag.content) {
                                    selectTagArr.push(result)
                                }
                            })
                            /*그래프에서 클릭한 태그를 불러오는 함수*/
                            updateTagList(selectTagArr)

                        },
                        error: function (err) {
                            window.alert("일정을 찾지 못하였습니다.")
                            console.log(err)
                        }
                    })
                }
            },
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