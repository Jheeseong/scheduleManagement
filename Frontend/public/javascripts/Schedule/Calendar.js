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
            /*console.log('schedule : ' + JSON.stringify(schedule));*/
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

                console.log(today)
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
            console.log(infoDate)
            openListModal(selectedEventList, infoDate);
            /*console.log('0 : ' + selectedEventList[0].start)*/
            /*console.log('picked: ' + JSON.stringify(info.dateStr))*/
            /*console.log('eventList: ' + JSON.stringify(calendar.getEvents()));*/
        },
        //지우면 오늘 날짜로 시작
        headerToolbar: {
            left: 'prevYear,prev,next,nextYear today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        eventClick: function (info) {
            openDetailModal(info.event.id);
        },
        events: eventList,
    });
}