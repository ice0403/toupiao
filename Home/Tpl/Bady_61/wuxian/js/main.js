try{
	if(!window.localStorage && /MSIE/.test(navigator.userAgent)){ 
	    if(!window.UserData) { 
	        window.UserData = function(file_name) { 
	            if(!file_name) file_name="user_data_default"; 
	            var dom = document.createElement('input'); 
	            dom.type = "hidden"; 
	            dom.addBehavior ("#default#userData"); 
	            document.body.appendChild(dom); 
	            dom.save(file_name); 
	            this.file_name = file_name; 
	            this.dom = dom; 
	            return this; 
	        };
	
	        window.UserData.prototype = { 
	            setItem:function(k, v) 
	            { 
	                this.dom.setAttribute(k,v); 
	                this.dom.save(this.file_name); 
	            }, 
	            getItem:function(k){ 
	                this.dom.load(this.file_name); 
	                return this.dom.getAttribute(k); 
	            },
	            removeItem:function(k){ 
	                this.dom.removeAttribute(k); 
	                this.dom.save(this.file_name); 
	            },
	            clear:function(){
	               this.dom.load(this.file_name); 
	               var now = new Date();
	               now = new Date(now.getTime()-1);
	               this.dom.expires = now.toUTCString();
	               this.dom.save(this.file_name);
				}
	        };
	    };
	    window.localStorage= new window.UserData("local_storage"); 
	}
	
}
catch(err)
{
	
	//alert(err.description)
}



function getByHash(thehash)
{
	try
	{
		
		return localStorage.getItem("hash_"+thehash);
	}
	catch(err)
	{
		return false;
	}
}
function setByHash(key,val)
{
	try
	{
		
		return localStorage.setItem("hash_"+key,val);
	}
	catch(err)
	{
		return false;
	}
}
function checkWxContenCreateForm()
{
	_title = $("#inputTitle").val();
	if(_title == "")
	{
		showFormError("#inputTitleDiv",langs['newwxcontentnodeholder']);
	    return false;
	}
	submitalert("",langs.votesaveing,"warning");
	return true;
}
function checkWxmpConfigForm()
{
	
	_wxname = $("#inputWxname").val();
	if(_wxname == "")
	{
		showFormError("#inputWxnameDiv",langs['wxmpnameinputholder']);
	    return false;
	}
	
	
	
	_wxappid = $("#inputWxappid").val();
	if(_wxappid == "")
	{
		showFormError("#inputWxappidDiv",langs['wxmpappidinputholder']);
	    return false;
	}
	
	_wxappsecret = $("#inputWxappsecret").val();
	if(_wxappsecret == "")
	{
		showFormError("#inputWxappsecretDiv",langs['wxmpsecretinputholder']);
	    return false;
	}
	
	
	_wxqrcode = $("#inputWxname").val();
	if(_wxqrcode == "")
	{
		showFormError("#inputWxqrcodeDiv",langs['wxmpqrcodeinputholder']);
	    return false;
	}
	
	/*
	_wxfollowurl = $("#inputWxfollowurl").val();
	if(_wxfollowurl == "")
	{
		showFormError("#inputWxfollowurlDiv",langs['wxmpfollowurlinputholder']);
	    return false;
	}
	if(_wxfollowurl.indexOf("http://") < 0 || _wxfollowurl.indexOf("mp.weixin.qq.com") < 0 )
	{
		showFormError("#inputWxfollowurlDiv","“引导关注文章网址”错误，请查看==> <a href=../../https@stonepoll.kf5.com/hc/kb/article/81126/default.htm target=_blank >怎样创建引导关注文章？</a>");
	    return false;
	}
	*/
	submitalert("",langs.votesaveing,"warning");
	return true;
}
function checkFooterTextForm()
{
	_text = $("#footertextInput").val();
	if(_text == "")
	{
		showFormError("#footertextInputDiv",langs['footertextemptyerror']);
	    return false;
	}
	if(_text.length > 100)
	{
		showFormError("#footertextInputDiv",langs['footertextinputhelp']);
		return false;
	}
	
	
	retbool = true;
	
	if($(".wxshowbottombtns").length > 0)
	{
		$(".wxshowbottombtns").each(function(){
			
			
			if($(this).prop("checked"))
			{
				_val = $(this).val();
				
				
				if(_val == "free0")
				{
					_addval1 = $("input[name=btnfreename0]").val();
					_addval2 = $("input[name=btnfreeurl0]").val();
					
					if(_addval1== "" || _addval2== "")
					{
						
						//showFormError("#bottombtnsInputDiv","请输入所选择的自定义按钮的名称和链接");
						
						submitalert("","请输入所选择的自定义按钮的名称和链接","error");
						retbool = false;
					}
					else
					{
						if(_addval2.indexOf("http://")<0 && _addval2.indexOf("../../https@")<0)
						{
							submitalert("","请检查自定义按钮链接地址的格式","error");
							retbool = false;
						}
					}
				}
				if(_val == "free1")
				{
					_addval1 = $("input[name=btnfreename1]").val();
					_addval2 = $("input[name=btnfreeurl1]").val();
					
					if(_addval1== "" || _addval2== "")
					{
						
						//showFormError("#bottombtnsInputDiv","请输入所选择的自定义按钮的名称和链接");
						
						submitalert("","请输入所选择的自定义按钮的名称和链接","error");
						retbool = false;
					}
					else
					{
						if(_addval2.indexOf("http://")<0 && _addval2.indexOf("../../https@")<0)
						{
							submitalert("","请检查自定义按钮链接地址的格式","error");
							retbool = false;
						}
					}
				}
				if(_val == "free2")
				{
					_addval1 = $("input[name=btnfreename2]").val();
					_addval2 = $("input[name=btnfreeurl2]").val();
					
					if(_addval1== "" || _addval2== "")
					{
						retbool = false;
						//showFormError("#bottombtnsInputDiv","请输入所选择的自定义按钮的名称和链接");
						submitalert("","请输入所选择的自定义按钮的名称和链接","error");
					}
					else
					{
						if(_addval2.indexOf("http://")<0 && _addval2.indexOf("../../https@")<0)
						{
							submitalert("","请检查自定义按钮链接地址的格式","error");
							retbool = false;
						}
					}
				}
				if(_val == "free3")
				{
					_addval1 = $("input[name=btnfreename3]").val();
					_addval2 = $("input[name=btnfreeurl3]").val();
					
					if(_addval1== "" || _addval2== "")
					{
						retbool = false;
						//showFormError("#bottombtnsInputDiv","请输入所选择的自定义按钮的名称和链接");
						submitalert("","请输入所选择的自定义按钮的名称和链接","error");
					}
					else
					{
						if(_addval2.indexOf("http://")<0 && _addval2.indexOf("../../https@")<0)
						{
							submitalert("","请检查自定义按钮链接地址的格式","error");
							retbool = false;
						}
					}
				}
			}
			
		})
		
		if(!retbool)
		{
			return false;
		}
	}
	
	//return false;
	submitalert("",langs.votesaveing,"warning");
	
	return true;
}

