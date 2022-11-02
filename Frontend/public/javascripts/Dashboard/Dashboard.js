document.addEventListener('DOMContentLoaded', function () {
    findLog()
    categoryList()
    findScheduleList();
})

function draggable2(){
    const list = document.querySelectorAll('.scheduleList');

    list.forEach((row) => {
        row.addEventListener('dragend', () => {
        })
        new Sortable(row, {
            group: "shared",
            animation: 150,
            ghostClass: "blue-background-class"
        });
    });

}
/* 일정 드래그 기능을 활성화하는 함수 */
function draggable() {
    /* 일정 드래그 */
    const draggedSchedules = document.querySelectorAll('.scheduleRow');
    const rowContainers = document.querySelectorAll('.scheduleList');

    draggedSchedules.forEach(draggedSchedule => {
        draggedSchedule.addEventListener("dragstart", () => {
            draggedSchedule.classList.add("dragging");
        });

        draggedSchedule.addEventListener("dragend", () => {
            draggedSchedule.classList.remove("dragging");
        });
    });
    rowContainers.forEach(rowContainer => {
        rowContainer.addEventListener("dragover", e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(rowContainer, e.clientX);
            const draggable1 = document.querySelector(".dragging");
            if (afterElement === undefined) {
                rowContainer.appendChild(draggable1);
            } else {
                rowContainer.insertBefore(draggable1, afterElement);
            }
        });
    });
}

function getDragAfterElement(container, x) {
    const draggableElements = [
        ...container.querySelectorAll(".scheduleRow:not(.dragging)"),
    ];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            // console.log(offset);
            if (offset < 0 && offset > closest.offset) {
                return {offset: offset, element: child};
            } else {
                return closest;
            }
        },
        {offset: Number.NEGATIVE_INFINITY},
    ).element;
}


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
                let cbClasses;
                res.schedule[i].status == true ? cbClasses = 'cb checked' : cbClasses = 'cb';
                let str = '';
                str += '<div class="scheduleRow" draggable="true">';
                str += '<div class="scheduleTitle">';
                str += '<div class="' + cbClasses + '" id="cb' + i + '" onclick="toggleCb(this, \'' + res.schedule[i]._id + '\')"><i class="fa-solid fa-check fa-2xs"></i></div>' + res.schedule[i].title;
                str += '</div>';
                str += '<div>';
                str += '<i class="fa-regular fa-calendar"></i> ' + setDate(res.schedule[i].startDate) + ' ~ ' + setDate(res.schedule[i].endDate);
                str += '</div>';
                str += '</div>';

                if (res.schedule[i].status == true) {
                    complete += str;
                } else {
                    incomplete += str;
                }
            }

            document.querySelector('.scheduleList.incomplete').innerHTML = incomplete;
            document.querySelector('.scheduleList.complete').innerHTML = complete;
            draggable2();
        },
        error: function (err) {
            console.log(err)
        }

    })
}

function toggleCb(cb, id) {
    let selectedRow = cb.parentElement.parentElement;
    let completed = document.querySelector('.complete.scheduleList');
    let incompleted = document.querySelector('.incomplete.scheduleList');
    let status;
    cb.classList.toggle('checked');

    if (cb.classList.contains('checked')) {
        selectedRow.remove();
        completed.appendChild(selectedRow);

        status = true;
    } else {
        selectedRow.remove();
        incompleted.appendChild(selectedRow);

        status = false;
    }

    $.ajax({
        type: 'POST',
        url: 'schedule/updateStatus/' + id,
        data: {status: status},
        dataType: "json",
        success: function (res) {
            console.log(res.schedule.status)
        },
        error: function (err) {
            window.alert("일정 상태 변경 실패")
            console.log(err)
        }
    })
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
                    '<div class="categoryTitle"><span>' + category.title + '</span></div>' +
                    '<div class="categoryBottom">' +
                    '<div class="categoryTag">'
                category.tagInfo.map((tag, index) => {
                    str += '<span>' + tag.content + '</span>';
                    index++
                })
                str += '</div>' +
                    '<div class="categoryCreator">' +
                    '<img class="userImage" src="' + category.creator.image + '">' +
                    '<p>' + category.creator.name + '</p>' +
                    '</div></div></div>' +
                    '</div>'
            })

            categoryList.innerHTML = str;
        },
        error: function (err) {
        }

    })
}

