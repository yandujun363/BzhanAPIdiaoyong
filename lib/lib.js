function cookie_to_json() {//cookie转json
    const cookie = document.cookie.split(";")
    let json = {}
    if (cookie[0] == "") {
        return json
    } else {
        for (let i of cookie) {
            if (i.split(/(?<=[^=])=(?=[^=])/g)[1] != undefined) {
                json[i.split(/(?<=[^=])=(?=[^=])/g)[0].trim()] = i.split(/(?<=[^=])=(?=[^=])/g)[1].trim()
            }
        }
    }
    return json
}

function cookie_value(cookie_name) {//获取指定coolie
    const cookie = cookie_to_json()
    if (cookie[cookie_name] != undefined) {
        return cookie[cookie_name]
    }
    return false
}

function url_parameters_to_json() {//url参数转json
    const url_parameter = decodeURI(window.location.search.replace("?","")).split("&")
    if (url_parameter != "") {
        let json = {}
        if (url_parameter[0] == "") {
            return json
        } else {
            for (let i of url_parameter) {
                if (i.split(/(?<=[^=])=(?=[^=])/g)[1] != undefined) {
                    json[i.split(/(?<=[^=])=(?=[^=])/g)[0].trim()] = i.split(/(?<=[^=])=(?=[^=])/g)[1].trim()
                }
            }
        }
        return json
    }
    return false
}

function url_parameters_value(url_parameters_name) {//获取指定url参数
    const url_parameters = url_parameters_to_json()
    if (url_parameters != false) {
        if (url_parameters[url_parameters_name] != undefined) {
            return url_parameters[url_parameters_name]
        }
    }
    return false
}

//======================
//wei签名
//https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/wbi.md
const mixinKeyEncTab = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
    33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
    61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
    36, 20, 34, 44, 52
]

// 对 imgKey 和 subKey 进行字符顺序打乱编码
const getMixinKey = (orig) => mixinKeyEncTab.map(n => orig[n]).join('').slice(0, 32)