function checkLoginFromQQForm()
{
	
	_email = $("#inputEmail").val();
	
	if(_email == "")
	{
		showFormError("#inputEmailDiv",langs['needemail']);
	    return false;
	}
	
	if(!checkEmail(_email))
    {
		showFormError("#inputEmailDiv",langs['notemail']);
        return false;
    }
	
	_nickname = $("#inputNickname").val();
	
	
	if(_nickname == "")
	{
		showFormError("#inputNicknameDiv",langs['nicknameholder']);
	    return false;
	}
	if(_nickname.length<3 || _nickname.length>15)
	{
		showFormError("#inputNicknameDiv",langs['nicknameholder']);
	    return false;
	}
	
	return true;
}

function checkForgetForm()
{
	clearFormError();
	_email = $("#inputEmail").val();
	
	if(_email == "")
	{
		showFormError("#inputEmailDiv",langs['needemail']);
	    return false;
	}
	if(!checkEmail(_email))
    {
		showFormError("#inputEmailDiv",langs['notemail']);
        return false;
    }
	_vdcode = $("#inputCaptchacode").val();
	if(_vdcode == "")
	{
		showFormError("#inputCaptchacodeDiv",langs['captchacodeholder']);
	    return false;
	}
	submitalert("",langs.doingwarning,"warning");
	return true;
}
function checkResetPWDForm()
{
	_passwd = $("#inputPasswd").val();
	if(_passwd == "")
	{
		showFormError("#inputPasswdDiv",langs['passwordholder']);
	    return false;
	}
	
	_repasswd = $("#inputREPasswd").val();
	if(_repasswd == "")
	{
		showFormError("#inputREPasswdDiv",langs['repasswordholder']);
	    return false;
	}
	
	if(_passwd != _repasswd)
	{
		showFormError("#inputPasswdDiv",langs['passwordnotequal']);
		showFormError("#inputREPasswdDiv",langs['passwordnotequal']);
		return false;
	}
	_vdcode = $("#inputCaptchacode").val();
	if(_vdcode == "")
	{
		showFormError("#inputCaptchacodeDiv",langs['captchacodeholder']);
	    return false;
	}
	submitalert("",langs.doingwarning,"warning");
	return true;
}
function checkRegForm()
{
	clearFormError();
	
	_email = $("#inputEmail").val();
	
	if(_email == "")
	{
		showFormError("#inputEmailDiv",langs['needemail']);
	    return false;
	}
	
	if(!checkEmail(_email))
    {
		showFormError("#inputEmailDiv",langs['notemail']);
        return false;
    }
	
	_nickname = $("#inputNickname").val();
	if(_nickname == "")
	{
		showFormError("#inputNicknameDiv",langs['nicknameholder']);
	    return false;
	}
	if(_nickname.length<3 || _nickname.length>15)
	{
		showFormError("#inputNicknameDiv",langs['nicknameholder']);
	    return false;
	}
	_passwd = $("#inputPasswd").val();
	if(_passwd == "")
	{
		showFormError("#inputPasswdDiv",langs['passwordholder']);
	    return false;
	}
	
	_repasswd = $("#inputREPasswd").val();
	if(_repasswd == "")
	{
		showFormError("#inputREPasswdDiv",langs['repasswordholder']);
	    return false;
	}
	
	_username = $("#inputUsername").val();
	if(_username == "")
	{
		showFormError("#inputUsernameDiv",langs['usernamehelp']);
	    return false;
	}
	_qq = $("#inputQQ").val();
	if(_qq == "")
	{
		showFormError("#inputQQDiv",langs['qqhelp']);
	    return false;
	}
	
	_mobile = $("#inputMobile").val();
	if(_mobile == "")
	{
		showFormError("#inputMobileDiv",langs['mobilehelp']);
	    return false;
	}
	
	if(_passwd != _repasswd)
	{
		showFormError("#inputPasswdDiv",langs['passwordnotequal']);
		showFormError("#inputREPasswdDiv",langs['passwordnotequal']);
		return false;
	}
	_vdcode = $("#inputCaptchacode").val();
	if(_vdcode == "")
	{
		showFormError("#inputCaptchacodeDiv",langs['captchacodeholder']);
	    return false;
	}
	
	if($("input[name=inputagree]:checked").length==0)
	{
		showFormError("#inputAgreeDiv","请阅读并同意此条款");
		submitalertnoclearformerror("","请阅读并同意《磐石投票服务条款》","error");
		
		return false;
	}
	
	submitalert("",langs.reging,"warning");
	return true;
}


