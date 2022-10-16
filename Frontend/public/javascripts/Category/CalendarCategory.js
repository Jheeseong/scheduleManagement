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
                    '<div class="categoryRow" onclick="readEvents()">' +
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
                        '<div class="categoryRow__user__category">' + result.title + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                } else {
                    const sharedCategoryList = document.querySelector(`.categoryRow__user__categoryList.${result.creator.name}`)
                    sharedCategoryList.innerHTML +=
                        '<div class="categoryRow__user__category">'+ result.title +'</div>'
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
