if (cookie_value("DedeUserID") == false) {
    alert("登录过期，请重新登录")
    window.location.replace("/login.html")
} else {
    $(function () {
        if (mpegts.getFeatureList().mseLivePlayback) {
            let videoElement = document.getElementById("live_video");
            let player = mpegts.createPlayer({
                type: "flv",  // could also be mpegts, m2ts, flv
                isLive: true,
                url: BASE64.urlsafe_decode(url_parameters_value("live_video_url"))
            });
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
        }
    })
}