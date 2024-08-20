if (cookie_value("DedeUserID") == false) {
    alert("登录过期，请重新登录")
    window.location.replace("/login.html")
} else {
    $(function () {
        function 用户信息() {
            const {data:{name,face}} = User_Information(cookie_value("DedeUserID"))
            $(".user .user_image").attr({
                "src": face,
                "alt": name,
                "title": name
            })
        }
        用户信息()
        $(".user").click(function () { 
            let User_Boolean = confirm("确认退出登录吗？")
            if (User_Boolean == true) {
                $.ajax({
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    dataType: "json",
                    url: "https://passport.bilibili.com/login/exit/v2",
                    data: "biliCSRF="+cookie_value("bili_jct"),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function () {
                        window.location.replace("/login.html")
                    }
                })
            }
        })
    })
}