/**
* 담당자 : 정희성
* 함수 내용 : 캘린더 페이지 시작 시 나의 카테고리 및 공유 카테고리를 찾는 함수
* 주요 기능 : 공유받은 카테고리를 찾아 페이지 왼쪽 카테고리 리스트에 바인딩하는 기능
 *          내가 만든 카테고리를 찾아 페이지 왼쪽 카테고리 리스트에 바인딩하는 기능
**/
document.addEventListener('DOMContentLoaded', function () {
    findShareCategory()
    findMyCategory()
})

/**
* 담당자 : 정희성
* 함수 내용 : 나의 카테고리를 찾는 함수
* 주요 기능 : 내가 만든 카테고리를 찾아 카테고리 이름을 바인딩하는 기능
 *          내가 만든 카테고리 클릭 시 포함된 일정을 달력에 바인딩하는 기능
 *          내가 만든 카테고리가 없을 시 없다고 표시하는 기능
 *          카테고리에 커서를 올려둘 시 편집 및 삭제 버튼이 생기는 기능
**/
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
            if(res.categories.length == 0){
                myCategory.innerHTML = '<div class="emptyMessageDiv">My 카테고리가 없습니다.</div>'
            }
        },
        error: function (err) {
            window.alert("나의 카테고리를 불러오지 못하였습니다!!!")
            console.log(err)
        }
    })
}
/**
* 담당자 : 정희성
* 함수 내용 : 카테고리 영역 내 My 버튼 클릭 시 내가 만든 카테고리 리스트를 보여주는 함수
* 주요 기능 : my 버튼 클릭시 내가 만든 카테고리 리스트를 보여주는 기능
 *          내가 만든 모든 일정을 달력에 바인딩하는 기능
**/
function MyCategory() {
    document.getElementsByClassName('sharedCategory')[0].style.display = 'none';
    document.getElementsByClassName('myCategory')[0].style.display = 'block';
    document.getElementsByClassName('allCategory')[0].style.display = 'none';
    onlyMySchedule()
}

/**
* 담당자 : 정희성
* 함수 내용 : 카테고리 영역 내 내 공유 함 클릭시 공유 카테고리 리스트를 보여주는 함수
* 주요 기능 :카테고리 영역 내 내 공유 함 클릭시 공유 카테고리 리스트를 보여주는 기능
**/
/* 카테고리 영역 내 공유함 탭 클릭 시 */
function sharedCategory(){
    document.getElementsByClassName('myCategory')[0].style.display = 'none';
    document.getElementsByClassName('sharedCategory')[0].style.display = 'block';
    document.getElementsByClassName('allCategory')[0].style.display = 'none';
}

/**
* 담당자 : 정희성
* 함수 내용 : 공유 받은 카테고리 리스트 및 해당 카테고리에 있는 일정리스트를 보여주는 함수
* 주요 기능 : 공유 해준 유저 이름 바인딩하는 기능
 *          유저 이름 클릭 시 포함되어 있는 카테고리를 바인딩하는 기능
 *          카테고리 클릭 시 달력에 바인딩 하는 기능
 *          공유 받은 카테고리가 없을 시 없다고 표시해주는 기능
**/
function findShareCategory() {
    document.getElementsByClassName('myCategory')[0].style.display = 'block';
    document.getElementsByClassName('sharedCategory')[0].style.display = 'none';
    /*ajax를 통해 공유받은 카테고리를 바인딩*/
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
            /*공유 카테고리가 없을 시 메시지 표시*/
            if(res.categories.length == 0){
                sharedCategory.innerHTML = '<div class="emptyMessageDiv">공유받은 카테고리가 없습니다.</div>'
            }
        },
        error: function (err) {
            window.alert("공유 카테고리를 불러오지 못하였습니다!!!")
            console.log(err)
        }

    })
}

/**
* 담당자 : 정희성
* 함수 내용 : 공유함에서 사용자 클릭 시 포함되어 있는 카테고리 표시 함수
* 주요 기능 : 공유함에서 사용자 클릭 시 포함되어 있는 카테고리 표시 기능
**/
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

/**
* 담당자 : 정희성
* 함수 내용 : 카테고리 영역 내 all 카테고리에서 유저 이름 클릭 시 포함되어 있는 카테고리 표시 함수
* 주요 기능 : all 카테고리 내 유저 이름 클릭 시 포함되어 있는 카테고리 표시 함수
**/
function allCategoryList(creator) {
    let categoryList = document.querySelector(`.allCategoryRow__user__categoryList.${creator}`);
    if(categoryList.style.display == 'none'){
        categoryList.style.display = 'block';
    }
    else if(categoryList.style.display == 'block'){
        categoryList.style.display = 'none';
    }
}

