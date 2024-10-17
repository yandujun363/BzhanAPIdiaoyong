if (cookie_value("DedeUserID") === false) {
    $(function () {
        if (/OBS/gi.test(navigator.userAgent) == true) {
            $(".login_text").hide()
            $(".login_text_1").text("哔哩哔哩客户端扫码登录");
        }
        if (/Mobi|Android|iPhone/gi.test(navigator.userAgent)) {
            $("#login_url").attr("target","_blank");
        }
        background_image()
        let qrcode_data = $.ajax({
            type: "get",
            url: "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
            dataType: "json",
            async: false,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                $(".login").css("display", "flex");
                $(".qrcode").css("border", "solid 1px #888888");
            }
        }).responseJSON

        new QRCode($(".qrcode")[0],{
            text: qrcode_data.data.url
        })._el.title = "哔哩哔哩客户端扫码登录"

        function qr_login() {
            $.ajax({
                type: "get",
                url: "https://passport.bilibili.com/x/passport-login/web/qrcode/poll",
                data: "qrcode_key="+qrcode_data.data.qrcode_key,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    if (data.data.code === 0) {
                        $(".qr_me").text("扫码成功")
                        setTimeout(function(){window.location.replace("/index.html")},1000)
                    } else {
                        if (data.data.code != 86038) {
                            $(".qr_me").text(data.data.message)
                            setTimeout(qr_login,1000)
                        } else {
                            $(".qr_me").text("二维码已失效，请刷新页面")
                        }
                    }
                }
            })
        }
        qr_login()
    })
} else {
    window.location.replace("/index.html")
}