function checkLoginForm()
{
	clearFormError();
	
	_email = $("#inputEmail").val();
	
	if(_email == "")
	{
		showFormError("#inputEmailDiv",langs['needemail']);
	    return false;
	}
	
	if(!checkEmail(_email))
    {
		showFormError("#inputEmailDiv",langs['notemail']);
        return false;
    }
	
	_passwd = $("#inputPasswd").val();
	if(_passwd == "")
	{
		showFormError("#inputPasswdDiv",langs['passwordholder']);
	    return false;
	}
	
	if(TESTCODEMODE == 0)
	{
		_vdcode = $("#inputCaptchacode").val();
		if(_vdcode == "")
		{
			showFormError("#inputCaptchacodeDiv",langs['captchacodeholder']);
		    return false;
		}
	}
	
	if(TESTCODEMODE == 1)
	{
		
		if(!checkGeeTestCode())
		{
			//showFormError("#inputCaptchacodeDiv","请滑动滑块完成验证");
			
			submitalert("","请滑动滑块完成验证","error");
		    return false;
		}
	}
	
	
	
	submitalert("",langs.logining,"warning");
	
	return true;
}
function showDoCreateBtn()
{
	if($("#docreatevote").is("button"))
		$("#docreatevote").show();
}
function checkCreateVoteForm()
{
	_title = $("#inputTitle").val();
	
	$("#docreatevote").hide();
	
	if(_title == "")
	{
		showFormError("#inputTitleDiv",langs.formvotetitleholder);
		submitalertnoclearformerror("",langs.formvotetitleholder,"error");
		
	    return false;
	}
	
	_vopnum = 0;
	
	$("input.voteoptions").each(function(){
		
		if($(this).val() != "")
		{
			_vopnum +=1;
		}
		
	})
	
	if(_vopnum <2)
	{
		submitalert("",langs.formvoteoptionnumerror,"error");
		
		return false;
	}
	
	_maxsel = $("#inputMaxsel").val();
	_maxsel = parseInt(_maxsel);
	
	if(_maxsel >= _vopnum || _maxsel == 1)
	{
		
		showFormError("#inputMaxselDiv",langs.formmaxselectionerror);
		submitalertnoclearformerror("",langs.formmaxselectionerror,"error");
		return false;
	}
	
	if($("input[name=inputagree]:checked").length==0)
	{
		showFormError("#inputAgreeDiv",langs.formvoteagreenotcheck);
		submitalertnoclearformerror("",langs.formvoteagreenotcheck,"error");
		
		return false;
	}
	
	
	submitalert("",langs.votesaveing,"warning");
	
	return true;
}

