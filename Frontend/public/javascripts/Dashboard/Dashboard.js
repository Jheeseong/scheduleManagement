document.addEventListener('DOMContentLoaded', function () {
    findLog()
    categoryList()
    findScheduleList();
})

function findScheduleList() {
    let scheduleList = document.querySelector('.scheduleList')
    let user = document.getElementById('userElement').value

    $.ajax({
        type: 'POST',
        url: 'schedule/findByUser/',
        dataType: "json",
        success: function (res) {
            let complete = '';
            let incomplete = '';

            for (let i = 0; i < res.schedule.length; i++) {
            let str = '';
                str += '<div class="scheduleRow">';
                str += '<div class="scheduleTitle">';
                str += '<div class="cb" id="cb' + i + '" onclick="toggleChk(this)"><i class="fa-solid fa-check fa-sm"></i></div>' + res.schedule[i].title;
                str += '</div>';
                str += '<div>';
                str += '<i class="fa-regular fa-calendar"></i> ' + setDate(res.schedule[i].startDate) + ' ~ ' + setDate(res.schedule[i].endDate);
                str += '</div>';
                str += '</div>';

                if (res.schedule[i].status == true) {
                    complete += str;
                }
                else{
                    incomplete += str;
                }
            }

            document.querySelector('.scheduleList.incomplete').innerHTML = incomplete;
            document.querySelector('.scheduleList.complete').innerHTML = complete;
        },
        error: function (err) {
            console.log(err)
        }

    })
}
function toggleChk(el){
    el.classList.toggle('checked');
}
function setDate(date) {
    let dateSplitArr = date.split('T');
    let toDate = dateSplitArr[0];
    let toTime = dateSplitArr[1];
    let newDate = toDate + ' ' + toTime.split(':')[0] + ':' + toTime.split(':')[1];

    return newDate;
}

function findLog() {
    const logList = document.querySelector('.logList')
    $.ajax({
        type: 'POST',
        url: 'log/findLog',
        dataType: "json",
        success: function (res) {
            let str = ''
            res.logs.map((log) => {
                str += '<div class = "logRow">' +
                    '<img class = "userImage" src="' + log.creator.image + '">'
                if (log.name.beforeName === log.name.afterName) {
                    str += '<span class = "logMessage">' + log.creator.name + "님이 " + log.name.beforeName + " " + log.content + "하였습니다." + '</span>';

                } else {
                    str += '<span class="logMessage">' + log.creator.name + "님이 " + log.name.beforeName + "에서 " + log.name.afterName + "로 " + log.content + "하였습니다." + '</span>'
                }
                str += '</div>';
            })

            logList.innerHTML = str;
        },
        error: function (err) {
            console.log(err)
        }

    })
}

function categoryList() {
    const categoryList = document.querySelector('.categoryList')
    $.ajax({
        type: 'POST',
        url: 'category/findAllCategory',
        dataType: "json",
        success: function (res) {
            let str = ''
            res.categories.map((category) => {
                str += '<div class="categoryRow">' +
                    '<div class="categoryContent">' +
                    '<div class="categoryTitle"><span>'+ category.title +'</span></div>' +
                    '<div class="categoryBottom">' +
                    '<div class="categoryTag">'
                category.tagInfo.map((tag, index) => {
                    str+= '<span>'+ tag.content +'</span>';
                    index++
                })
                str += '</div>' +
                    '<div class="categoryCreator">' +
                    '<img class="userImage" src="'+ category.creator.image +'">' +
                    '<p>'+ category.creator.name+'</p>' +
                    '</div></div></div>' +
                    '</div>'
            })

            categoryList.innerHTML = str;
        },
        error: function (err) {
        }

    })
}