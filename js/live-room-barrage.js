if (cookie_value("DedeUserID") == false) {
    alert("登录过期，请重新登录")
    window.location.replace("/login.html")
} else {
    $(function () {
        // ===配置===
        // 有事没事不要动这个，修改配置请用配置界面(没做保存配置功能，因为不会)!!!
        // 有事没事不要动这个，修改配置请用配置界面(没做保存配置功能，因为不会)!!!
        // 有事没事不要动这个，修改配置请用配置界面(没做保存配置功能，因为不会)!!!
        let config = {
            "是否开启自动滚动":1,
            "是否显示背景":1,
            "是否显示头像":1,
            "滚动时间":1000,//毫秒
            "进场事件显示数量":50,
            "进场事件_特效_显示数量":50,
            "弹幕事件显示数量":50,
            "礼物事件显示数量":50,
            "alpha":88,//透明度(16进制)
        }
        //===

        //===配置界面显示/隐藏===
        $(".config").toggle(
            function () {
                $(".config_value").css("display", "flex");
            },
            function () {
                $(".config_value").css("display", "none");
            }
        )
        //===

        //===是否开启自动滚动===
        $(".是否开启自动滚动").toggle(
            function () {
                config.是否开启自动滚动 = 0
                $(".是否开启自动滚动").text("是否开启自动滚动:否");
            },
            function () {
                config.是否开启自动滚动 = 1
                $(".是否开启自动滚动").text("是否开启自动滚动:是");
            }
        )
        //===

        //===是否显示/隐藏背景===
        $(".是否显示背景").toggle(
            function () {
                config.是否显示背景 = 0
                $(".是否显示背景").text("是否显示背景:否");
                $("html,body").css("background", "#00000000");
            },
            function () {
                config.是否显示背景 = 1
                if (url_parameters_value("user_cover") !=false) {
                    $("html,body").css({
                        "background": "url("+url_parameters_value("user_cover")+")",
                        "background-size": "cover"
                    })
                } else {
                    $("html,body").css({
                        "background": "#66ccff;",
                    });
                }
                $(".是否显示背景").text("是否显示背景:是");
            }
        )
        //===

        //===是否显示/隐藏头像===
        $(".是否显示头像").toggle(
            function () {
                config.是否显示头像 = 0
                $(".是否显示头像").text("是否显示头像:否")
                $(".face").css("display", "none");
            },
            function () {
                config.是否显示头像 = 1
                $(".是否显示头像").text("是否显示头像:是")
                $(".face").css("display", "flex");
            }
        )
        //===

        //===滚动时间===
        $(".滚动时间 input").val(config.滚动时间);
        $(".滚动时间 input").keydown(function () { 
            if (event.which == 13) {
                config.滚动时间 = $(".滚动时间 input").val()*1
            }
        });
        //===
        
        //===进场事件显示数量===
        $(".进场事件显示数量 input").val(config.进场事件显示数量);
        $(".进场事件显示数量 input").keydown(function () { 
            if (event.which == 13) {
                config.进场事件显示数量 = $(".进场事件显示数量 input").val()
            }
        });
        //===

        //===进场事件(特效)显示数量===
        $(".进场事件_特效_显示数量 input").val(config.进场事件_特效_显示数量);
        $(".进场事件_特效_显示数量 input").keydown(function () { 
            if (event.which == 13) {
                config.进场事件_特效_显示数量 = $(".进场事件_特效_显示数量 input").val()
            }
        });
        //===

        //===弹幕事件显示数量===
        $(".弹幕事件显示数量 input").val(config.弹幕事件显示数量);
        $(".弹幕事件显示数量 input").keydown(function () { 
            if (event.which == 13) {
                config.弹幕事件显示数量 = $(".弹幕事件显示数量 input").val()
            }
        });
        //===

        //===主播头像和名称以及直播间链接===
        $(".live_room_user,.live_room_user img").attr({
            src: url_parameters_value("face").replace("http://","https://"),
            href:"https://live.bilibili.com/"+url_parameters_value("roomid"),
            title: url_parameters_value("name")+"\n直播间"+url_parameters_value("roomid")
        });
        //===

        //===背景图===
        if (url_parameters_value("user_cover") !=false) {
            $("body").css({
                "background": "url("+url_parameters_value("user_cover")+")",
                "background-size": "cover"
            })
        }
        //===

        //===标题===
        $("title").text("B站API调用|"+url_parameters_value("name")+"-直播间弹幕");
        //===

        //===时钟===
        setTimeout(function clock() {
            let time_data = new Date()
            let time = time_data.toLocaleDateString()+"|"+["星期日","星期一","星期二","星期三","星期四","星期五","星期六"][time_data.getDay()]+"|"+time_data.toTimeString().split(" ")[0]
            $(".clock").text(time);
            setTimeout(clock,1000)
        },0)
        //===

        //===使用游览器播放===
        $(".browser_play").click(function () { 
            $.ajax({
                type: "get",
                url: "https://api.live.bilibili.com/room/v1/Room/playUrl",
                data: "cid="+url_parameters_value("roomid")+"&platform=web&quality=4",
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function (JSON) {
                    if (JSON.code == 0) {
                        window.open("/live-video.html?"+encodeURI("name="+url_parameters_value("name")+"&roomid="+url_parameters_value("roomid")+"&url="+BASE64.urlsafe_encode(JSON.data.durl[0].url)))
                    } else {
                        alert("GET错误\n错误信息:"+JSON.message)
                    }
                }
            });
        });
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

        //===调用弹幕拉取===
        webSocket()
        //===

        //===连接成功事件===
        on("Certify_Success", function(e){
            let JSON = e;
            let time_data = "",
                time = ""
            if (JSON.code == 0){
                console.log("Certify_Success");
                time_data = new Date()
                time = time_data.toTimeString().split(" ")[0]+"</br>"+time_data.toLocaleDateString()
                let html = "\
                <div class=\"DANMU_MSG\">\
                    <img class=\"face\" src=\"/img/akari.jpg\" onerror=\"this.src ='/img/akari.jpg'\" loading=\"lazy\" alt=\"\">\
                    <div class=\"data\">\
                        <div class=\"user_data\" style=\"background: #ffffff"+config.alpha+";\">\
                            <p class=\"name\">系统</p>\
                            <p class=\"time\">"+time+"</p>\
                        </div>\
                        <p class=\"text\" style=\"background: #919298"+config.alpha+";\">连接成功</p>\
                    </div>\
                </div>\
                "
                $(".弹幕事件").append(html);
            }
        })
        //===

        //===同接更新事件(房间在线观众)===
        on("ONLINE_RANK_COUNT", function (e) {
            let JSON = e
            $(".ONLINE_RANK_COUNT").text("当前同接："+JSON.data.online_count);            
        })
        //===

        //===进场事件===
        on("INTERACT_WORD", function (e) {
            let JSON = e
            let time_data = new Date(JSON.data.trigger_time/1000000)
            let time = time_data.toTimeString().split(" ")[0]+"</br>"+time_data.toLocaleDateString()
            let name = JSON.data.uinfo.base.name
            let face = JSON.data.uinfo.base.face.replace("http://","https://")
            let medal = JSON.data.uinfo.medal
            let medal_display = "",
                face_display = "",
                medal_color = "",
                medal_color_border = "",
                medal_color_end = "",
                medal_color_start = "",
                medal_level = "",
                medal_name = "",
                medal_guard_icon = "",
                medal_guard_icon_display = ""
            let msg_type = JSON.data.msg_type
            let text = ""
            if (config.是否显示头像 == 1) {
                face_display = "display: flex;"
            } else {
                face_display = "display: none;"
            }
            if (medal != null) {
                medal_display = "display: flex;"
                medal_color = "#"+JSON.data.uinfo.medal.color.toString(16).padStart(6,"0")+config.alpha
                medal_color_border = "#"+JSON.data.uinfo.medal.color_border.toString(16).padStart(6,"0")+config.alpha
                medal_color_end = "#"+JSON.data.uinfo.medal.color_end.toString(16).padStart(6,"0")+config.alpha
                medal_color_start = "#"+JSON.data.uinfo.medal.color_start.toString(16).padStart(6,"0")+config.alpha
                medal_level = JSON.data.uinfo.medal.level
                medal_name = JSON.data.uinfo.medal.name
                medal_guard_icon = JSON.data.uinfo.medal.guard_icon
                if (medal_guard_icon != "") {
                    medal_guard_icon_display = "display: flex;"
                    medal_guard_icon = JSON.data.uinfo.medal.guard_icon
                } else {
                    medal_guard_icon_display = "display: none;"
                }
            } else {
                medal_display = "display: none;"
                medal_color = "#919298"+config.alpha
            }
            if (msg_type == 1) {
                text = name+"进入直播间"
            } else {
                text = name+"关注直播间"
            }
            let html = "\
            <div class=\"INTERACT_WORD\">\
                <img class=\"face\" src=\""+face+"\" style=\""+face_display+"\" onerror=\"this.src ='/img/akari.jpg'\" loading=\"lazy\" alt=\"\">\
                <div class=\"data\">\
                    <div class=\"user_data\" style=\"background: #ffffff"+config.alpha+";\">\
                        <div class=\"medal\" style=\""+medal_display+"border: solid 1px "+medal_color_border+";background: linear-gradient(to right, "+medal_color_start+", "+medal_color_end+");\">\
                            <img class=\"guard_icon\" src=\""+medal_guard_icon+"\" style=\""+medal_guard_icon_display+"\" alt=\"\">\
                            <p class=\"medal_name\">"+medal_name+"</p>\
                            <p class=\"level\" style=\"color: "+medal_color+";\">"+medal_level+"</p>\
                        </div>\
                        <p class=\"name\">"+name+"</p>\
                        <p class=\"time\">"+time+"</p>\
                    </div>\
                    <p class=\"text\" style=\"background: "+medal_color+";\">"+text+"</p>\
                </div>\
            </div>\
            "
            $(".进场事件").append(html);
            if ($(".INTERACT_WORD").length > config.进场事件显示数量) {
                for (let i = 0; i < $(".INTERACT_WORD").length-config.进场事件显示数量; i++) {
                    const element = $(".INTERACT_WORD")[i];
                    element.remove();
                }
            }
            if (config.是否开启自动滚动 == 1) {
                const smoothScroll = (id) => {
                    const element = $(id);
                    element.stop().animate({
                        scrollTop: element.prop("scrollHeight")
                    }, config.滚动时间);
                }
                smoothScroll(".进场事件");
            }
        })
        //===

        //===进场事件(特效)===
        on("ENTRY_EFFECT", function (e) {
            let JSON = e
            let time_data = new Date(JSON.data.trigger_time/1000000)
            let time = time_data.toTimeString().split(" ")[0]+"</br>"+time_data.toLocaleDateString()
            let name = JSON.data.uinfo.base.name
            let face = JSON.data.uinfo.base.face.replace("http://","https://")
            let medal = JSON.data.uinfo.medal
            let medal_display = "",
                face_display = "",
                medal_color = "",
                medal_color_border = "",
                medal_color_end = "",
                medal_color_start = "",
                medal_level = "",
                medal_name = "",
                medal_guard_icon = "",
                medal_guard_icon_display = ""
            let text = JSON.data.copy_writing.replace(/<%.*%> /g,JSON.data.uinfo.base.name)
            if (config.是否显示头像 == 1) {
                face_display = "display: flex;"
            } else {
                face_display = "display: none;"
            }
            if (medal != null) {
                medal_display = "display: flex;"
                medal_color = "#"+JSON.data.uinfo.medal.color.toString(16).padStart(6,"0")+config.alpha
                medal_color_border = "#"+JSON.data.uinfo.medal.color_border.toString(16).padStart(6,"0")+config.alpha
                medal_color_end = "#"+JSON.data.uinfo.medal.color_end.toString(16).padStart(6,"0")+config.alpha
                medal_color_start = "#"+JSON.data.uinfo.medal.color_start.toString(16).padStart(6,"0")+config.alpha
                medal_level = JSON.data.uinfo.medal.level
                medal_name = JSON.data.uinfo.medal.name
                medal_guard_icon = JSON.data.uinfo.medal.guard_icon
                if (medal_guard_icon != "") {
                    medal_guard_icon_display = "display: flex;"
                    medal_guard_icon = JSON.data.uinfo.medal.guard_icon
                } else {
                    medal_guard_icon_display = "display: none;"
                }
            } else {
                medal_display = "display: none;"
                medal_color = "#919298"+config.alpha
            }
            let html = "\
            <div class=\"ENTRY_EFFECT\">\
                <img class=\"face\" src=\""+face+"\" style=\""+face_display+"\" onerror=\"this.src ='/img/akari.jpg'\" loading=\"lazy\" alt=\"\">\
                <div class=\"data\">\
                    <div class=\"user_data\" style=\"background: #ffffff"+config.alpha+";\">\
                        <div class=\"medal\" style=\""+medal_display+"border: solid 1px "+medal_color_border+";background: linear-gradient(to right, "+medal_color_start+", "+medal_color_end+");\">\
                            <img class=\"guard_icon\" src=\""+medal_guard_icon+"\" style=\""+medal_guard_icon_display+"\" alt=\"\">\
                            <p class=\"medal_name\">"+medal_name+"</p>\
                            <p class=\"level\" style=\"color: "+medal_color+";\">"+medal_level+"</p>\
                        </div>\
                        <p class=\"name\">"+name+"</p>\
                        <p class=\"time\">"+time+"</p>\
                    </div>\
                    <p class=\"text\" style=\"background: "+medal_color+";\">"+text+"</p>\
                </div>\
            </div>\
            "
            $(".进场事件").append(html);
            if ($(".ENTRY_EFFECT").length > config.进场事件_特效_显示数量) {
                for (let i = 0; i < $(".ENTRY_EFFECT").length-config.进场事件_特效_显示数量; i++) {
                    const element = $(".ENTRY_EFFECT")[i];
                    element.remove();
                }
            }
            if (config.是否开启自动滚动 == 1) {
                const smoothScroll = (id) => {
                    const element = $(id);
                    element.stop().animate({
                        scrollTop: element.prop("scrollHeight")
                    }, config.滚动时间);
                }
                smoothScroll(".进场事件");
            }
        })
        //===

        //===弹幕事件===
        on("DANMU_MSG", function (e) {
            let JSON = e
            let time_data = new Date(JSON.info[0][4])
            let time = time_data.toTimeString().split(" ")[0]+"</br>"+time_data.toLocaleDateString()
            let name = JSON.info[0][15].user.base.name
            let face = JSON.info[0][15].user.base.face.replace("http://","https://")
            let medal = JSON.info[0][15].user.medal
            let medal_display = "",
                face_display = "",
                medal_color = "",
                medal_color_border = "",
                medal_color_end = "",
                medal_color_start = "",
                medal_level = "",
                medal_name = "",
                medal_guard_icon = "",
                medal_guard_icon_display = ""
            let text = JSON.info[1].replace(/</g,"&lt;").replace(/>/g,"&gt;")
            if (config.是否显示头像 == 1) {
                face_display = "display: flex;"
            } else {
                face_display = "display: none;"
            }
            if (medal != null) {
                medal_display = "display: flex;"
                medal_color = "#"+JSON.info[0][15].user.medal.color.toString(16).padStart(6,"0")+config.alpha
                medal_color_border = "#"+JSON.info[0][15].user.medal.color_border.toString(16).padStart(6,"0")+config.alpha
                medal_color_end = "#"+JSON.info[0][15].user.medal.color_end.toString(16).padStart(6,"0")+config.alpha
                medal_color_start = "#"+JSON.info[0][15].user.medal.color_start.toString(16).padStart(6,"0")+config.alpha
                medal_level = JSON.info[0][15].user.medal.level
                medal_name = JSON.info[0][15].user.medal.name
                medal_guard_icon = JSON.info[0][15].user.medal.guard_icon
                if (medal_guard_icon != "") {
                    medal_guard_icon_display = "display: flex;"
                    medal_guard_icon = JSON.info[0][15].user.medal.guard_icon
                } else {
                    medal_guard_icon_display = "display: none;"
                }
            } else {
                medal_display = "display: none;"
                medal_color = "#919298"+config.alpha
            }
            let html = "\
            <div class=\"DANMU_MSG\">\
                <img class=\"face\" src=\""+face+"\" style=\""+face_display+"\" onerror=\"this.src ='/img/akari.jpg'\" loading=\"lazy\" alt=\"\">\
                <div class=\"data\">\
                    <div class=\"user_data\" style=\"background: #ffffff"+config.alpha+";\">\
                        <div class=\"medal\" style=\""+medal_display+"border: solid 1px "+medal_color_border+";background: linear-gradient(to right, "+medal_color_start+", "+medal_color_end+");\">\
                            <img class=\"guard_icon\" src=\""+medal_guard_icon+"\" style=\""+medal_guard_icon_display+"\" alt=\"\">\
                            <p class=\"medal_name\">"+medal_name+"</p>\
                            <p class=\"level\" style=\"color: "+medal_color+";\">"+medal_level+"</p>\
                        </div>\
                        <p class=\"name\">"+name+"</p>\
                        <p class=\"time\">"+time+"</p>\
                    </div>\
                    <p class=\"text\" style=\"background: "+medal_color+";\">"+text+"</p>\
                </div>\
            </div>\
            "
            $(".弹幕事件").append(html);
            if ($(".DANMU_MSG").length > config.弹幕事件显示数量) {
                for (let i = 0; i < $(".DANMU_MSG").length-config.弹幕事件显示数量; i++) {
                    const element = $(".DANMU_MSG")[i];
                    element.remove();
                }
            }
            if (config.是否开启自动滚动 == 1) {
                const smoothScroll = (id) => {
                    const element = $(id);
                    element.stop().animate({
                        scrollTop: element.prop("scrollHeight")
                    }, config.滚动时间);
                }
                smoothScroll(".弹幕事件");
            }
        })
        //===

        //===礼物事件===
        on("SEND_GIFT", function(e) {
            let JSON = e
            let time_data = new Date(JSON.data.timestamp*1000)
            let time = time_data.toTimeString().split(" ")[0]+"</br>"+time_data.toLocaleDateString()
            let name = JSON.data.sender_uinfo.base.name
            let face = JSON.data.sender_uinfo.base.face.replace("http://","https://")
            let medal = JSON.data.sender_uinfo.medal
            let action = JSON.data.action
            let gift_name = JSON.data.giftName
            let coin_type = JSON.data.coin_type
            let gift_num = JSON.data.num
            let price = JSON.data.discount_price*gift_num/1000
            let medal_display = "",
                face_display = "",
                price_display = "",
                medal_color = "",
                medal_color_border = "",
                medal_color_end = "",
                medal_color_start = "",
                medal_level = "",
                medal_name = "",
                medal_guard_icon = "",
                medal_guard_icon_display = ""
            let text = action+gift_name+"*"+gift_num
            if (config.是否显示头像 == 1) {
                face_display = "display: flex;"
            } else {
                face_display = "display: none;"
            }
            if (medal != null) {
                medal_display = "display: flex;"
                medal_color = "#"+JSON.data.sender_uinfo.medal.color.toString(16).padStart(6,"0")+config.alpha
                medal_color_border = "#"+JSON.data.sender_uinfo.medal.color_border.toString(16).padStart(6,"0")+config.alpha
                medal_color_end = "#"+JSON.data.sender_uinfo.medal.color_end.toString(16).padStart(6,"0")+config.alpha
                medal_color_start = "#"+JSON.data.sender_uinfo.medal.color_start.toString(16).padStart(6,"0")+config.alpha
                medal_level = JSON.data.sender_uinfo.medal.level
                medal_name = JSON.data.sender_uinfo.medal.name
                medal_guard_icon = JSON.data.sender_uinfo.medal.guard_icon
                if (medal_guard_icon != "") {
                    medal_guard_icon_display = "display: flex;"
                    medal_guard_icon = JSON.data.sender_uinfo.medal.guard_icon
                } else {
                    medal_guard_icon_display = "display: none;"
                }
            } else {
                medal_display = "display: none;"
                medal_color = "#919298"+config.alpha
            }
            if (coin_type == "gold") {
                price_display = "display: flex;"
            } else {
                price_display = "display: none;"
            }
            let html = "\
            <div class=\"SEND_GIFT\">\
                <img class=\"face\" src=\""+face+"\" style=\""+face_display+"\" onerror=\"this.src ='/img/akari.jpg'\" loading=\"lazy\" alt=\"\">\
                <div class=\"data\">\
                    <div class=\"user_data\" style=\"background: #ffffff"+config.alpha+";\">\
                        <div class=\"medal\" style=\""+medal_display+"border: solid 1px "+medal_color_border+";background: linear-gradient(to right, "+medal_color_start+", "+medal_color_end+");\">\
                            <img class=\"guard_icon\" src=\""+medal_guard_icon+"\" style=\""+medal_guard_icon_display+"\" alt=\"\">\
                            <p class=\"medal_name\">"+medal_name+"</p>\
                            <p class=\"level\" style=\"color: "+medal_color+";\">"+medal_level+"</p>\
                        </div>\
                        <p class=\"name\">"+name+"</p>\
                        <p class=\"price\" style=\""+price_display+"\">CNY:"+price+"</p>\
                        <p class=\"time\">"+time+"</p>\
                    </div>\
                    <p class=\"text\" style=\"background: "+medal_color+";\">"+text+"</p>\
                </div>\
            </div>\
            "
            $(".礼物事件").append(html);
            if ($(".SEND_GIFT").length > config.礼物事件显示数量) {
                for (let i = 0; i < $(".SEND_GIFT").length-config.礼物事件显示数量; i++) {
                    const element = $(".SEND_GIFT")[i];
                    element.remove();
                }
            }
            if (config.是否开启自动滚动 == 1) {
                const smoothScroll = (id) => {
                    const element = $(id);
                    element.stop().animate({
                        scrollTop: element.prop("scrollHeight")
                    }, config.滚动时间);
                }
                smoothScroll(".礼物事件");
            }
        })
        //===

        //===礼物事件(连击)===
        on("COMBO_SEND", function(e) {
            let JSON = e
            let time_data = new Date()
            let time = time_data.toTimeString().split(" ")[0]+"</br>"+time_data.toLocaleDateString()
            let name = JSON.data.sender_uinfo.base.name
            let face = JSON.data.sender_uinfo.base.face.replace("http://","https://")
            let medal = JSON.data.sender_uinfo.medal
            let action = JSON.data.action
            let gift_name = JSON.data.gift_name
            let coin_type = JSON.data.coin_type
            let gift_num = JSON.data.batch_combo_num
            let price = JSON.data.combo_total_coin/1000
            let medal_display = "",
                face_display = "",
                price_display = "",
                medal_color = "",
                medal_color_border = "",
                medal_color_end = "",
                medal_color_start = "",
                medal_level = "",
                medal_name = "",
                medal_guard_icon = "",
                medal_guard_icon_display = ""
            let text = action+gift_name+"共"+gift_num+"个"
            if (config.是否显示头像 == 1) {
                face_display = "display: flex;"
            } else {
                face_display = "display: none;"
            }
            if (medal != null) {
                medal_display = "display: flex;"
                medal_color = "#"+JSON.data.sender_uinfo.medal.color.toString(16).padStart(6,"0")+config.alpha
                medal_color_border = "#"+JSON.data.sender_uinfo.medal.color_border.toString(16).padStart(6,"0")+config.alpha
                medal_color_end = "#"+JSON.data.sender_uinfo.medal.color_end.toString(16).padStart(6,"0")+config.alpha
                medal_color_start = "#"+JSON.data.sender_uinfo.medal.color_start.toString(16).padStart(6,"0")+config.alpha
                medal_level = JSON.data.sender_uinfo.medal.level
                medal_name = JSON.data.sender_uinfo.medal.name
                medal_guard_icon = JSON.data.sender_uinfo.medal.guard_icon
                if (medal_guard_icon != "") {
                    medal_guard_icon_display = "display: flex;"
                    medal_guard_icon = JSON.data.sender_uinfo.medal.guard_icon
                } else {
                    medal_guard_icon_display = "display: none;"
                }
            } else {
                medal_display = "display: none;"
                medal_color = "#919298"+config.alpha
            }
            if (coin_type == "gold") {
                price_display = "display: flex;"
            } else {
                price_display = "display: none;"
            }
            let html = "\
            <div class=\"SEND_GIFT\">\
                <img class=\"face\" src=\""+face+"\" style=\""+face_display+"\" onerror=\"this.src ='/img/akari.jpg'\" loading=\"lazy\" alt=\"\">\
                <div class=\"data\">\
                    <div class=\"user_data\" style=\"background: #ffffff"+config.alpha+";\">\
                        <div class=\"medal\" style=\""+medal_display+"border: solid 1px "+medal_color_border+";background: linear-gradient(to right, "+medal_color_start+", "+medal_color_end+");\">\
                            <img class=\"guard_icon\" src=\""+medal_guard_icon+"\" style=\""+medal_guard_icon_display+"\" alt=\"\">\
                            <p class=\"medal_name\">"+medal_name+"</p>\
                            <p class=\"level\" style=\"color: "+medal_color+";\">"+medal_level+"</p>\
                        </div>\
                        <p class=\"name\">"+name+"</p>\
                        <p class=\"price\" style=\""+price_display+"\">CNY:"+price+"</p>\
                        <p class=\"time\">"+time+"</p>\
                    </div>\
                    <p class=\"text\" style=\"background: "+medal_color+";\">"+text+"</p>\
                </div>\
            </div>\
            "
            $(".礼物事件").append(html);
            if ($(".SEND_GIFT").length > config.礼物事件显示数量) {
                for (let i = 0; i < $(".SEND_GIFT").length-config.礼物事件显示数量; i++) {
                    const element = $(".SEND_GIFT")[i];
                    element.remove();
                }
            }
            if (config.是否开启自动滚动 == 1) {
                const smoothScroll = (id) => {
                    const element = $(id);
                    element.stop().animate({
                        scrollTop: element.prop("scrollHeight")
                    }, config.滚动时间);
                }
                smoothScroll(".礼物事件");
            }
        })
        //===

        //===SC事件===
        on("SUPER_CHAT_MESSAGE", function(e) {
            let JSON = e
            console.log(JSON.data.background_color);
            
            let time_data = new Date(JSON.send_time)
            let time = time_data.toTimeString().split(" ")[0]+"</br>"+time_data.toLocaleDateString()
            let name = JSON.data.uinfo.base.name
            let face = JSON.data.uinfo.base.face.replace("http://","https://")
            let price = JSON.data.price
            let medal = JSON.data.uinfo.medal
            let sc_background_bottom_color = JSON.data.background_bottom_color
            let sc_background_color = JSON.data.background_color
            let medal_display = "",
                face_display = "",
                medal_color = "",
                medal_color_border = "",
                medal_color_end = "",
                medal_color_start = "",
                medal_level = "",
                medal_name = "",
                medal_guard_icon = "",
                medal_guard_icon_display = ""
            let text = JSON.data.message.replace(/</g,"&lt;").replace(/>/g,"&gt;")
            if (config.是否显示头像 == 1) {
                face_display = "display: flex;"
            } else {
                face_display = "display: none;"
            }
            if (medal != null) {
                medal_display = "display: flex;"
                medal_color = "#"+JSON.data.uinfo.medal.color.toString(16).padStart(6,"0")+config.alpha
                medal_color_border = "#"+JSON.data.uinfo.medal.color_border.toString(16).padStart(6,"0")+config.alpha
                medal_color_end = "#"+JSON.data.uinfo.medal.color_end.toString(16).padStart(6,"0")+config.alpha
                medal_color_start = "#"+JSON.data.uinfo.medal.color_start.toString(16).padStart(6,"0")+config.alpha
                medal_level = JSON.data.uinfo.medal.level
                medal_name = JSON.data.uinfo.medal.name
                medal_guard_icon = JSON.data.uinfo.medal.guard_icon
                if (medal_guard_icon != "") {
                    medal_guard_icon_display = "display: flex;"
                    medal_guard_icon = JSON.data.uinfo.medal.guard_icon
                } else {
                    medal_guard_icon_display = "display: none;"
                }
            } else {
                medal_display = "display: none;"
                medal_color = "#919298"+config.alpha//"#2A60B2""#405D85""#3171D2""#7497CD"
            }
            let html = "\
            <div class=\"SUPER_CHAT_MESSAGE\">\
                <img class=\"face\" src=\""+face+"\" style=\""+face_display+"\" onerror=\"this.src ='/img/akari.jpg'\" loading=\"lazy\" alt=\"\">\
                <div class=\"data\">\
                    <div class=\"user_data\" style=\"background: "+sc_background_color+config.alpha+";\">\
                        <div class=\"medal\" style=\""+medal_display+"border: solid 1px "+medal_color_border+";background: linear-gradient(to right, "+medal_color_start+", "+medal_color_end+");\">\
                            <img class=\"guard_icon\" src=\""+medal_guard_icon+"\" style=\""+medal_guard_icon_display+"\" alt=\"\">\
                            <p class=\"medal_name\">"+medal_name+"</p>\
                            <p class=\"level\" style=\"color: "+medal_color+";\">"+medal_level+"</p>\
                        </div>\
                        <p class=\"name\">"+name+"</p>\
                        <p class=\"price\">CNY:"+price+"</p>\
                        <p class=\"time\">"+time+"</p>\
                    </div>\
                    <p class=\"text\" style=\"background: "+sc_background_bottom_color+";\">"+text+"</p>\
                </div>\
            </div>\
            "
            $(".SC或上舰事件").append(html);
            if (config.是否开启自动滚动 == 1) {
                const smoothScroll = (id) => {
                    const element = $(id);
                    element.stop().animate({
                        scrollTop: element.prop("scrollHeight")
                    }, config.滚动时间);
                }
                smoothScroll(".SC或上舰事件");//上完自修回到家洗完澡还没人发SC  //没有数据分析提交个毛线Issues //跑路
            }
        })
        //===

        //===上舰事件===
        on("GUARD_BUY", function (e) {
            let JSON = e
            console.log(JSON);
            
        })
        //===

        //===上舰庆祝事件===
        on("USER_TOAST_MSG", function (e) {
            let JSON = e
            console.log(JSON);
            
        })
        //===
    })
}