if (cookie_value("DedeUserID") == false) {
    alert("登录过期，请重新登录")
    window.location.replace("/login.html")
} else {
    $(function () {
        //===标题===
        $("title").text("B站API调用|"+url_parameters_value("name")+"-直播流");
        //===

        //===鼠标静止隐藏===
        $(".live_video").autoHideMouseCursor(5000);
        //===

        //===发送弹幕===
            //>===定义函数==
                function push_barrage() {
                    let msg = $(".push_barrage").val();
                    if (msg != "") {
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            url: "https://api.live.bilibili.com/msg/send",
                            data: "msg="+encodeURIComponent(msg)+"&roomid="+url_parameters_value("roomid")+"&csrf="+cookie_value("bili_jct")+"&csrf_token="+cookie_value("bili_jct")+"&rnd="+Date.now()*1000000+"&color=16777215&fontsize=25",
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function (response) {
                                if (response.code != 0) {
                                    alert("POST错误\n错误信息:"+response.message)
                                } else {
                                    $(".push_barrage").val("");
                                }
                            }
                        });
                    } else {
                        alert("不能发送空信息")
                    }
                }
            //>===
                //>>===按钮发送===
                    $(".push_barrage_button").click(function () {
                        push_barrage()
                    });
                //>>===
                //>>===Enter发送==
                    $(".push_barrage").keydown(function () { 
                        if (event.which == 13) {
                            push_barrage()
                        }
                    });
                //>>===
        //===
        
        //===播放直播流===
        if (url_parameters_value("url") != false) {
            if (mpegts.getFeatureList().mseLivePlayback) {
                let videoElement = $(".live_video")[0];
                let player = mpegts.createPlayer({
                    type: 'flv',  // could also be mpegts, m2ts, flv
                    isLive: true,
                    url: BASE64.urlsafe_decode(url_parameters_value("url"))
                });
                player.attachMediaElement(videoElement);
                player.load();
                player.play();
            }
        }
        //===
    })
}