if (cookie_value("DedeUserID") == false) {
    alert("登录过期，请重新登录")
    window.location.replace("/login.html")
} else {
    $(function () {
        background_image()
        if (url_parameters_value("mid") !== false) {
            mid = url_parameters_value("mid")
            $(".mid").val(mid)
            format_video_data()
        }
        $(".search_bar").keydown(function(event){
            if (event.which == 13) {
                mid = $(".mid").val()
                format_video_data()
            }
        })
        $(".search").click(function () {
            mid = $(".mid").val()
            format_video_data()
        })
        $(".previous").click(function () { 
            if (pn <= 1) {
                alert("已经是第一页了")
            } else {
                pn --
                format_video_data()
            }
        })
        $(".next").click(function () { 
            if (pn >= max_pn) {
                alert("已经是最后一页了")
            } else {
                pn ++
                format_video_data()
            }
        })
    })
}