/**
* 담당자 : 정희성
* 함수 내용 : 클릭한 카테고리에 포함된 일정들을 달력에 바인딩 하는 함수
* 주요 기능 : 카테고리 클릭 시 일정을 불러오는 기능
 *          불러온 일정을 달력에 바인딩하는 기능
 *          완료 시 초록색 미완료시 파란색으로 달력에 표시해주는 기능
**/
/*카테고리 일정 글릭 시 해당 태그가 포함된 일정을 불러오는 기능*/
function applySchedule(id, creator) {
    $.ajax({
        type: 'POST',
        url: 'category/myCategory/mySchedule',
        data: {id: id, creator: creator},
        dataType: "json",
        async: false,
        success: function (res) {
            const schedules = res.schedules;
            /*해당 일정들의 정보를 담는 배열*/
            eventList = [];
            schedules.map((result) => {
                eventData.title = result.title;
                eventData.start = result.startDate.split('Z')[0];
                eventData.end = result.endDate.split('Z')[0];
                eventData.id = result._id;
                eventData.address = result.address
                /*일정의 완료 여부에 따라 색깔을 다르게 부여*/
                if (result.status === false) {
                    eventData.color = '#0098fe';
                } else {
                    eventData.color = '#00D28C';
                }
                eventData.tags = result.tagInfo;
                eventList.push(eventData);
                eventData = {}
            })
        },
        error: function (err) {
            window.alert("일정을 불러오는데 실패하였습니다.")
            console.log(err)
        }
    })
    /*달력에 남아 있는 기존 데이터 제거*/
    calendar.removeAllEvents()
    /*달력에 바인딩*/
    applyCalendar(eventList)
    /*달력 렌더링*/
    calendar.render();
}
/**
* 담당자 : 정희성
* 함수 내용 : 카테고리 영역 내 all 클릭 시 내가 만든 카테고리 혹은 공유 받은 카테고리를 불러오는 함수
* 주요 기능 : 카테고리 영역 내 all 클릭 시 내가 만든 카테고리 목록과 공유받은 카테고리 및 본인 이름과 공유 유저 이름 바인딩하는 기능
 *          이름 클릭 시 포함되어 있는 카테고리를 보여주는 기능
 *          카테고리 클릭 시 달력에 바인딩해주는 기능
 *          전체 카테고리가 없을 시 메시지를 띄어누는 기능
**/
function allCategory(){
    document.getElementsByClassName('myCategory')[0].style.display = 'none';
    document.getElementsByClassName('sharedCategory')[0].style.display = 'none';
    document.getElementsByClassName('allCategory')[0].style.display = 'block';
    /*ajax를 통해 내가 만든 카테고리 및 공유 카테고리 모두를 불러오옴*/
    $.ajax({
        type: 'POST',
        url: 'category/findAllCategory',
        dataType: "json",
        async: false,
        success: function (res) {
            const allCategory = document.querySelector('.allCategory')
            const creator = [];

            allCategory.innerHTML = ''

            res.categories.map((result) => {
                /*해당되는 이름 밑에 카테고리 바인딩*/
                if (!creator.includes(result.creator._id)) {
                    creator.push(result.creator._id);
                    allCategory.innerHTML +=
                        '<div class="allCategoryRow ' + result.creator.name + '">' +
                        '<div class="allCategoryRow__user">' +
                        '<div class="allCategoryRow__user__name" onclick="allCategoryList(\''+ result.creator.name +'\')">' + result.creator.name + '</div>' +
                        '<div class="allCategoryRow__user__categoryList ' + result.creator.name +'" style="display: none">' +
                        `<div class="allCategoryRow__user__category" onclick=\'applySchedule("${result._id}", "${result.creator._id}")\' >${result.title}</div>` +
                        '</div>' +
                        '</div>' +
                        '</div>';
                } else {
                    const allCategoryList = document.querySelector(`.allCategoryRow__user__categoryList.${result.creator.name}`)
                    allCategoryList.innerHTML +=
                        `<div class="allCategoryRow__user__category" onclick=\'applySchedule("${result._id}", "${result.creator._id}")\' >${result.title}</div>`
                }
            })
            /*아무 카테고리가 없을 시 메시지 표시*/
            if(res.categories.length == 0){
                allCategory.innerHTML = '<div class="emptyMessageDiv">공유받은 카테고리가 없습니다.</div>'
            }
            const schedules = res.schedules;
            /*바인딩 될 일정 정보를 배열에 담음*/
            eventList = [];
            schedules.map((result) => {
                eventData.title = result.title;
                eventData.start = result.startDate.split('Z')[0];
                eventData.end = result.endDate.split('Z')[0];
                eventData.id = result._id;
                eventData.address = result.address;
                eventData.tags = result.tagInfo;
                /*일정 완료 여부에 따라 다른 색깔 부여*/
                if (result.status === false) {
                    eventData.color = '#0098fe';
                } else {
                    eventData.color = '#00D28C';
                }
                eventList.push(eventData);
                eventData = {}
            })
        },
        error: function (err) {
            window.alert("전체 카테고리를 찾을 수 없습니다.")
            console.log(err)
        }
    })
    /*달력에 바인딩된 기존 일정 제거*/
    calendar.removeAllEvents()
    /*달력에 바인딩*/
    applyCalendar(eventList)
    /*달력 렌더링*/
    calendar.render();
}
