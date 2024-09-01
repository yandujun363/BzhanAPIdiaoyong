if (cookie_value("DedeUserID") == false) {
    $(function () {
        $.ajax({
            type: "get",
            url: "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            success: function (QR_data) {
                if (QR_data.code == 0) {
                    new QRCode($(".qr")[0],{
                        text: QR_data.data.url
                    })
                    setTimeout(function login() {
                        $.ajax({
                            type: "get",
                            url: "https://passport.bilibili.com/x/passport-login/web/qrcode/poll",
                            data: "qrcode_key="+QR_data.data.qrcode_key,
                            dataType: "json",
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function (QR_code_data) {
                                if (QR_code_data.code == 0) {
                                    if (QR_code_data.data.code != 0) {
                                        $(".login p").text(QR_code_data.data.message);
                                        if (QR_code_data.data.code != 86038) {
                                            setTimeout(login,1000)
                                        } else {
                                            $(".login p").text("二维码已失效,请刷新页面")
                                        }
                                    } else {
                                        window.location.replace("/index.html")
                                    }
                                } else {
                                    alert("GET错误\n错误信息:"+QR_code_data.message)
                                }
                            }
                        });
                    },0)
                } else {
                    alert("GET错误\n错误信息:"+QR_data.message)
                }
            }
        });
    })
} else {
    window.location.replace("/index.html")
}