function checkCreateVoteFormByStep()
{
	_title = $("#inputTitle").val();
	
	$("#docreatevote").hide();
	
	if(_title == "")
	{
		showFormError("#inputTitleDiv",langs.formvotetitleholder);
		submitalertnoclearformerror("",langs.formvotetitleholder,"error");
		
	    return false;
	}
	
	
	
	
	
	if($("input[name=inputagree]:checked").length==0)
	{
		showFormError("#inputAgreeDiv",langs.formvoteagreenotcheck);
		submitalertnoclearformerror("",langs.formvoteagreenotcheck,"error");
		
		return false;
	}
	
	
	submitalert("",langs.votesaveing,"warning");
	
	return true;
}
function checkEditVoteForm()
{
	_title = $("#inputTitle").val();
	
	$("#docreatevote").hide();
	
	if(_title == "")
	{
		showFormError("#inputTitleDiv",langs.formvotetitleholder);
		submitalertnoclearformerror("",langs.formvotetitleholder,"error");
		
	    return false;
	}
	
	_vopnum = 0;
	
	$("input.voteoptions").each(function(){
		
		if($(this).val() != "")
		{
			_vopnum +=1;
		}
		
	})
	
	if(_vopnum <2)
	{
		submitalert("",langs.formvoteoptionnumerror,"error");
		
		return false;
	}
	
	
	
	_maxsel = $("#inputMaxsel").val();
	_maxsel = parseInt(_maxsel);
	
	
	
	if(_maxsel >= _vopnum || _maxsel == 1)
	{
		
		showFormError("#inputMaxselDiv",langs.formmaxselectionerror);
		submitalertnoclearformerror("",langs.formmaxselectionerror,"error");
		return false;
	}
	
	if($("input[name=inputagree]:checked").length==0)
	{
		showFormError("#inputAgreeDiv",langs.formvoteagreenotcheck);
		submitalertnoclearformerror("",langs.formvoteagreenotcheck,"error");
		
		return false;
	}
	
	
	submitalert("",langs.votesaveing,"warning");
	
	return true;
}
function initEditOptionImage()
{
	if($(".editvotesubmitbtn").is("button"))
	{
		$(".editoppic a").unbind("click");
		
		$(".editoppic a").click(function(){
			
			if($(this).parent().parent().find(".opimageid").val().length == 36)
			{
				//$(this).jAlert(,"warning");
				
				jAlert(langs.onlyaddoneimage2option,langs.alert);
				
				
				return false;
			}
			else
			{
				
			}
			
			
		})
		
		$(".deloppic").unbind("click");
		$(".editoppic a").each(function(){
		
			_opnum = $(this).parent().parent().find(".add-on-num").html();
			
			_opid = $(this).parent().parent().find(".voteoptions").attr("name");
			
			
			//alert(_opnum);
			//alert("addpic");
			
			$(this).attr("href","../action/pop_uploadoptionimagenew.html@id="+_opnum+"&opid="+_opid);
			
			
			
		})
		$(".deloppic").click(function(){
			
			
			
			_clk = $(this);
			
			_delimgid = _clk.parent().parent().find(".opimageid").val();
			
			$.post(serverroot+"op.php", {action:"deleteresource",guid:_delimgid},function(json){
		         
		         if(json.ret == 1)
		         {
		         	
		        	 _clk.parent().parent().find(".oppicmodify").hide();
		        	 _clk.parent().parent().find(".opimageid").val(0);
		        	 _clk.parent().parent().find(".oppicaddspan").show();
		         }
		         else
		         {
		        	// _clk.jAlert(json.retinfo.errormsg,"warning");
		         }
		       
		   
		  },"json");

		})
		
	}
}

