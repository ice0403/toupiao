Date.prototype.format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,           
        "d+": this.getDate(),          
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,      
        "H+": this.getHours(),           
        "m+": this.getMinutes(),           
        "s+": this.getSeconds(),           
        "q+": Math.floor((this.getMonth() + 3) / 3),         
        "S": this.getMilliseconds()         
    };
    var week = {
        "0": "u65e5",
        "1": "u4e00",
        "2": "u4e8c",
        "3": "u4e09",
        "4": "u56db",
        "5": "u4e94",
        "6": "u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "u661f/u671f" : "u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
window.shareData = {
    "imgUrl": "",
    "timeLineLink": "",
    "sendFriendLink": "",
    "weiboLink": "",
    "tTitle": "",
    "tContent": "",
    "fTitle": "",
    "fContent": "",
    "wContent": ""
}; 
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    if (window.shareData.hideBar)
        WeixinJSBridge.call('hideToolbar');
WeixinJSBridge.on('menu:share:appmessage', function (argv) {
    WeixinJSBridge.invoke('sendAppMessage', {
        "img_url": window.shareData.imgUrl,
        "img_width": "640",
        "img_height": "640",
        "link": window.shareData.sendFriendLink,
        "desc": window.shareData.fContent,
        "title": window.shareData.fTitle
    }, function (res) {
        if (window.shareData._report)
            window.shareData._report('send_msg', res);
    })
});
WeixinJSBridge.on('menu:share:timeline', function (argv) {
    WeixinJSBridge.invoke('shareTimeline', {
        "img_url": window.shareData.imgUrl,
        "img_width": "640",
        "img_height": "640",
        "link": window.shareData.timeLineLink,
        "desc": window.shareData.tContent,
        "title": window.shareData.tTitle
    }, function (res) {
        if (window.shareData._report)
            window.shareData._report('timeline', res);
    });
});
WeixinJSBridge.on('menu:share:weibo', function (argv) {
    WeixinJSBridge.invoke('shareWeibo', {
        "content": window.shareData.wContent,
        "url": window.shareData.weiboLink,
    }, function (res) {
        if (window.shareData._report)
            window.shareData._report('weibo', res);
    });
});
}, false);