// 为请求参数进行 wbi 签名
function encWbi(params, img_key, sub_key) {
    const mixin_key = getMixinKey(img_key + sub_key),
    curr_time = Math.round(Date.now() / 1000),
    chr_filter = /[!'()*]/g

    Object.assign(params, { wts: curr_time }) // 添加 wts 字段
    // 按照 key 重排参数
    const query = Object
        .keys(params)
        .sort()
        .map(key => {
        // 过滤 value 中的 "!'()*" 字符
        const value = params[key].toString().replace(chr_filter, '')
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        })
        .join('&')

    const wbi_sign = SparkMD5.hash(query + mixin_key) // 计算 w_rid

    return query + '&w_rid=' + wbi_sign
}

// 获取最新的 img_key 和 sub_key
function getWbiKeys() {
    const res = $.ajax({
        type: "get",
        url: "https://api.bilibili.com/x/web-interface/nav",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        async: false
    }).responseJSON
    const { data: { wbi_img: { img_url, sub_url } } } =   res

    return {
        img_key: img_url.slice(
            img_url.lastIndexOf('/') + 1,
            img_url.lastIndexOf('.')
        ),
        sub_key: sub_url.slice(
            sub_url.lastIndexOf('/') + 1,
            sub_url.lastIndexOf('.')
        )
    }
}

function wei_key(url_val) {
    const web_keys =   getWbiKeys()
    const params = url_val,
        img_key = web_keys.img_key,
        sub_key = web_keys.sub_key
    const query = encWbi(params, img_key, sub_key)
    return query
}
//=========================

//==============================
//获取用户信息
function user_data(mid) {
    const user_data = $.ajax({
        type: "get",
        url: "https://api.bilibili.com/x/space/wbi/acc/info",
        data: wei_key({mid: mid}),
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        async: false
    }).responseJSON
    return user_data
}
//==============================

//===============
//查询视频部分
let mid = "0"
let pn = "1"
let max_pn = "1"

function query_video(mid,pn) {
    const video_data = $.ajax({
        type: "get",
        url: "https://api.bilibili.com/x/space/wbi/arc/search",
        data: wei_key({mid: mid, pn: pn}),
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        async: false
    }).responseJSON
    return video_data
}

function format_video_data() {
    if (mid !="") {
        if (/^[0-9]{1,19}$/g.test(mid) == true) {
            if (mid == 0) {
                mid = cookie_value("DedeUserID")
            }
            const query_video_data = query_video(mid,pn)
            if (query_video_data.code != -400) {
                if (query_video_data.data.page.count != 0) {
                    max_pn = Math.ceil(query_video_data.data.page.count / 30)
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    $(".user_video").empty()
                    for (let i = 0; i < query_video_data.data.list.vlist.length; i++) {
                        const element = query_video_data.data.list.vlist[i];
                        $(".user_video").append("\
                            <a href=\"https://www.bilibili.com/video/"+element.bvid+"/\" title=\""+element.title+"\" target=\"_blank\">\
                                <img src=\""+element.pic.replace("http","https")+"\" alt=\""+element.title+"\">\
                                <div>\
                                    <h3>"+element.title+"</h3>\
                                    <p>"+element.description+"</p>\
                                    <p>"+new Date(element.created*1000).toLocaleDateString() + " " + new Date(element.created*1000).toTimeString().split(" ")[0]+"</p>\
                                </div>\
                            </a>\
                            ")
                    }
                    $(".page_number").css({
                        "display": "flex"
                    })
                    $(".max_pn").text("共 "+max_pn+" 页")
                } else {
                    alert("目标用户没有视频")
                    $(".mid").val("")
                }
            } else {
                alert("GET错误\n错误信息:"+query_video_data.message)
                $(".mid").val("")
            }
        } else {
            alert("UID不合法")
            $(".mid").val("");
        }
    } else {
        alert("UID不能为空")
    }
}
//============================

//==================================
//拉取弹幕部分
//https://www.bilibili.com/read/cv14101053/
var eventTarget = new EventTarget();

//事件注册
function on(eventType, callback){
    eventTarget.addEventListener(eventType, function(e){
        callback(e.detail);
    });
}

//生成认证数据
function getCertification(json){
    let encoder = new TextEncoder();    //编码器
    let jsonView = encoder.encode(json);    //utf-8编码
    let buff = new ArrayBuffer(jsonView.byteLength + 16);    //数据包总长度：16位头部长度+bytes长度
    let view = new DataView(buff);    //新建操作视窗
    view.setUint32(0, jsonView.byteLength + 16);    //整个数据包长度
    view.setUint16(4, 16);    //头部长度
    view.setUint16(6, 1);    //协议版本
    view.setUint32(8, 7);    //类型,7为加入房间认证
    view.setUint32(12, 1);    //填1
    for(let r = 0; r < jsonView.byteLength; r++){
        view.setUint8(16 + r, jsonView[r]);    //填入数据
    }
    return buff;
}

//处理服务器发送过来的数据，初步打包
/*打包格式（JSON）
键        值类型
Len        int
HeadLen     int
Ver        int
Type       int
Num        int
body       JSON（Type != 3）或者int（Type == 3）
*/
function handleMessage(blob, call){
    let reader = new FileReader();
    reader.onload = function(e){
        let buff = e.target.result;    //ArrayBuffer对象
        let decoder = new TextDecoder();    //解码器
        let view = new DataView(buff);    //视图
        let offset = 0;
        let packet = {};
        let result = [];
        while (offset < buff.byteLength){    //数据提取
            let packetLen = view.getUint32(offset + 0);
            let headLen = view.getUint16(offset + 4);
            let packetVer = view.getUint16(offset + 6);
            let packetType = view.getUint32(offset + 8);
            let num = view.getUint32(12);
            if (packetVer == 3){    //解压数据
                let brArray = new Uint8Array(buff, offset + headLen, packetLen - headLen);
                let BrotliDecode = makeBrotliDecode();    //生成Brotli格式解压工具的实例
                let buffFromBr = BrotliDecode(brArray);    //返回Int8Array视图
                let view = new DataView(buffFromBr.buffer);
                let offset_Ver3 = 0;
                while (offset_Ver3 < buffFromBr.byteLength){    //解压后数据提取
                    let packetLen = view.getUint32(offset_Ver3 + 0);
                    let headLen = view.getUint16(offset_Ver3 + 4);
                    let packetVer = view.getUint16(offset_Ver3 + 6);
                    let packetType = view.getUint32(offset_Ver3 + 8);
                    let num = view.getUint32(12);
                    packet.Len = packetLen;
                    packet.HeadLen = headLen;
                    packet.Ver = packetVer;
                    packet.Type = packetType;
                    packet.Num = num;
                    let dataArray = new Uint8Array(buffFromBr.buffer, offset_Ver3 + headLen, packetLen - headLen);
                    packet.body = decoder.decode(dataArray);    //utf-8格式数据解码，获得字符串
                    result.push(JSON.stringify(packet));    //数据打包后传入数组
                    offset_Ver3 += packetLen;
                }
            }else{
                packet.Len = packetLen;
                packet.HeadLen = headLen;
                packet.Ver = packetVer;
                packet.Type = packetType;
                packet.Num = num;
                let dataArray = new Uint8Array(buff, offset + headLen, packetLen - headLen);
                if (packetType == 3){    //获取人气值
                    packet.body = (new DataView(buff, offset + headLen, packetLen - headLen)).getUint32(0);    //若入参为dataArray.buffer，会返回整段buff的视图，而不是截取后的视图
                }else{
                    packet.body = decoder.decode(dataArray);    //utf-8格式数据解码，获得字符串
                }
                result.push(JSON.stringify(packet));    //数据打包后传入数组
            }
            offset += packetLen;
        }
        call(result);    //数据后续处理
    }
    reader.readAsArrayBuffer(blob);    //读取服务器传来的数据转换为ArrayBuffer
}

function webSocket(){
    if("WebSocket" in window){
        console.log("您的浏览器支持WebSocket");
        var timer;
        var ws = new WebSocket("wss://broadcastlv.chat.bilibili.com:443/sub");

        ws.onopen = function(e){
            console.log("open");
            let time_data = new Date()
            let time = time_data.toTimeString().split(" ")[0]+"</br>"+time_data.toLocaleDateString()
            let html = "\
            <div class=\"DANMU_MSG\">\
                <img class=\"face\" src=\"/img/akari.jpg\" onerror=\"this.src ='/img/akari.jpg'\" loading=\"lazy\" alt=\"\">\
                <div class=\"data\">\
                    <div class=\"user_data\">\
                        <p class=\"name\">系统</p>\
                        <p class=\"time\">"+time+"</p>\
                    </div>\
                    <p class=\"text\" style=\"background: #919298;\">连接中...</p>\
                </div>\
            </div>\
            "
            $(".弹幕事件").append(html);
            let live_room_key_data = url_parameters_to_json()
            let live_room_key = {
                "uid":cookie_value("DedeUserID"),
                "roomid":live_room_key_data.roomid,
                "protover":"3",
                "platform":"web",
                "type":"2",
                "key":live_room_key_data.key
            }
            var certification = JSON.stringify(live_room_key).replace(/((?<=[0-9])")|((?<=[^\\])"(?=[0-9]))/g,"")
            ws.send(getCertification(certification));
            console.log(certification)
            //发送心跳包
            timer = setTimeout(function heartbeat_pack(){
                let buff = new ArrayBuffer(16);
                let i = new DataView(buff);
                i.setUint32(0, 0);    //整个封包
                i.setUint16(4, 16);    //头部
                i.setUint16(6, 1);    //协议版本
                i.setUint32(8, 2);    //操作码,2为心跳包
                i.setUint32(12, 1);    //填1
                ws.send(buff);
                timer = setTimeout(heartbeat_pack,30000)
            }, 30000); //30秒

        }

        ws.onmessage = function(e){
            //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
            //console.log(e.data);
            let blob = e.data;
            handleMessage(blob, function(result){
                //触发事件
                for(let i=0; i<result.length; i++){
                    let json = JSON.parse(result[i]);
                    if (json.Type == 5){
                        let event = new CustomEvent(JSON.parse(json.body).cmd, {detail: JSON.parse(json.body)});
                        eventTarget.dispatchEvent(event);
                    }
                    if (json.Type == 8){
                        let event = new CustomEvent("Certify_Success", {detail: JSON.parse(json.body)});
                        eventTarget.dispatchEvent(event);
                    }
                    if (json.Type == 3){
                        let event = new CustomEvent("VIEW", {detail: json.body});
                        eventTarget.dispatchEvent(event);
                        
                    }
                }
            });
        }

        ws.onclose = function(e){
            //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
            console.log("close");
            let time_data = new Date()
            let time = time_data.toTimeString().split(" ")[0]+"</br>"+time_data.toLocaleDateString()
            let html = "\
            <div class=\"DANMU_MSG\">\
                <img class=\"face\" src=\"/img/akari.jpg\" onerror=\"this.src ='/img/akari.jpg'\" loading=\"lazy\" alt=\"\">\
                <div class=\"data\">\
                    <div class=\"user_data\">\
                        <p class=\"name\">系统</p>\
                        <p class=\"time\">"+time+"</p>\
                    </div>\
                    <p class=\"text\" style=\"background: #919298;\">连接关闭</p>\
                </div>\
            </div>\
            "
            $(".弹幕事件").append(html);
            if (timer != null){
                clearTimeout(timer);    //停止发送心跳包
            }
            setTimeout(webSocket,4000);    //4秒后重连
        }

        ws.onerror = function(e){
            //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
            console.log(e);
        }
    }else{
        console.log("您的浏览器不支持WebSocket");
    }
}
//===================