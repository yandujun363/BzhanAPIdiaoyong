if (cookie_value("DedeUserID") == false) {
    alert("登录过期，请重新登录")
    window.location.replace("/login.html")
} else {
    $(".content button").click(function () { 
        let roomid = $(".roomid").val();
        if (roomid != "") {
            if (/^[0-9]{1,}$/g.test(roomid) == true) {
                $.ajax({
                    type: "get",
                    url: "https://api.live.bilibili.com/room/v1/Room/get_info",
                    data: "room_id="+roomid,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (live_room_data) {
                        if (live_room_data.code == 0) {
                            $.ajax({
                                type: "get",
                                url: "https://api.bilibili.com/x/space/wbi/acc/info",
                                data: wei_key({"mid":live_room_data.data.uid}),
                                dataType: "json",
                                xhrFields: {
                                    withCredentials: true
                                },
                                success: function (live_user_data) {
                                    if (live_user_data.code == 0) {
                                        $.ajax({
                                            type: "get",
                                            url: "https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo",
                                            data: "id="+live_room_data.data.room_id,
                                            dataType: "json",
                                            success: function (live_room_key_data) {
                                                if (live_room_key_data.code == 0) {
                                                    window.location.href="/live-room-barrage.html?"+encodeURIComponent("name="+live_user_data.data.name+"&face="+live_user_data.data.face+"&user_cover="+live_room_data.data.user_cover+"&roomid="+roomid+"&key="+live_room_key_data.data.token)
                                                } else {
                                                    alert("线程\"live_room_key_data\"GET错误\n错误信息:"+live_room_key_data.message)
                                                    $(".roomid").val("");
                                                }
                                            }
                                        });
                                    } else {
                                        alert("线程\"live_user_data\"GET错误\n错误信息:"+live_user_data.message)
                                        $(".roomid").val("");
                                    }
                                }
                            });
                        } else {
                            alert("线程\"live_room_data\"GET错误\n错误信息:"+live_room_data.message)
                            $(".roomid").val("");
                        }
                    }
                });
            } else {
                alert("房间号不合法")
                $(".roomid").val("");
            }
        } else {
            alert("直播间号不能为空")
        }
    });
}