if (cookie_value("DedeUserID") == false) {
    alert("登录过期，请重新登录")
    window.location.replace("/login.html")
} else {
    $(function () {
        $(".confirm").click(function () { 
            let live_room_id = $(".live-room-id").val()
            if (live_room_id != "") {
                if (/^[0-9]{1,19}$/g.test(live_room_id) == true) {
                    $.ajax({
                        type: "get",
                        url: "https://api.live.bilibili.com/room/v1/Room/get_info",
                        data: "room_id="+live_room_id,
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (live_room_user) {
                            if (live_room_user.code == 0) {
                                $.ajax({
                                    type: "get",
                                    url: "https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo",
                                    data: "id="+live_room_user.data.room_id,
                                    dataType: "json",
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    success: function (live_room_key) {
                                        if (live_room_key.code == 0) {
                                            $.ajax({
                                                type: "get",
                                                url: "https://api.bilibili.com/x/space/wbi/acc/info",
                                                data: wei_key({mid:live_room_user.data.uid}),
                                                dataType: "json",
                                                xhrFields: {
                                                    withCredentials: true
                                                },
                                                success: function (responseJSON) {
                                                    if (responseJSON.code == 0) {
                                                        window.location.replace("/live-room-barrage.html?"+encodeURIComponent("user_cover="+live_room_user.data.user_cover+"&mid="+live_room_user.data.uid+"&name="+responseJSON.data.name+"&face="+responseJSON.data.face+"&uid="+cookie_value("DedeUserID")+"&roomid="+live_room_user.data.room_id+"&protover=3&platform=web&type=2&key="+live_room_key.data.token))
                                                    } else {
                                                        alert("GET错误")
                                                    }
                                                }
                                            });
                                        } else {
                                            alert("GET错误")
                                        }
                                    }
                                });
                            } else {
                                alert("房间不存在")
                                $(".live-room-id").val("")
                            }
                        }
                    });
                } else {
                    alert("直播间号不合法")
                    $(".live-room-id").val("")
                }
            } else {
                alert("直播间号不能为空")
            }
        })
    })
}