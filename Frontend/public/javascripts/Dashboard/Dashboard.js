document.addEventListener('DOMContentLoaded', function () {
    findLog()
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
                if (log.beforeName === log.afterName) {
                    str += '<span class = "logMessage">' + log.creator.name + "님이 " + log.beforeName + " " + log.content + "하였습니다." + '</span>';

                } else {
                    str += '<span class="logMessage">'+ log.creator.name + "님이 " + log.beforeName + "에서 "+ log.afterName + "로 " + log.content + "하였습니다." +'</span>'
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