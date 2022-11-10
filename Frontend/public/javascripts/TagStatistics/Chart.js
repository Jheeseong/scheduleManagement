let allCnt
let tagArr = [];
var myBarChart
var myChart
var scheduleChart

/**
 * 담당자 : 정희성
 * 함수 설명 : 일정 완료율 차트 함수
 * 주요 기능 : 일정 완료율 계산 후 차트에 바인딩 기능
 *            완료 일정/전체 일정 계산하여 퍼센트로 계산 기능
 */
function scheduleChartLib(res) {
    /*기존의 차트가 나마있는 경우 제거*/
    if (scheduleChart != null) {
        scheduleChart.destroy();
    }

    let selectScheduleArr = []

    for (let i = 0; i < res.length; i++) {
        let scheduleArr = new Object()

        /*완료 일정 갯수 및 미완료 일정 갯수 json 생성*/
        let find = selectScheduleArr.find(v => v.status === res[i].status)
        if (find === undefined) {
            scheduleArr.status = res[i].status;
            scheduleArr.count = 1;

            scheduleArr = JSON.stringify(scheduleArr);
            selectScheduleArr.push(JSON.parse(scheduleArr));
        } else {
            find.count += 1;
        }
    }

    let scheduleStatus = ['완료', '미완료']
    let scheduleCnt = [0,0]

    selectScheduleArr.map((schedule) => {
        if (schedule.status === true) {
            scheduleCnt[0] = schedule.count;
        } else {
            scheduleCnt[1] = schedule.count;
        }
    })
    /*차트 가운데 완료율 바인딩*/
    const chartCenter = document.querySelector('.chartCenter')
    chartCenter.innerHTML = '<span>'+ ((scheduleCnt[0]/(scheduleCnt[0]+scheduleCnt[1]))*100).toFixed(0) +'%</span>';

    /*차트 생성*/
    var context = document
        .getElementById('scheduleChart')

    scheduleChart = new Chart(context, {
        type: 'doughnut', // 차트의 형태
        data: { // 차트에 들어갈 데이터
            labels: scheduleStatus,
            datasets: [
                { //데이터
                    label: 'scheduleChart', //차트 제목
                    fill: false, // line 형태일 때, 선 안쪽을 채우는지 안채우는지
                    data: scheduleCnt,
                    backgroundColor: [
                        //색상
                        '#00D28C',
                        '#0098fe'
                    ],
                    borderColor: [],
                    borderWidth: 0 //경계선 굵기
                }
            ]
        },
        options: {
            maintainAspectRatio :false,
            radius: '90%',
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        /*범례 표시*/
                        generateLabels: function (scheduleChart) {
                            let str = '';

                            for(let i = 0; i < scheduleChart.data.labels.length; i++){
                                str += '<div class="legend"><div class="label" style="background-color: ' + scheduleChart.data.datasets[0].backgroundColor[i] + '"></div>' + scheduleChart.data.labels[i] + '</div>';
                            }

                            document.getElementById('legendDiv').innerHTML = str;
                        },
                    },
                    htmlLegend:{
                        containerID: 'legendDiv'
                    },
                },
            },
        },
    });
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 태그 통계 바 차트 함수
 * 주요 기능 : 태그 별 사용횟수를 바 차트로 바인딩 기능
 *            태그 갯수가 7개 초과 시 기타로 표시하는 기능
 *            차트 클릭 시 해당 태그에 담긴 일정 표시 기능
 *            범례의 기타 클릭 시 안에 담긴 태그들 표시 기능
 */