function initAddOptionImage()
{
	if($("#addvoteoptionwhenedit").is("button") || $("#addvoteoption").is("button"))
	{
		$(".addoppic a").unbind("click");
		$(".addoppic a").click(function(){
			
			if($(this).parent().parent().find(".opimageid").val().length == 36)
			{
				//$(this).jAlert(,"warning");
				
				jAlert(langs.onlyaddoneimage2option,langs.alert);
				
				
				return false;
			}
			
		})
		$(".deloppic").unbind("click");
		$(".addoppic a").each(function(){
		
			_opnum = $(this).parent().parent().find(".add-on-num").html();
			
			
			
			//alert(_opnum);
			//alert("addpic");
			
			$(this).attr("href","../action/pop_uploadoptionimage.html@id="+_opnum);
			
			
			
		})
		$(".deloppic").click(function(){
			
			
			
			_clk = $(this);
			
			_delimgid = _clk.parent().parent().find(".opimageid").val();
			
			$.post(serverroot+"op.php", {action:"deleteresource",guid:_delimgid},function(json){
		         
		         if(json.ret == 1)
		         {
		         	
		        	 _clk.parent().parent().find(".oppicmodify").hide();
		        	 _clk.parent().parent().find(".opimageid").val(0);
		        	 _clk.parent().parent().find(".oppicaddspan").show();
		         }
		         else
		         {
		        	// _clk.jAlert(json.retinfo.errormsg,"warning");
		         }
		       
		   
		  },"json");

		})
	}
}

function doZoomOPImg(_this)
{
	
	if(_this.parent().find(".imgzoomicon").is("div"))
	{
		return ;
	}
	
	_opimgwidth = _this.width();
	
	//_this.parent().append("<div class='imgzoomicon' style='left:0;top:0' ></div>");
	
	
	if(_opimgwidth >= 600 )
	{
		_this.css({"width":"600px"});
		_opimgwidth = 600;
		
		_x = _opimgwidth-50;
		_y = 10;
		
		_this.parent().append("<div class='imgzoomicon' style='left:"+_x+"px;top:"+_y+"px;' ><i class=' icon-zoom-in'></i></div>");
		
		_this.parent().find("div.imgzoomicon").css({ opacity: 0.5 });
		
		_this.parent().find("div.imgzoomicon").mouseover(function(){
			
			$(this).css({ opacity: 0.9 });
			
		})
		_this.parent().find("div.imgzoomicon").mouseout(function(){
			
			$(this).css({ opacity: 0.5 });
			
		})
		_this.parent().find("div.imgzoomicon").unbind("click");
		_this.parent().find("div.imgzoomicon").click(function(){
			
			window.open($(this).parent().find("img").attr("id"));
			return false;
		})
		
		
		
	}
	_nx = 20;
	_ny = 17;
	_this.parent().append("<div class='imgnumicon' style='left:"+_nx+"px;top:"+_ny+"px;' >"+_this.attr("name")+"</div>");
	_this.parent().find("div.imgnumicon").css({ opacity: 0.5 });
	
	
	if(_this.hasClass("videothumb"))
	{
		_this.parent().find("div.imgzoomicon").hide();
		_this.css({"width":"600px","height":"338px"});
		
		_width = 600;
		_height = 338;
		
		_nx = (_width-64)/2;
		_ny = (_height-65)/2;
		
		
		if(!_this.parent().find("div.imgplayicon").is("div"))
		{
			_this.parent().append("<div class='imgplayicon' style='left:"+_nx+"px;top:"+_ny+"px;''><i class='icon-play'></i></div>");
		}
		
		_this.css({opacity:0.9,cursor:"pointer" });
		
		_this.mouseover(function(){
			
			_this.parent().find("div.imgplayicon").css({color:"#fff"});
			_this.css({ opacity:0.5});
			
		})
		_this.mouseout(function(){
			
			_this.parent().find("div.imgplayicon").css({color:"#ccc"});
			_this.css({ opacity:0.9});
		})
		
		_this.parent().find("div.imgplayicon").mouseover(function(){
			
			$(this).css({color:"#fff"});
			_this.css({ opacity:0.5});
			
		})
		_this.parent().find("div.imgplayicon").mouseout(function(){
			
			$(this).css({color:"#ccc"});
			_this.css({ opacity:0.9});
			
		})
		
		_this.click(function(){
			
			_opid = _this.parent().attr("id");
			var modal = $.scojs_modal({remote:"../action/pop_playvideo.html@opid="+_opid,title:langs.playvideotitle});
			modal.show();
			return false;
			
		})
		
		_this.parent().find("div.imgplayicon").click(function(){
			
			_opid = _this.parent().attr("id");
			var modal = $.scojs_modal({remote:"../action/pop_playvideo.html@opid="+_opid,title:langs.playvideotitle});
			modal.show();
			return false;
			
		})
		
	}
	
}
function zoomOPImg()
{
	$(".opimage img").each(function(){
		
		
		
		
		doZoomOPImg($(this));
		
		$(this).load(function(){
			
			doZoomOPImg($(this));
			
		})
		
		
		
	})
}


