if (cookie_value("DedeUserID") == false) {
    alert("登录过期，请重新登录")
    window.location.replace("/login.html")
} else {
    $(function () {
        const configuration = {
            "alpha":"80",//16进制
            "INTERACT_WORD":1,
            "ENTRY_EFFECT":1,
            "DANMU_MSG":1,
            "user_face":"display: none;",
            "tiem":"display: none;"
        }
        function clock() {
            let time = new Date().toLocaleDateString() + "|" + new Date().toTimeString().split(" ")[0]
            $(".clock").text(time)
            setTimeout(clock,1000)
        }
        clock()
        $(".browser_play").click(function (e) { 
            $.ajax({
                type: "get",
                url: "https://api.live.bilibili.com/room/v1/Room/playUrl",
                data: "cid="+url_parameters_value("roomid")+"&platform=web&qu=10000",
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function (live_video_url_data) {
                    if (live_video_url_data.code == 0) {
                        window.open("/live-video.html?"+encodeURIComponent("live_video_url="+BASE64.urlsafe_encode(live_video_url_data.data.durl[0].url)))
                    } else {
                        alert("GET错误")
                    }
                }
            })
        })
        new ClipboardJS(".durl",{
            text: function () {
                let durl = $.ajax({
                    type: "get",
                    url: "https://api.live.bilibili.com/room/v1/Room/playUrl",
                    data: "cid="+url_parameters_value("roomid")+"&platform=web&qu=10000",
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    async: false
                }).responseJSON.data.durl[0].url
                return durl
            }
        }).on("success", function(e) {
            alert("复制成功");
            e.clearSelection();
        }).on("error", function(e) {
            alert("复制失败");
        });
        $(".live_user_room").attr({
            "href":"https://live.bilibili.com/"+url_parameters_value("roomid")+"/"
        })
        $(".live_user_image").attr({
            "src": url_parameters_value("face"),
            "title": url_parameters_value("name")+" "+url_parameters_value("roomid")
        })
        $("body").css({
            "background-image":"url("+url_parameters_value("user_cover")+")"
        })
        $(".push_barrage_text").keydown(function (event) {//发送弹幕
            if (event.which == 13) {
                let text = $(".push_barrage_text").val()
                $(".push_barrage_text").val("")
                if (text != "") {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: "https://api.live.bilibili.com/msg/send",
                        data: "msg="+encodeURIComponent(text)+"&roomid="+url_parameters_value("roomid")+"&csrf="+cookie_value("bili_jct")+"&csrf_token="+cookie_value("bili_jct")+"&rnd="+cookie_value("DedeUserID")+"&color=16777215&fontsize=25",
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (response) {
                            if (response.code != 0) 
                            {
                                alert("发送失败")
                            }
                        }
                    })
                } else {
                    alert("不能发送空信息")
                }
            }
        })
        function barrage() {
            webSocket()
            on("ONLINE_RANK_COUNT",function (e) {
                let JSON = e
                let online_count = JSON.data.online_count
                $(".online_count_text").text("当前同接："+online_count);
            })
            on("WATCHED_CHANGE",function (e) {
                let JSON = e
                let text_large = JSON.data.text_large
                $(".text_large").text(text_large);
            })
            on("LIKE_INFO_V3_UPDATE",function (e) {
                let JSON = e
                let click_count = JSON.data.click_count
                $(".click_count").text(click_count+"点赞");
            })
            if (configuration.INTERACT_WORD === 1) {//进场或关注消息
                on("INTERACT_WORD",function (e) {
                    let JSON = e
                    let INTERACT_WORD_TYEP = ""
                    let medal_display = ""
                    let name = JSON.data.uinfo.base.name
                    let face = JSON.data.uinfo.base.face.replace("http://","https://")
                    let medal = JSON.data.uinfo.medal
                    let color,color_border,color_end,color_start,color_text_background,guard_icon,level,medal_name = ""
                    let msg_type = JSON.data.msg_type
                    let time = new Date(JSON.data.trigger_time/1000000).toLocaleDateString()+" "+new Date(JSON.data.trigger_time/1000000).toTimeString().split(" ")[0]
                    if (msg_type == 1) {
                        INTERACT_WORD_TYEP = "进入直播间"
                    } else {
                        INTERACT_WORD_TYEP = "关注直播间"
                    }
                    if (medal != null) {
                        color = "#"+JSON.data.uinfo.medal.color.toString(16).padStart(6,"0")
                        color_border = "#"+JSON.data.uinfo.medal.color_border.toString(16).padStart(6,"0")
                        color_end = "#"+JSON.data.uinfo.medal.color_end.toString(16).padStart(6,"0")
                        color_start = "#"+JSON.data.uinfo.medal.color_start.toString(16).padStart(6,"0")
                        color_text_background = "#"+JSON.data.uinfo.medal.color.toString(16).padStart(6,"0")+configuration.alpha
                        guard_icon = JSON.data.uinfo.medal.guard_icon
                        level = JSON.data.uinfo.medal.level
                        medal_name = JSON.data.uinfo.medal.name
                    } else {
                        color = ""
                        color_border = ""
                        color_end= ""
                        color_start = ""
                        color_text_background = "#a0a0a0"+configuration.alpha
                        guard_icon = ""
                        level = ""
                        medal_name = ""
                    }
                    if (medal != null) {
                        medal_display = "display: flex;"
                    } else {
                        medal_display = "display: none;"
                    }
                    let INTERACT_WORD = "\
                    <div class=\"INTERACT_WORD\">\
                    <img style=\""+configuration.user_face+"\" src=\""+face+"\" onerror=\'this.src=\"/img/noface.jpg\"\' loading=\"lazy\">\
                    <div class=\"data\">\
                        <div class=\"user\">\
                            <div class=\"medal\" style=\""+medal_display+"background-image: linear-gradient(to right,"+color_start+","+color_end+");border-color: "+color_border+";\">\
                                <img src=\""+guard_icon+"\" loading=\"lazy\">\
                                <p class=\"medal_name\">"+medal_name+"</p>\
                                <p class=\"medal_level\" style=\"color: "+color+";\">"+level+"</p>\
                            </div>\
                            <p class=\"name\">"+name+"</p>\
                            <p class=\"time\" style\""+configuration.time+"\">"+time+"</p>\
                        </div>\
                        <div class=\"text\" style=\"background-color: "+color_text_background+";\">"+INTERACT_WORD_TYEP+"</div>\
                    </div>\
                </div>\
                "
                $(".enter_event").prepend(INTERACT_WORD);
                })
            }
            if (configuration.ENTRY_EFFECT == 1) {//用户进场特效
                on("ENTRY_EFFECT",function (e) {
                    let JSON = e
                    let medal_display = ""
                    let name = JSON.data.uinfo.base.name
                    let ENTRY_EFFECT_TEXT = JSON.data.copy_writing.replace(/(<%).*?(%>)/g,name).trim()
                    let face = JSON.data.uinfo.base.face.replace("http://","https://")
                    let medal = JSON.data.uinfo.medal
                    let color,color_border,color_end,color_start,color_text_background,guard_icon,level,medal_name = ""
                    let time = new Date(JSON.data.trigger_time/1000000).toLocaleDateString()+" "+new Date(JSON.data.trigger_time/1000000).toTimeString().split(" ")[0]
                    if (medal != null) {
                        color = "#"+JSON.data.uinfo.medal.color.toString(16).padStart(6,"0")
                        color_border = "#"+JSON.data.uinfo.medal.color_border.toString(16).padStart(6,"0")
                        color_end = "#"+JSON.data.uinfo.medal.color_end.toString(16).padStart(6,"0")
                        color_start = "#"+JSON.data.uinfo.medal.color_start.toString(16).padStart(6,"0")
                        color_text_background = "#"+JSON.data.uinfo.medal.color.toString(16).padStart(6,"0")+configuration.alpha
                        guard_icon = JSON.data.uinfo.medal.guard_icon
                        level = JSON.data.uinfo.medal.level
                        medal_name = JSON.data.uinfo.medal.name
                    } else {
                        color = ""
                        color_border = ""
                        color_end= ""
                        color_start = ""
                        color_text_background = "#a0a0a0"+configuration.alpha
                        guard_icon = ""
                        level = ""
                        medal_name = ""
                    }
                    if (medal != null) {
                        medal_display = "display: flex;"
                    } else {
                        medal_display = "display: none;"
                    }
                    let ENTRY_EFFECT = "\
                    <div class=\"INTERACT_WORD\">\
                    <img style=\""+configuration.user_face+"\" src=\""+face+"\" onerror=\'this.src=\"/img/noface.jpg\"\' loading=\"lazy\">\
                    <div class=\"data\">\
                        <div class=\"user\">\
                            <div class=\"medal\" style=\""+medal_display+"background-image: linear-gradient(to right,"+color_start+","+color_end+");border-color: "+color_border+";\">\
                                <img src=\""+guard_icon+"\" loading=\"lazy\">\
                                <p class=\"medal_name\">"+medal_name+"</p>\
                                <p class=\"medal_level\" style=\"color: "+color+";\">"+level+"</p>\
                            </div>\
                            <p class=\"name\">"+name+"</p>\
                            <p class=\"time\" style\""+configuration.time+"\">"+time+"</p>\
                        </div>\
                        <div class=\"text\" style=\"background-color: "+color_text_background+";\">"+ENTRY_EFFECT_TEXT+"</div>\
                    </div>\
                </div>\
                "
                $(".enter_event").prepend(ENTRY_EFFECT);
                })
            }
            if (configuration.DANMU_MSG == 1) {//弹幕
                on("DANMU_MSG",function (e) {
                    let JSON = e
                    let medal_display = ""
                    let name = JSON.info[0][15].user.base.name
                    let DANMU_MSG_TEXT = JSON.info[1]
                    let face = JSON.info[0][15].user.base.face.replace("http://","https://")
                    let medal = JSON.info[0][15].user.medal
                    let color,color_border,color_end,color_start,color_text_background,guard_icon,level,medal_name = ""
                    let time = new Date(JSON.info[0][4]).toLocaleDateString()+" "+new Date(JSON.info[0][4]).toTimeString().split(" ")[0]
                    if (medal != null) {
                        color = "#"+JSON.info[0][15].user.medal.color.toString(16).padStart(6,"0")
                        color_border = "#"+JSON.info[0][15].user.medal.color_border.toString(16).padStart(6,"0")
                        color_end = "#"+JSON.info[0][15].user.medal.color_end.toString(16).padStart(6,"0")
                        color_start = "#"+JSON.info[0][15].user.medal.color_start.toString(16).padStart(6,"0")
                        color_text_background = "#"+JSON.info[0][15].user.medal.color.toString(16).padStart(6,"0")+configuration.alpha
                        guard_icon = JSON.info[0][15].user.medal.guard_icon
                        level = JSON.info[0][15].user.medal.level
                        medal_name = JSON.info[0][15].user.medal.name
                    } else {
                        color = ""
                        color_border = ""
                        color_end= ""
                        color_start = ""
                        color_text_background = "#a0a0a0"+configuration.alpha
                        guard_icon = ""
                        level = ""
                        medal_name = ""
                    }
                    if (medal != null) {
                        medal_display = "display: flex;"
                    } else {
                        medal_display = "display: none;"
                    }
                    let DANMU_MSG = "\
                    <div class=\"INTERACT_WORD\">\
                    <img style=\""+configuration.user_face+"\" src=\""+face+"\" onerror=\'this.src=\"/img/noface.jpg\"\' loading=\"lazy\">\
                    <div class=\"data\">\
                        <div class=\"user\">\
                            <div class=\"medal\" style=\""+medal_display+"background-image: linear-gradient(to right,"+color_start+","+color_end+");border-color: "+color_border+";\">\
                                <img src=\""+guard_icon+"\" loading=\"lazy\">\
                                <p class=\"medal_name\">"+medal_name+"</p>\
                                <p class=\"medal_level\" style=\"color: "+color+";\">"+level+"</p>\
                            </div>\
                            <p class=\"name\">"+name+"</p>\
                            <p class=\"time\" style\""+configuration.time+"\">"+time+"</p>\
                        </div>\
                        <div class=\"text\" style=\"background-color: "+color_text_background+";\">"+DANMU_MSG_TEXT+"</div>\
                    </div>\
                </div>\
                "
                $(".informational_events").prepend(DANMU_MSG);
                })
            }
        }
        barrage()
    })
}