if (cookie_value("DedeUserID") == false) {
    alert("登录过期，请重新登录")
    window.location.replace("/login.html")
} else {
    $(function () {
        background_image()
        if (url_parameters_value("roomid") !== false) {
            let roomid = url_parameters_value("roomid")
            $(".roomid").val(roomid)
            roomid_key(roomid)
        }
        $(".content button").click(function () { 
            let roomid = $(".roomid").val();
            if (roomid != "") {
                roomid_key(roomid)
            } else {
                alert("直播间号不能为空")
            }
        });
    })
}