document.addEventListener('DOMContentLoaded', function () {
    findShareCategory()
    findMyCategory()
})

function findMyCategory() {
    const myCategory = document.querySelector('.myCategory')
    $.ajax({
        type: 'POST',
        url: 'category/myCategory',
        dataType: "json",
        success: function (res) {
            myCategory.innerHTML = ''
            res.categories.map((result) => {
                myCategory.innerHTML +=
                    `<div class="categoryRow" onclick='applySchedule("${result._id}", "${result.creator}")'>` +
                    '<div>'+ result.title +'</div>' +
                    '<div class ="categoryEditDiv">' +
                    `<i class="fa-solid fa-pen" onclick='openUpdateCategoryModal("${result._id}")'></i> <i class="fa-solid fa-trash" onclick='categoryDelete("${result._id}")'></i>` +
                    '</div>' +
                    '</div>'
            })
        },
        error: function (err) {
            window.alert("나의 카테고리를 불러오지 못하였습니다!!!")
            console.log(err)
        }
    })
}

function MyCategory() {
    document.getElementsByClassName('sharedCategory')[0].style.display = 'none';
    document.getElementsByClassName('myCategory')[0].style.display = 'block';
}

/* 카테고리 영역 내 공유함 탭 클릭 시 */
function sharedCategory(){
    document.getElementsByClassName('myCategory')[0].style.display = 'none';
    document.getElementsByClassName('sharedCategory')[0].style.display = 'block';
}

function findShareCategory() {
    document.getElementsByClassName('myCategory')[0].style.display = 'none';
    document.getElementsByClassName('sharedCategory')[0].style.display = 'block';
    $.ajax({
        type: 'POST',
        url: 'category/shareCategory',
        dataType: "json",
        success: function (res) {
            const sharedCategory = document.querySelector('.sharedCategory');
            const creator = [];

            res.categories.map((result) => {
                if (!creator.includes(result.creator._id)) {
                    creator.push(result.creator._id);
                    sharedCategory.innerHTML +=
                        '<div class="categoryRow ' + result.creator.name + '">' +
                        '<div class="categoryRow__user">' +
                        '<div class="categoryRow__user__name" onclick="sharedCategoryList(\''+ result.creator.name +'\')">' + result.creator.name + '</div>' +
                        '<div class="categoryRow__user__categoryList ' + result.creator.name +'" style="display: none">' +
                        `<div class="categoryRow__user__category" onclick=\'applySchedule("${result._id}", "${result.creator._id}")\' >${result.title}</div>` +
                        '</div>' +
                        '</div>' +
                        '</div>';
                } else {
                    const sharedCategoryList = document.querySelector(`.categoryRow__user__categoryList.${result.creator.name}`)
                    sharedCategoryList.innerHTML +=
                        `<div class="categoryRow__user__category" onclick=\'applySchedule("${result._id}", "${result.creator._id}")\' >${result.title}</div>`
                }
            })
        },
        error: function (err) {
            window.alert("공유 카테고리를 불러오지 못하였습니다!!!")
            console.log(err)
        }

    })
}


/* 공유함에서 사용자 클릭 시 */
function sharedCategoryList(creator){
    let categoryList = document.querySelector(`.categoryRow__user__categoryList.${creator}`);
    if(categoryList.style.display == 'none'){
        categoryList.style.display = 'block';
    }
    else if(categoryList.style.display == 'block'){
        categoryList.style.display = 'none';
    }
}

/*카테고리 일정 글릭 시 해당 태그가 포함된 일정을 불러오는 기능*/
function applySchedule(id, creator) {
    $.ajax({
        type: 'POST',
        url: 'category/myCategory/mySchedule',
        data: {id: id, creator: creator},
        dataType: "json",
        async: false,
        success: function (res) {
            console.log(res)
            const schedules = res.schedules;
            eventList = [];
            /*console.log('schedule : ' + JSON.stringify(schedules));*/
            schedules.map((result) => {
                console.log(result)
                eventData.title = result.title;
                eventData.start = result.startDate.split('Z')[0];
                eventData.end = result.endDate.split('Z')[0];
                eventData.id = result._id;
                eventData.address = result.address
                eventData.tags = result.tagInfo;
                eventList.push(eventData);
                eventData = {}
            })
        },
        error: function (err) {
            console.log(err)
        }
    })
    calendar.removeAllEvents()
    console.log(eventList)
    applyCalendar(eventList)
    calendar.render();
}

function allCategory(){
    $.ajax({
        type: 'POST',
        url: 'category/findAllCategory',
        dataType: "json",
        async: false,
        success: function (res) {
            const schedules = res.schedules;
            eventList = [];
            schedules.map((result) => {
                console.log(result)
                eventData.title = result.title;
                eventData.start = result.startDate.split('Z')[0];
                eventData.end = result.endDate.split('Z')[0];
                eventData.id = result._id;
                eventData.address = result.address
                eventData.tags = result.tagInfo;
                eventList.push(eventData);
                eventData = {}
            })
        },
        error: function (err) {
            console.log(err)
        }
    })
    calendar.removeAllEvents()
    console.log(eventList)
    applyCalendar(eventList)
    calendar.render();
}
