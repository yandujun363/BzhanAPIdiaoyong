$(function (){
    function user_data(e) {
        const user_data = $.ajax({
            type: "get",
            url: "https://api.bilibili.com/x/space/wbi/acc/info",
            data: wei_key(e),
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            async: false
        }).responseJSON
        return user_data
    }
    let cs = user_data({mid: cookie_value("DedeUserID")})
    if (cs.code == -352) {
        lift_risk_control(cs.data.v_voucher)
    }
})