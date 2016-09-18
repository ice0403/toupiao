/* SVN.committedRevision=1113843 */
$(function() {
	var b = $(".signUp_method .byPhone"),
		c = $(".signUp_method .byMail"),
		a = $(".byPhone_main"),
		e = $(".byMail_main"),
		d = 0;
	b.on("click", function(f) {
		if (d == 1) {
			refresh_valid_code("phone_valid_code_pic");
			a.show();
			b.addClass("selected");
			e.hide();
			c.removeClass("selected");
			d = 0
		}
	});
	c.on("click", function(f) {
		if (d == 0) {
			refresh_valid_code("email_valid_code_pic");
			e.show();
			c.addClass("selected");
			a.hide();
			b.removeClass("selected");
			d = 1
		}
	})
});
$("#email").keyup(function() {
	$("#myemail").show();
	var d = $("#email").val();
	if (d != "" || d != null) {
		var e = "";
		var b = new Array("@163.com", "@qq.com", "@126.com", "@hotmail.com", "@gmail.com", "@sohu.com", "@139.com", "@sina.com.cn", "@vip.sina.com", "@msn.com");
		totalid = b.length;
		if (!(isEmail(d))) {
			for (var c = 0; c < b.length; c++) {
				e = e + "<li id='email_think'><span>";
				e = e + d + "</span>" + b[c] + "</li>"
			}
		} else {
			emailbefor = d.split("@")[0];
			emailafter = "@" + d.split("@")[1];
			for (var c = 0; c < b.length; c++) {
				var a = b[c];
				if (a.indexOf(emailafter) == 0) {
					e = e + "<li id='email_think'><span>";
					e = e + emailbefor + "</span>" + b[c] + "</li>"
				}
			}
		}
		$("#myemail").html(e);
		if ($("#myemail").html()) {
			$("#myemail").css("display", "block");
			can1press = true
		} else {
			$("#myemail").css("display", "none");
			can1press = false
		}
		beforepress = d
	}
	if (d == "" || d == null) {
		$("#myemail").html("");
		$("#myemail").css("display", "none")
	}
});
$(document).click(function() {
	$("#myemail").hide()
});

function isEmail(a) {
	if (a.indexOf("@") > 0) {
		return true
	} else {
		return false
	}
}
$("#email_think").live("click", function() {
	var a = $("#email").val().replace(/@.*$/g, "") + "@" + $(this).html().replace(/^.*@/g, "");
	$("#email").val(a);
	$("#myemail").hide();
	$("#email_tips").hide()
});

function refresh_valid_code(c) {
	var b = $("#" + c);
	var a = URLPrefix.validCodeShowUrl;
	if (b) {
		b.attr("src", a + "?t=" + Math.random())
	}
}
var commonSymbol = "[\\,\\`\\~\\!\\@\\#\\$\\%\\\\^\\&\\*\\(\\)\\-\\_\\=\\+\\[\\{\\]\\}\\\\|\\;\\:\\��\\��\\��\\��\\<\\>\\/?]+";

function isSameWord(d) {
	var b;
	if (d != null && d != "") {
		b = d.charCodeAt(0);
		b = "\\" + b.toString(8);
		var a = "[" + b + "]{" + (d.length) + "}";
		var c = new RegExp(a);
		return c.test(d)
	}
	return true
}

function check_pwd1(g) {
	var h = $("#" + g + "_password").val();
	if (h == "") {
		return 1
	}
	if (h.length > 20) {
		return 2
	}
	if (h.length < 6) {
		return 3
	}
	var f = /\s+/;
	if (f.test(h)) {
		return 4
	}
	var a = /^[0-9]+$/;
	if (a.test(h)) {
		return 5
	}
	var b = /^[a-zA-Z]+$/;
	if (b.test(h)) {
		return 6
	}
	var i = /^[^0-9A-Za-z]+$/;
	if (i.test(h)) {
		return 7
	}
	if (isSameWord(h)) {
		return 8
	}
	var e = "d*" + commonSymbol + "";
	var d = "\\\d+[A-Za-z]|[A-Za-z]+[0-9]+|[A-Za-z]+" + commonSymbol + "[0-9]+|[A-Za-z]+[0-9]+" + commonSymbol + "|" + e + "";
	var c = new RegExp(d);
	if (!c.test(h)) {
		return 10
	}
	return 0
}

