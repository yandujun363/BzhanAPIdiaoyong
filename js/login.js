if (cookie_value("DedeUserID") == false) {
    $(function () {
            $.ajax({
        type: "get",
        url: "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (qr_url) {
            new QRCode(document.getElementById("qrcode"),{
                text: qr_url.data.url
            })
            function qr_login() {
                $.ajax({
                    type: "get",
                    url: "https://passport.bilibili.com/x/passport-login/web/qrcode/poll",
                    data: "qrcode_key="+qr_url.data.qrcode_key,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (qr_login_data) {
                        if (qr_login_data.data.code == 0 || qr_login_data.data.code == 86090) {
                            if (qr_login_data.data.code == 0) {
                                window.location.replace("/index.html")
                            } else {
                                qr_login()
                            }
                            $("#qrcode p").text("扫码成功")
                        } else {
                            if (qr_login_data.data.code == 86038) {
                                $("#qrcode p").text("二维码已失效，请刷新页面")
                            } else {
                                setTimeout(qr_login,1000)
                            }
                        }
                    }
                });
            }
            qr_login()
        }
    })
    })
} else {
    window.location.replace("/index.html")
}