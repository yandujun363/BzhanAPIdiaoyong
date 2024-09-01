if (cookie_value("DedeUserID") == false) {
    alert("登录过期，请重新登录")
    window.location.replace("/login.html")
} else {
    $(function () {
        //===获取登录用户头像和名称===
        let User_Data = user_data(cookie_value("DedeUserID"))
        $(".top_bar img").attr({
            src: User_Data.data.face,
            title: User_Data.data.name
        });
        //===

        //===退出登录===
        $(".top_bar img").click(function () { 
            let whether_sign_out = confirm("是否退出登录")
            if (whether_sign_out == true) {
                $.ajax({
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    dataType: "json",
                    url: "https://passport.bilibili.com/login/exit/v2",
                    data: "biliCSRF="+cookie_value("bili_jct"),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (sign_out_data) {
                        if (sign_out_data.code == 0) {
                            window.location.replace("/login.html")
                        } else {
                            alert("POST错误\n错误信息:"+sign_out_data.message)
                        }
                    }
                });
            }
        });
        //===

        //===时钟===
        setTimeout(function clock() {
            let time_data = new Date()
            let time = time_data.toLocaleDateString()+"|"+["星期日","星期一","星期二","星期三","星期四","星期五","星期六"][time_data.getDay()]+"|"+time_data.toTimeString().split(" ")[0]
            $(".clock").text(time);
            setTimeout(clock,1000)
        },0)
    })
}