function checkPwd(a) {
	var b = check_pwd1(a);
	if (b == 1) {
		$("#" + a + "_error").text("���벻��Ϊ��");
		$("#" + a + "_tips").show();
		return false
	}
	if (b == 2) {
		$("#" + a + "_error").text("����Ϊ6-20λ�ַ�");
		$("#" + a + "_tips").show();
		return false
	}
	if (b == 3) {
		$("#" + a + "_error").text("����Ϊ6-20λ�ַ�");
		$("#" + a + "_tips").show();
		return false
	}
	if (b == 4) {
		$("#" + a + "_error").text("�����в������пո�");
		$("#" + a + "_tips").show();
		return false
	}
	if (b == 5) {
		$("#" + a + "_error").text("���벻��ȫΪ����");
		$("#" + a + "_tips").show();
		return false
	}
	if (b == 6) {
		$("#" + a + "_error").text("���벻��ȫΪ��ĸ�����������1�����ֻ����");
		$("#" + a + "_tips").show();
		return false
	}
	if (b == 7) {
		$("#" + a + "_error").text("���벻��ȫΪ����");
		$("#" + a + "_tips").show();
		return false
	}
	if (b == 8) {
		$("#" + a + "_error").text("���벻��ȫΪ��ͬ�ַ�������");
		$("#" + a + "_tips").show();
		return false
	}
	return true
}

function check_email(b) {
	var a = $("#" + b).val();
	if (a == "") {
		$("#" + b + "_error").text("���䲻��Ϊ��");
		$("#" + b + "_tips").show();
		return false
	}
	var c = /^\w[\w\$\^\(\)\[\]\{\}\.\-\+,]{0,100}@([a-zA-Z0-9][\w\-]*\.)+[a-zA-Z]{2,6}$/;
	if (!c.test(a)) {
		$("#" + b + "_error").text("��ʽ������������ȷ������");
		$("#" + b + "_tips").show();
		return false
	}
	if (a.length > 100) {
		$("#" + b + "_error").text("���䳤�Ȳ��ܳ���100λ�ַ�");
		$("#" + b + "_tips").show();
		return false
	}
	if ((/@yahoo.cn$\b/).test(a.toLowerCase()) || (/@yahoo.com.cn$\b/).test(a.toLowerCase())) {
		$("#" + b + "_error").text("�Ż��й�������ͣ�ã����������ע��");
		$("#" + b + "_tips").show();
		return false
	}
	return true
}

function check_phone(b) {
	var a = $("#" + b).val();
	if (a == "") {
		$("#" + b + "_error").html("����Ϊ��");
		$("#" + b + "_tips").show();
		return false
	}
	var c = /^1\d{10}$/;
	if (!c.test(a)) {
		$("#" + b + "_error").html("��ʽ������������ȷ���ֻ�����");
		$("#" + b + "_tips").show();
		return false
	}
	return true
}

function receiveCodeByPhone() {
	if ($("#receive_code").hasClass("_disable")) {
		return false
	}
	var c = true;

	var postData={
		"mobile":$("#phone").text(),
	}
	var url = "/PhpDataBridge/databridge-company.php?fun=register_sms&datatype=js";
	$.ajax({
		type:"get",
		url:url,
		data:postData,
		datatype : "json",
		async : false,//ȡ���첽
		success:function(response){
			if(response == 0 || response == 14) {
				//window.location = '/loginuser.php?part=registerMobile&mobile='+$("#phone").val();
			}
			else{
				refresh_valid_code("phone_valid_code_pic");
				if(response == 16){
					$("#valid_mobile_code_error").html("���ֻ����Ѵ��ڣ�<a href='/loginuser.php'>��¼</a>");
					$("#valid_mobile_code_tips").show();
				} else if(response == 13){
					$("#valid_mobile_code_error").html("ϵͳ�쳣");
					$("#valid_mobile_code_tips").show();
				}
				else if(response == 20){
					$("#valid_mobile_code_error").html("��Сʱ�������»�ȡ��֤�룡");
					$("#valid_mobile_code_tips").show();
				}
			}
		}
	});

	if (c) {
		//return
	}
	$("#receive_code").removeClass("_active");
	$("#receive_code").addClass("_disable").html('��ȡ��֤��<br><span id="closeTime">59</span>��');
	var d = $("#closeTime").text();
	var b = setInterval(function() {
		if (d > 0) {
			d--;
			$("#closeTime").text(d)
		}
	}, 1000);
	var a = setTimeout(function() {
		$("#receive_code").removeClass("_disable").html("���»�ȡ��֤��");
		$("#receive_code").addClass("_active")
	}, d * 1000);
	return false
}

function showOff(a) {
	$("#" + a + "_tips").hide()
};