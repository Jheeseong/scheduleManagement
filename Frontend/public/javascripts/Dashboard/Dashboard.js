document.addEventListener('DOMContentLoaded', function () {
    findLog()
    categoryList()
})

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
                    '<img class = "userImage" src="'+ log.creator.image +'">'
                if (log.name.beforeName === log.name.afterName) {
                    str += '<span class = "logMessage">' + log.creator.name + "님이 " + log.name.beforeName + " " + log.content + "하였습니다." + '</span>';

                } else {
                    str += '<span class="logMessage">'+ log.creator.name + "님이 " + log.name.beforeName + "에서 "+ log.name.afterName + "로 " + log.content + "하였습니다." +'</span>'
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
            console.log(res.categories)
            let str = ''
            res.categories.map((category) => {
                str += '<li class="categoryRow">' +
                    '<div>' +
                    '<div class="categoryContent">' +
                    '<span class="categoryTitle">'+ category.title +'</span>' +
                    '<div class="categoryTag">'
                category.tagInfo.map((tag) => {
                    str+= '<span>'+ tag.content +'</span>'
                })
                str += '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>'
            })

            categoryList.innerHTML = str;
        },
        error: function (err) {
        }

    })
}