function doAddOPVideoNum(_this)
{
	
	_screenWidth = $(document).width();
	
	
	_this.find("iframe").css({width:"100%"});
	_iframeWidth = _this.find("iframe").width() ;
	_newIframeWidth = _iframeWidth>600?600:_iframeWidth;
	if(_newIframeWidth != _iframeWidth)
	{
		_this.find("iframe").css({width:_newIframeWidth});
		_iframeWidth = _newIframeWidth;
	}
	_iframeheight = _iframeWidth * 9/16;
	_this.find("iframe").css({height:_iframeheight});
	if(_this.find(".videonumicon").is("div"))
	{
		return ;
	}
	
	
	_nx = 20;
	_ny = 17;
	_this.append("<div class='videonumicon' style='left:"+_nx+"px;top:"+_ny+"px;' >"+_this.attr("name")+"</div>");
	_this.find("div.videonumicon").css({ opacity: 0.5 });
	
}
function addOPVideoNum()
{
	
	
	
	$(".opvideo").each(function(){
		
		
		
		doAddOPVideoNum($(this));
		
		

	})
}


function doZoomOPImgForList(_this)
{
	
	if(_this.parent().find(".imgzoomicon").is("div"))
	{
		return ;
	}
	
	_opimgwidth = _this.width();
	
	//_this.parent().append("<div class='imgzoomicon' style='left:0;top:0' ></div>");
	
	
	if(_opimgwidth >= 198 )
	{
		_this.css({"width":"198px"});
		_opimgwidth = 198;
		
		_x = _opimgwidth-50;
		_y = 10;
		
		_this.parent().parent().append("<div class='imgzoomicon' style='left:"+_x+"px;top:"+_y+"px;' ><i class=' icon-zoom-in'></i></div>");
		
		_this.parent().parent().find("div.imgzoomicon").css({ opacity: 0.5 });
		
		_this.parent().parent().find("div.imgzoomicon").mouseover(function(){
			
			$(this).css({ opacity: 0.9 });
			
		})
		_this.parent().parent().find("div.imgzoomicon").mouseout(function(){
			
			$(this).css({ opacity: 0.5 });
			
		})
		_this.parent().parent().find("div.imgzoomicon").unbind("click");
		_this.parent().parent().find("div.imgzoomicon").click(function(){
			
			window.open($(this).parent().find("img").attr("id"));
			return false;
		})
		
		
		
	}
	_nx = 20;
	_ny = 17;
	_this.parent().parent().append("<div class='imgnumicon' style='left:"+_nx+"px;top:"+_ny+"px;' >"+_this.attr("name")+"</div>");
	_this.parent().parent().find("div.imgnumicon").css({ opacity: 0.5 });
	
	
	if(_this.hasClass("videothumb"))
	{
		_this.parent().parent().find("div.imgzoomicon").hide();
		
		_nx = (198-64)/2;
		_ny = (150-65)/2;
		
		if(!_this.parent().parent().find("div.imgplayicon").is("div"))
		{
			_this.parent().parent().append("<div class='imgplayicon' style='left:"+_nx+"px;top:"+_ny+"px;''><i class='icon-play'></i></div>");
		}
		
		_this.css({ opacity: 0.9,cursor:"pointer" });
		
		_this.mouseover(function(){
			
			_this.parent().parent().find("div.imgplayicon").css({color:"#fff"});
			_this.css({ opacity:0.5});
			
		})
		_this.mouseout(function(){
			
			_this.parent().parent().find("div.imgplayicon").css({color:"#ccc"});
			_this.css({ opacity:0.9});
		})
		
		_this.parent().parent().find("div.imgplayicon").mouseover(function(){
			
			$(this).css({color:"#fff"});
			_this.css({ opacity:0.5});
			
		})
		_this.parent().parent().find("div.imgplayicon").mouseout(function(){
			
			$(this).css({color:"#ccc"});
			_this.css({ opacity:0.9});
			
		})
		
		_this.click(function(){
			
			_opid = _this.parent().parent().attr("id");
			var modal = $.scojs_modal({remote:"../action/pop_playvideo.html@opid="+_opid,title:langs.playvideotitle});
			modal.show();
			return false;
			
		})
		
		_this.parent().parent().find("div.imgplayicon").click(function(){
			
			_opid = _this.parent().parent().attr("id");
			var modal = $.scojs_modal({remote:"../action/pop_playvideo.html@opid="+_opid,title:langs.playvideotitle});
			modal.show();
			return false;
			
		})
		
	}
}
function zoomOPImgForList()
{
	$(".opimagemini img").each(function(){
		
		
		
		
		doZoomOPImgForList($(this));
		
		$(this).load(function(){
			
			doZoomOPImgForList($(this));
			
		})
		
		
		
	})
}

