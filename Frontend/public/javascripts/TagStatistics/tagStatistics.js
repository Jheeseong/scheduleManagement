function findScheduleCnt(){
    $.ajax({
        type: 'POST',
        url: 'schedule/findCnt',
        dataType: "json",

        success: function (res) {
            alert(res.scheduleCnt);
        },
        err: function (err) {
            console.log(err)
        }
    })
}