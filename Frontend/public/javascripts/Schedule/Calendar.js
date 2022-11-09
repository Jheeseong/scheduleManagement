let calendar;
let eventList = [];
let eventData = {};
document.addEventListener('DOMContentLoaded', function () {
    onlyMySchedule();
});
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
                eventData.start = schedule[i].startDate.split('Z')[0];
                eventData.end = schedule[i].endDate.split('Z')[0];
                eventData.id = schedule[i]._id;
                eventData.address = schedule[i].address;
                eventData.tags = schedule[i].tagInfo;
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
    applyCalendar(eventList)
    calendar.render();
}

function applyCalendar(eventList) {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'Asia/Seoul',
        initialView: 'dayGridMonth',
        selectable: false,
        dayMaxEventRows: true,
        moreLinkClick: function(info){
            let infoDate = info.date.toISOString().slice(0, 16)
            let selectedEventList = [];

            for (let i = 0; i < eventList.length; i++) {
                let eventStartDay = new Date(eventList[i].start)
                let eventEndDay = new Date(eventList[i].end)
                let startDay = new Date(eventStartDay.getFullYear(), eventStartDay.getMonth(), eventStartDay.getDate(),9,0,0).toISOString()
                let today = new Date(info.date).toISOString()
                let endDay = new Date(eventEndDay.getFullYear(), eventEndDay.getMonth(), eventEndDay.getDate(),9,0,0).toISOString()

                if (startDay <= today && today <= endDay) {
                    selectedEventList.push(eventList[i]);
                }
            }
            openListModal(selectedEventList, infoDate);

            return 'none';
        },

        dateClick: function (info) {
            let infoDate = info.date.toISOString().slice(0, 16)
            let selectedEventList = [];

            for (let i = 0; i < eventList.length; i++) {
                let eventStartDay = new Date(eventList[i].start)
                let eventEndDay = new Date(eventList[i].end)
                let startDay = new Date(eventStartDay.getFullYear(), eventStartDay.getMonth(), eventStartDay.getDate(),9,0,0).toISOString()
                let today = new Date(info.dateStr).toISOString()/*.getDate().toString().split('T')*/
                let endDay = new Date(eventEndDay.getFullYear(), eventEndDay.getMonth(), eventEndDay.getDate(),9,0,0).toISOString()


                if (startDay <= today && today <= endDay) {
                    selectedEventList.push(eventList[i]);
                }
            }
            openListModal(selectedEventList, infoDate);
        },
        //지우면 오늘 날짜로 시작
        headerToolbar: {
            left: 'title',
            center: '',
            right: 'today prevYear,prev,next,nextYear'
        },
        eventClick: function (info) {
            openDetailModal(info.event.id);
        },
        events: eventList,
    });
}