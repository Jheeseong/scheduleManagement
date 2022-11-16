let calendar;
let eventList = [];
let eventData = {};
document.addEventListener('DOMContentLoaded', function () {
    onlyMySchedule();
});
/**
 * 담당자 : 정희성
 * 함수 설명 : 내가 만든 모든 일정 달력에 바인딩 함수
 * 주요 기능 : 내가 만든 모든 일정 달력에 바인딩 기능
 *            일정 상태에 따라 색상 다르게 바인딩 기능
 */
function onlyMySchedule() {
    $.ajax({
        type: 'POST',
        url: 'schedule/findByUser',
        dataType: "json",
        async: false,
        success: function (res) {
            const schedule = res.schedule;
            eventList = [];
            for (let i = 0; i < schedule.length; i++) {
                eventData.title = schedule[i].title;
                eventData.start = schedule[i].startDate;
                eventData.end = schedule[i].endDate;
                eventData.id = schedule[i]._id;
                eventData.address = schedule[i].address;
                eventData.tags = schedule[i].tagInfo;
                /*일정 상태에 따라 색상 구분*/
                if (schedule[i].status === false) {
                    eventData.color = '#0098fe';
                } else {
                    eventData.color = '#00D28C';
                }
                eventList.push(eventData);
                eventData = {}
            }
        },
        error: function (err) {
            window.alert("일정을 불러오지 못하였습니다.")
            console.log(err)
        }
    })
    /*달력에 바인딩*/
    applyCalendar(eventList)
    /*일정 렌더링*/
    calendar.render();
}

/**
 * 담당자 : 정희성, 배도훈
 * 함수 설명 : 파라미터에 담긴 일정 캘린더 바인딩 함수
 * 주요 기능 : fullcalendar 라이브러리를 통한 일정 바인딩 기능 - 정희성 배도훈
 *            달력 크기 초과 시 more 처리 기능 - 배도훈
 *            달력 내 일자 클릭 시 해당 날짜의 일정 리스트 불러오기 기능 -배도훈
 *            달력 내 하나 일정 클릭 시 일정 세부 정보 표시 기능 - 배도훈
 */
function applyCalendar(eventList) {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'ko',
        timeZone: 'local',
        initialView: 'dayGridMonth',
        selectable: false,
        dayMaxEventRows: true,
        /*캘린더 크기 초과 시 more 처리*/
        moreLinkClick: function(info){
            let selectedEventList = [];
            /*클릭한 날 포함되어 있는 일정 리스트 불러오기*/
            for (let i = 0; i < eventList.length; i++) {
                let eventStartDay = new Date(eventList[i].start)
                let eventEndDay = new Date(eventList[i].end)
                /*let startDay = new Date(eventStartDay.getFullYear(), eventStartDay.getMonth(), eventStartDay.getDate(),0,0,0)*/
                let today = new Date(info.date)
                /*let endDay = new Date(eventEndDay.getFullYear(), eventEndDay.getMonth(), eventEndDay.getDate(),0,0,0)*/

                if (eventStartDay < today && today < eventEndDay) {
                    selectedEventList.push(eventList[i]);
                }
            }
            /*클릭 한 날 일정들을 일정리스트 모달에 표시*/
            openListModal(selectedEventList, info.date);

            return 'none';
        },
        /*클릭한 날 포함되어 있는 일정 리스트 불러오기*/
        dateClick: function (info) {
            let selectedEventList = [];

            for (let i = 0; i < eventList.length; i++) {
                let eventStartDay = new Date(eventList[i].start)
                let eventEndDay = new Date(eventList[i].end)
                /*let startDay = new Date(eventStartDay.getFullYear(), eventStartDay.getMonth(), eventStartDay.getDate(),9,0,0)*/
                let today = info.date
                /*let endDay = new Date(eventEndDay.getFullYear(), eventEndDay.getMonth(), eventEndDay.getDate(),9,0,0)*/



                if (eventStartDay <= today && today < eventEndDay) {
                    selectedEventList.push(eventList[i]);
                }
            }
            openListModal(selectedEventList, info.date);
        },
        customButtons: {
            todayCustomButton: {
                text: '현재',
                click: function() {
                    calendar.today();
                },
            }
        },
        //지우면 오늘 날짜로 시작
        headerToolbar: {
            left: 'title',
            center: '',
            right: 'todayCustomButton prevYear,prev,next,nextYear'
        },
        /*하나의 일정 클릭 시 세부 정보 일정 모달 실행*/
        eventClick: function (info) {
            openDetailModal(info.event.id);
        },
        events: eventList,
    });
}