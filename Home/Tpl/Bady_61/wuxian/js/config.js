var serverroot = "../";
var SITEURL = "../../www.stonepoll.net";
var QRCODELENGTH = 5;


captchtimernow = captchtimermax;
captchwaiting = true;
captchtimerhandle = null;
function subcaptchtimer()
{
	captchtimernow = captchtimernow -1;
	if(captchtimernow > 0)
	{
		captchtimernowstr = captchtimernow>9?captchtimernow:("0"+captchtimernow);
		$("#captchtimer").html("00:"+captchtimernowstr);
	}
	else
	{
		clearInterval(captchtimerhandle);
		$(".codeTimer").hide();
		
		
		$("#captcha").attr("src","/plugin/securimage/securimage_show.php?"+Math.random());
		//$("#captcha").show();
		$("#captchaloading").show();
			
		
		
	}
	
	
}

function checkGeeTestCode()
{
	_geetst_c = $(".geetest_challenge").val();
	
	if(_geetst_c == "")
	{
		
		return false;
	}
	
	return true;
}

function doshowCaptchacode()
{
	$("#captcha").hide();
	$("#captchaloading").hide();
	captchtimerhandle = setInterval("subcaptchtimer()",1000);
	
}
function reShowCaptchacode()
{
	captchtimernow = captchtimermax;
	
	$("#captcha").hide();
	$("#captchaloading").hide();
	$(".codeTimer").show();
	doshowCaptchacode();
}
function captchaImgLoad()
{
	$("#captcha").show();
	$("#captchaloading").hide();
	captchwaiting = false;
}

function isdigit(s)
{
 //alert(s);
	if(s == "")
		return false;
	var r,re;
	re = /\d*/i; 
	r = s.match(re);
	return (r==s)?true:false;
}

function randStr()
{
	var rand = Math.random();
	return rand.toString().substring(2,10);
}


function showFormError(divid,msg)
{
	$(divid).addClass("error");
	if($(divid+" .help-inline").is("span"))
		$(divid+" .help-inline").html(msg);
	if($(divid+" .help-block").is("span"))
		$(divid+" .help-block").html(msg);
}
function clearFormError()
{
	$(".control-group").each(function(){
		
		$(this).removeClass("error");
		if($(this).find(".help-inline"))
		{
			$(this).find(".help-inline").html("");
		}
		if($(this).find(".help-block"))
		{
			$(this).find(".help-block").html("");
		}
		
	})
	
	$("li.error").each(function(){
		$(this).removeClass("error");
	})
}

function submitalertonform(divid,msg)
{
	clearFormError();
	showFormError(divid,decodeURIComponent(msg));
	
	if($("#captcha").is("img"))
	{
		$("#inputCaptchacode").val("");
		//document.getElementById('captcha').src = '/plugin/securimage/securimage_show.php?' + Math.random();
		reShowCaptchacode();
	}
	
	if($("#geetestdiv").is("div"))
	{
		$("#geetestdiv .controls").html("<script type='text/javascript' src='../../api.geetest.com/get.php@gt=b6f922650c871f9640ac7e2bd4afeea7&product=embed'></script>");
	}
}
function hidealert()
{
	$("#submitalertdiv h4").html("");
	$("#submitalertdiv span").html("");
	$("#submitalertdiv").hide();
}
function submitalertAppend(msg,csstype)
{
	
	if($("#submitalertdiv").css("display")!="none" )
	{
		
		$("#submitalertdiv span").append(" "+decodeURIComponent(msg));
	}
	else
	{
		submitalert("",msg,csstype);
	}
}

function submitalertnoclearformerror(title,msg,csstype)
{
	
	
	
	_alertclass = "alert-success";
	if(csstype == 'error')
	{
		_alertclass = "alert-error";
	}
	if(csstype == 'warning')
	{
		_alertclass = "alert-warning";
	}
	$("#submitalertdiv h4").html(title);
	$("#submitalertdiv span").html(decodeURIComponent(msg));
	$("#submitalertdiv").attr("class","alert "+_alertclass);
	$("#submitalertdiv").show();
	
	if($("#submitalertdiv_above").is("div"))
	{
		$("#submitalertdiv_above h4").html(title);
		$("#submitalertdiv_above span").html(decodeURIComponent(msg));
		$("#submitalertdiv_above").attr("class","alert "+_alertclass);
		$("#submitalertdiv_above").show();
	}
	
	
	showDoCreateBtn();
}
function submitalert(title,msg,csstype)
{
	
	
	clearFormError();
	submitalertnoclearformerror(title,msg,csstype);
}
function jumpUrl(url)
{
	
	setTimeout("window.location.href = '"+url+"'",1000);
	;
}
function submitalertAndJump(title,msg,csstype,url)
{
	clearFormError();
	_alertclass = "alert-success";
	if(csstype == 'error')
	{
		_alertclass = "alert-error";
	}
	if(csstype == 'warning')
	{
		_alertclass = "alert-warning";
	}
	$("#submitalertdiv h4").html(title);
	$("#submitalertdiv span").html(decodeURIComponent(msg) + "<BR /> 正在跳转......");
	$("#submitalertdiv").attr("class","alert "+_alertclass);
	$("#submitalertdiv").show();
	
	if($("#submitalertdiv_above").is("div"))
	{
		$("#submitalertdiv_above h4").html(title);
		$("#submitalertdiv_above span").html(decodeURIComponent(msg) + "<BR /> 正在跳转......");
		$("#submitalertdiv_above").attr("class","alert "+_alertclass);
		$("#submitalertdiv_above").show();
	}
	
	
	jumpUrl(url);
	
	
}
function checkEmail(email)
{
	/*
	 var re = /^((\.|\d|[a-z]|[A-Z])(((\d|[a-z]|[A-Z]|\_){1,19})))@((((\d|[a-z]|[A-Z]){1,10})\.){1,4})(((\d|[a-z]|[A-Z])){2,10})$/;
	 if(re.test(email))
	  return true;
	 else
	  return false;
	*/
	
	p = /^([\w\.-]+)@([a-zA-Z0-9-]+)(\.[a-zA-Z\.]+)$/; 
	if(email.search(p) == -1)
	{ 
		return false; 
	}
	else
	{ 
		return true; 
	} 
}