function setBarChart(tagData) {
    const tagNameArr = [];
    const tagCntArr = [];
    const etcTagName = [];
    let etcTagCnt = 0;
    tagArr = []
    tagData.map((result, index) => {
        /*태그 개수가 7개 초과 시 기타로 분류*/
        if (index < 7) {
            tagNameArr.push(result.content);
            tagCntArr.push(result.count);

        } else {
            etcTagName.push(result.content)
            etcTagCnt += result.count
        }
        tagArr.push(result);
        index++
    })
    if (tagData.length > 7) {
        tagNameArr.push('기타');
        tagCntArr.push(etcTagCnt)
    }

    var context = document
        .getElementById('myBarChart')
    /*차트 생성*/
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
            maintainAspectRatio :false,
            /*클릭한 태그의 스케줄 리스트 푣시*/
            onClick: (evt) => {
                const points = myBarChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

                if (points.length) {
                    const firstPoint = points[0];
                    var label = myBarChart.data.labels[firstPoint.index];
                    var value = myBarChart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
                    /*기타 클릭시 기타에 담긴 모든 태그 및 일정 표시*/
                    if (label === '기타') {
                        onclickEtcChart(etcTagName);
                    } else {
                        onclickChart(label)
                    }

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

/**
 * 담당자 : 정희성, 배도훈
 * 함수 설명 : pie 차트 생성 함수
 * 주요 기능 : chart.js 라이브러리를 사용하여 화면에 pie 차트 표시, 설정, 데이터 바인딩
 *            차트에 표시될 태그 개수가 8개 이상일 시 7개까지는 단일 태그로 표시하고 그 외의 태그는 기타로 표시 - 정희성
 *            라벨, 범례 기타 처리 - 정희성
 *            차트 클릭 시 이벤트 - 정희성
 *            차트 설정, 생성, 저장 - 배도훈
 */
function setChart(tagData) {
    const tagNameArr = [];
    const tagCntArr = [];
    const tagCntPer = [];
    const etcTagName = [];
    let etcTagCnt = 0;
    let totalCnt = 0;

    for (let i = 0; i < tagData.selectScheduleTag.length ; i++) {
        /** 최대 차트 숫자인 8개 이하 시 그래프에 표시 */
        if (i < 7) {
            tagNameArr.push(tagData.selectScheduleTag[i].content);
            tagCntArr.push(tagData.selectScheduleTag[i].count);
        } else {
            etcTagName.push(tagData.selectScheduleTag[i].content)
            etcTagCnt += tagData.selectScheduleTag[i].count
        }

        totalCnt += tagData.selectScheduleTag[i].count;
    }
    if (tagData.selectScheduleTag.length > 7) {
        tagNameArr.push('기타');
        tagCntArr.push(etcTagCnt)
    }


    for (let i = 0; i < tagCntArr.length; i++) {
        tagCntPer.push(((tagCntArr[i] / totalCnt) * 100).toFixed(1) + '(' + tagCntArr[i] + ')')
    }

    /** 차트 설정 */
    var context = document
        .getElementById('myChart')
        .getContext('2d');

    /** 차트 생성, 설정 및 변수에 저장 */
    myChart = new Chart(context, {
        type: 'pie', // 차트의 형태
        data: { // 차트에 들어갈 데이터
            labels: tagNameArr,
            datasets: [
                { //데이터
                    label: 'tagChart', //차트 제목
                    fill: false, // line 형태일 때, 선 안쪽을 채우는지 여부
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
                    hoverOffset: 10,
                    borderColor: [],
                    borderWidth: 0 //경계선 굵기
                }
            ]
        },
        options: {
            /** 차트 클릭 시 이벤트 */
            onClick: (evt) => {
                const points = myChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

                if (points.length) {
                    const firstPoint = points[0];
                    var label = myChart.data.labels[firstPoint.index];
                    var value = myChart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
                    if (label === '기타') {
                        onclickEtcChart(etcTagName);
                    } else {
                        onclickChart(label)
                    }
                }
            },
            radius: '90%',
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        /** 라벨 및 범례 기타 처리 */
                        generateLabels: function (myChart) {
                            let str = '';

                            for(let i = 0; i < myChart.data.labels.length; i++){
                                if (myChart.data.labels[i] === "기타") {
                                    str += '<div class="legend" onclick="openEtc()" style="cursor: pointer"><div class="label" style="background-color: ' + myChart.data.datasets[0].backgroundColor[i] + '"></div>' + myChart.data.labels[i] + '</div>' +
                                    '<div class="legend__etcList" style="display: none">'
                                    for (let i = 0; i < etcTagName.length; i++) {
                                        str += '<div class="legend__etc">' + etcTagName[i] + '</div>'
                                    }
                                    str += '</div>'
                                } else {
                                    str += '<div class="legend"><div class="label" style="background-color: ' + myChart.data.datasets[0].backgroundColor[i] + '"></div>' + myChart.data.labels[i] + " " + ((tagCntArr[i] / totalCnt)*100).toFixed(1) + "%" + '</div>';
                                }
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

/**
 * 담당자 : 정희성
 * 함수 설명 :
 * 주요 기능 :
 */
function openEtc() {
    let etcList = document.querySelector('.legend__etcList');
    if (etcList.style.display == 'none') {
        etcList.style.display = 'block';
    } else {
        etcList.style.display = 'none';
    }
}

/**
 * 담당자 : 정희성
 * 함수 설명 :
 * 주요 기능 :
 */
function onclickEtcChart(label) {
    $.ajax({
        type: 'POST',
        url: 'schedule/findEtcTag',
        data: {content: label},
        dataType: 'json',
        success: function (res) {
            let scheduleArr = []
            let selectTagArr = [];

            let str = ''
            str += '<div>선택 태그</div>'

            res.selectTag.map((tag) => {

                str += '<span>' + tag.content + '</span>';

                tagArr.map((result) => {
                    if (result.content === tag.content) {
                        selectTagArr.push(result)
                    }
                });

                tag.scheduleInfo.map((schedule) => {
                    scheduleArr.push(schedule)
                })
            })
            const scheduleContentTop = document.querySelector('.scheduleContent__top > div > .selectTitle');

            scheduleContentTop.innerHTML = str;

            const filteredArr = scheduleArr.reduce((acc, current) => {
                const x = acc.find(item => item._id === current._id);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);

            updateScheduleList(filteredArr);

            updateTagList(selectTagArr)
        },
        error: function (err) {
            window.alert("일정을 찾지 못하였습니다.")
            console.log(err)
        }
    })
}

/**
 * 담당자 : 정희성
 * 함수 설명 :
 * 주요 기능 :
 */
function onclickChart(label) {
    $.ajax({
        type: 'POST',
        url: 'schedule/findTagByContent',
        data: {content: label},
        dataType: 'json',
        success: function (res) {
            /*그래프에서 클릭한 태그가 포함되어 있는 스케줄을 불러오는 함수*/
            updateScheduleList(res.selectTag.scheduleInfo);

            const scheduleContentTop = document.querySelector('.scheduleContent__top > div > .selectTitle');
            scheduleContentTop.innerHTML =
                '<div>선택 태그</div>' +
                '<span>' + res.selectTag.content + '</span>';

            let selectTagArr = [];

            tagArr.map((result) => {
                if (result.content === res.selectTag.content) {
                    selectTagArr.push(result)
                }
            });
            /*그래프에서 클릭한 태그를 불러오는 함수*/
            updateTagList(selectTagArr);

        },
        error: function (err) {
            window.alert("일정을 찾지 못하였습니다.")
            console.log(err)
        }
    })
}