$(document).ready(function(){
	
	
	if($(".successcases").is("div"))
	{
		$(".successcases .span2").mouseover(function(){
			
			$(this).find(".imgthumb").hide();
			$(this).find(".imgvrcode").show();
			
		})
		
		$(".successcases .span2").mouseout(function(){
			
			$(this).find(".imgthumb").show();
			$(this).find(".imgvrcode").hide();
			
		})
	}
	
	if($(".opvideo").length>0)
	{
		
		addOPVideoNum();
	}
	if($(".opimage img").length > 0 )
	{
		
		zoomOPImg();
	}
	
	if($(".opimagemini img").length > 0 )
	{
		
		zoomOPImgForList();
	}
	
	
	if($("#captcha").is("img"))
	{
		doshowCaptchacode();
	}
	
	
	$(".out-icon-refresh").click(function(){
		
		if(captchwaiting)
			return false;
		reShowCaptchacode();
		
	})
	$("#adduserinfocollect").click(function(){
		
		if(uid == 0)
		{
			submitalert("",langs.guestcannotadduserinfocollect,"error");
			return false;
		}
		$("#adduserinfocollectdiv").show();
		$(this).hide();
		
	})
	$(".ufop").click(function(){
		
		_checkboxid = $(this).attr("title");
		$("#"+_checkboxid).prop("checked",true);
		
	})
	
	$(".langbtn").click(function(){
		
		_lang = $(this).attr("name");
		$.post(serverroot+"op.php", {action:"changelang",lang:_lang},function(json){
	         
	         if(json.ret == 1)
	         {
	         	
	        	window.location.reload();
	         }
	         else
	         {
	        	// _clk.jAlert(json.retinfo.errormsg,"warning");
	         }
	       
	   
	  },"json");
		
	  return false;
		
	})
	$("#moresetting button").click(function(){
		
		$("#morevoteset").show();
		$("#moresetting").hide();
		
	})
	$("#enableothers").click(function(){
		
		if(uid > 0)
		{
			return;
		}
		if($("#enableothers").is(":checked"))
		{
			showFormError("#voteOtherinputDiv",langs.usercanenablevoteothers);
			$("#enableothers").attr("checked",false);
		}
		
	})
	
	$("#addcontent").click(function(){
		
		UE.getEditor('votecontent');
		$("#addcontentdiv").show();
		$(this).hide();
		
	})
	
	$("#addaftervotecontent").click(function(){
		
		UE.getEditor('aftervotecontent');
		$("#addaftervotecontentdiv").show();
		$(this).hide();
		
	})
	
	$(".voteviewtype").click(function(){
		
		_viewtype = $("input[name=public]:checked").val();
		if(_viewtype == 1)
		{
			$("#inputVotepwdDiv").show();
		}
		else
		{
			$("#inputVotepwdDiv").hide();
		}
		
	})
	
	$(".votetype").click(function(){
		
		_votetype = $("input[name=votetype]:checked").val();
		
		if(_votetype == 0)
		{
			$("#inputQuickVoteDiv").show();
			$("#inputMaxselDiv").hide();
			if($("#inputMinselDiv").is("div"))
			{
				$("#inputMinselDiv").hide();
			}
		}
		else
		{
			$("#inputQuickVoteDiv").hide();
			$("#inputMaxselDiv").show();
			if($("#inputMinselDiv").is("div"))
			{
				$("#inputMinselDiv").show();
			}
		}
		
	})
	
	/*
	if($("#votecontent").is("textarea"))
	{
		$('.form_datetime').datetimepicker({
			language: langs.datepickerlang,
	        weekStart: 1,
	        todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			forceParse: 0,
	        showMeridian: 1,
	        pickerPosition: "top-left"
	       
	    });
		
	}*/
	
	
	if($("#inputExpairtime").is("input"))
	{
		$('.form_datetime').datetimepicker({
			language: langs.datepickerlang,
	        weekStart: 1,
	        todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			forceParse: 0,
	        showMeridian: 1,
	        pickerPosition: "top-left"
	        
	       
	    });
		
	}
	
	initAddOptionImage();
	
	$("#addvoteoption").click(function(){
		
		_copy = $("#voteoptionforcopy");
		
		_newopnum = nowvoteopnum + 1;
		_copynum = _copy.find(".add-on-num").html();
		_optxt = _copy.find(".voteoptions").val();
		_copy.find(".add-on-num").html(_newopnum);
		_copy.find(".add-on-num").attr("id","oporder_"+_newopnum);
		//_copy.find(".voteoptions").val("");
		
		_ophtml = "<div class='control-group'>"+_copy.html()+"</div>";
		
		$("div.voteoptions").append(_ophtml);
		
		_copy.find(".add-on-num").html(_copynum);
		_copy.find(".voteoptions").val(_optxt);
		_copy.find(".add-on-num").attr("id","oporder_"+_copynum);
		nowvoteopnum = _newopnum;
		
		
		
		
		$("#oporder_"+_newopnum).parent().find(".addoppicdone").html("");
		$("#oporder_"+_newopnum).parent().find(".opimageid").val("");
		$("#oporder_"+_newopnum).parent().find(".oppicmodify").hide();
		$("#oporder_"+_newopnum).parent().find(".voteoptions").val("");
		initAddOptionImage();
		
	})
	$("#addvoteoptionwhenedit").click(function(){
		
		_copy = $("#voteoptionforcopy");
		
		_newopnum = $(".add-on-num").length ;
		
		
		
		_copynum = _copy.find(".add-on-num").html();
		//_optxt = _copy.find(".voteoptions").val();
		_copy.find(".add-on-num").html(_newopnum);
		_copy.find(".add-on-num").attr("id","oporder_"+_newopnum);
		//_copy.find(".voteoptions").val("");
		
		_ophtml = "<div class='control-group'>"+_copy.html()+"</div>";
		
		$("div.voteoptions").append(_ophtml);
		
		/*
		_copy.find(".add-on-num").html(_copynum);
		_copy.find(".voteoptions").val(_optxt);
		_copy.find(".add-on-num").attr("id","oporder_"+_copynum);
		*/
		nowvoteopnum = _newopnum;
		
		
		
		$("#oporder_"+_newopnum).parent().find(".addoppicdone").html("");
		$("#oporder_"+_newopnum).parent().find(".opimageid").val("");
		$("#oporder_"+_newopnum).parent().find(".oppicmodify").hide();
		$("#oporder_"+_newopnum).parent().find(".voteoptions").val(nowvoteopnum);
		$("#oporder_"+_newopnum).parent().find(".voteoptions").prop("disabled",false);
		initAddOptionImage();
		
	})
	
})