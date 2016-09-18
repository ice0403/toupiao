doing = false;
var votesusalert = "投票成功";
var votedalert = "已投票";
var votebtntxt = "投票";
var votenumtxt = "票";
var _lskey = "wxparam_"+guid;
var _lsnokey = "wxparamno_"+guid;

function getScrollTop()
{
    var scrollTop=0;
    if(document.documentElement&&document.documentElement.scrollTop)
    {
        scrollTop=document.documentElement.scrollTop;
    }
    else if(document.body)
    {
        scrollTop=document.body.scrollTop;
    }
    return scrollTop;
}
function getClientHeight()
{
    var clientHeight=0;
    if(document.body.clientHeight&&document.documentElement.clientHeight)
    {
        var clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;        
    }
    else
    {
        var clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;    
    }
    return clientHeight;
}
function getScrollHeight()
{
    return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
}

function getWxOptionBox(_option)
{
	_div = "<div id='wxop_"+_option.opid+"' class='wxop '>";
	if (_option.hasImage  && _option.status >=0 && _option.wximgorvideoinpage == 0)
	{
		_div += "<div class='wxopimg '>";
		if(_option.hasPageText)
		{
			_div += "<a href='"+_option.pageurl+"'>"
			_div += "<img src='"+_option.thumimageurl+"'  /></a>";
		}
		else
		{
			_div += "<img src='"+_option.thumimageurl+"'  />";
		}
		_div += "</div>";
		
	}
	
	
	if(_option.hasVideo && _option.status >=0 && _option.wximgorvideoinpage == 1)
	{
		_div += "<div class='wxopimg '>"+_option.videocode+"</div>";
	}
	
	_div += "<div class='wxoptxt'>";
	if (_option.hasPageText)
	{
		
		
		if(hideopindex)
		{
			_div += "<a href='"+_option.pageurl+"'>"+_option.optext+"</a>";
		}
		else
		{
			_div += "<a href='"+_option.pageurl+"'>"+_option.opindex+". "+_option.optext+"</a>";
		}
	}
	else
	{
		
		if(hideopindex)
		{
			_div += _option.optext;
		}
		else
		{
			_div += _option.opindex+". "+_option.optext;
		}
	}
	
	if (_option.hasLinkUrl)
	{
		_div += "<a href='"+_option.linkurl+"' target='_blank' rel='nofollow'  >&nbsp;链接&nbsp; <i class='icon-external-link' ></i></a>";
	}
	 
	_div += "</div>";
	_div += "<div class='wxopvotediv'><div class='wxvbtn'>";
	disabled = "";
	if (isinweixin == 0 )
	{
		disabled = "disabled";
	}
	_div += "<button class='btn btn-info wxvotebutton' "+disabled+" name='"+_option.opid+"'><i class='icon-thumbs-up'></i> "+votebtntxt+"</button></div>";
	_div += "<div class='wxvinfo' id='wxinfo_"+_option.opid+"'>";
	_div += "<span>"+_option.num+"</span>"+votenumtxt;
	_div += "</div>";
	_div += "</div></div>";
	
	return _div;
	
}

function showWxOptionListMore(_guid)
{
	if(loadpagedone)
		return false;
	if(loadingpage)
		return false;
	
	loadingpage = true;
	doing = true;
	wxpage += 1;
	$(".loadingpagealert").show();
	$("#loadmorebtn").hide();
	$.post(serverroot+"op.php", {action:"loadvoteoptionbypage",guid:_guid,page:wxpage},function(json){
        
		
		$(".loadingpagealert").hide();
		loadingpage = false;
        if(json.ret == 1)
        {
        	
        	
        	for(i in json.retinfo.list.left)
        	{
        		_opt = json.retinfo.list.left[i];
        		optdiv = getWxOptionBox(_opt);
        		
        		
        		
        		$(".leftoptions").append(optdiv);
        		
        	}
        	for(i in json.retinfo.list.right)
        	{
        		_opt = json.retinfo.list.right[i];
        		optdiv = getWxOptionBox(_opt);
        		$(".rightoptions").append(optdiv);
        	}
        	if(json.retinfo.list.num == 0)
        	{
        		$(".loadingpagealert").html("没有更多选手了");
        		$("#loadmorebtn").hide();
        	}
        	else
        	{
        		$(".loadingpagealert").hide();
        		$("#loadmorebtn").show();
        		initWxVoteBtnClk();
        	}
        	
        	if(json.retinfo.list.num < optionpagenum)
        	{
        		loadpagedone = true;
        		$("#loadmorebtn").hide();
        	}
        }
        doing = false;
		
      
  
	},"json");
}
function showWxOptionListMoreOnerow(_guid,limit)
{
	if(loadpagedone)
		return false;
	if(loadingpage)
		return false;
	
	loadingpage = true;
	doing = true;
	wxpage += 1;
	$(".loadingpagealert").show();
	$("#loadmorebtn").hide();
	$.post(serverroot+"op.php", {action:"loadvoteoptionbypageonerow",guid:_guid,page:wxpage,limit:limit},function(json){
        
		
		$(".loadingpagealert").hide();
		loadingpage = false;
        if(json.ret == 1)
        {
        	
        	
        	for(i in json.retinfo.list.left)
        	{
        		_opt = json.retinfo.list.left[i];
        		optdiv = getWxOptionBox(_opt);
        		$(".leftoptions").append(optdiv);
        		
        		if(i%3 ==2)
        		{
        			$("#wxop_"+_opt.opid).addClass("wxoplast");
        		}
        	}
        	
        	if(json.retinfo.list.num == 0)
        	{
        		$(".loadingpagealert").html("没有更多选手了");
        		$("#loadmorebtn").hide();
        	}
        	else
        	{
        		$(".loadingpagealert").hide();
        		$("#loadmorebtn").show();
        		initWxVoteBtnClk();
        	}
        	
        	if(json.retinfo.list.num < optionpagenum)
        	{
        		loadpagedone = true;
        		$("#loadmorebtn").hide();
        	}
        }
        doing = false;
		
      
  
	},"json");
}
function hideWapAlert()
{
	$(".wapalert").hide();
}
function showWapAlert(msg,autohide)
{
	$(".wapalert p").html(msg);
	$(".wapalert").show();
	if(autohide )
	{
		setTimeout ("hideWapAlert()",2000);
	}
}


function initWxVoteBtnClk()
{
	
	$(".wxlapiaobutton").unbind("click");
	$(".wxvotebutton").unbind("click");
	$(".wxlapiaobutton").click(function(){
		$(".helphimwalert").show();
	})
	$(".wxvotebutton").click(function(){
		
		
		
		if(doing)
			return false;
		
		_clk = $(this);
		
		if(isinweixin == 0)
		{
			_clk.html("微信内投票");
			return false;
		}
		
		if(expired == 1)
		{
			showWapAlert("活动已结束",true);
			return false;
		}
		
		
		
		
		wxparam = "";
		needinwx = 0 ;
		if($("#wxparam").is("input"))
		{
			wxparam = $("#wxparam").val();
			//alert(wxparam);
			needinwx = 1;
		}
		
		
		
		if(wxparam == "")
		{
			
			if(getByHash(_lskey))
			{
				//wxparam = getByHash(_lskey);
				
				
			}
			
		}
		
		//alert(getByHash(_lskey));
		
		
		if(needinwx == 1)
		{
			if(wxparam == "" && isinweixin==1)
			{
				
				$(".dofollowalert").show();
				return false;
			}
			
		}
		//alert('encoded');
		$(this).html("提交中");
		
		if(wxvrcode == 1 )
		{
			//alert('gee');
			
			$(".geetestalert").show();
			$("#geetestbox h4").html("拖动下方滑块完成验证");
			geetestObj.refresh();
			
			geetestObj.onSuccess(function(){
				
				$("#geetestbox h4").html("正在提交....");
				
				gtdata = geetestObj.getValidate();
				ops = _clk.attr("name");
				param = {action:"dovote",guid:guid,ops:ops};
				param.geetest_challenge = gtdata.geetest_challenge;
				param.geetest_seccode = gtdata.geetest_seccode;
				param.geetest_validate = gtdata.geetest_validate;
				param.wxparam = wxparam;
				doing = true;
				$.post("../op.php",param,function(json){
		            
					$(".geetestalert").hide();
					
					
					
		            if(json.ret == 1)
		            {
		            	doing = false;
		            	_nownum = parseInt($("#wxinfo_"+ops+" span").html());
		            	_newnum = _nownum + 1;
		            	showWapAlert(votesusalert,true);
		            	_clk.html(votedalert);
		            	//$("#wxinfo_"+ops+" span").html(_newnum);
		            	
		            }
		            else
		            {
		            	doing = false;
		            	
		            	_clk.html("<i class='icon-thumbs-up''></i> "+votebtntxt);
		            	showWapAlert(json.retinfo.errormsg,true);
		            }
		           },"json");
			})
			
			return false;
		}
		
		else
		{
			
			
			
			
			ops = $(this).attr("name");
			param = {action:"dovote",guid:guid,ops:ops};
			param.wxparam = wxparam;
			doing = true;
			$.post("../op.php",param,function(json){
	            
	            if(json.ret == 1)
	            {
	            	doing = false;
	            	//hidevoteshow();
	            	//submitalert(langs.success,langs.dovoteok+" "+langs.jumping,"success");
	            	//setTimeout("window.location.href='"+json.retinfo.votelink+"?ref="+Math.random()+"#viewvote'",1000);
	            	
	            	//setTimeout("window.location.href='"+json.retinfo.votelink+"'",1000);
	            	
	            	//alert('sus');
	            	_nownum = parseInt($("#wxinfo_"+ops+" span").html());
	            	_newnum = _nownum + 1;
	            	showWapAlert(votesusalert,true);
	            	_clk.html(votedalert);
	            	//$("#wxinfo_"+ops+" span").html(_newnum);
	            	
	            }
	            else
	            {
	            	doing = false;
	            	//alert(json.retinfo.errormsg);
	            	_clk.html("<i class='icon-thumbs-up''></i> "+votebtntxt);
	            	showWapAlert(json.retinfo.errormsg,true);
	            	//if(json.retinfo.errorcode == "1090909")
	            	//{
	            		//window.location.href='../action/fixwxvote.html';
	            	//}
	            }
	           },"json");
			
		}
		
		

	})
}

function loadWXUserInfo()
{
	
}

$(document).ready(function(){
	
	
	wxparam_init = $("#wxparam").val();
	
	
	
		if(wxparam_init != "" && (getByHash(_lskey) == null || getByHash(_lskey) == false || getByHash(_lskey)!=wxparam_init  ))
		{
			if(ismustfollow == 1)
				setByHash(_lskey,wxparam_init);
			
		}
	
	
	//alert(wxparam_init);
	
	$("#cancelfollowalert").click(function(){
		
		$(".dofollowalert").hide();
		return false;
		
	})
	if($("#optionbypage").is("input"))
	{
		if($("#optionbypage").val() == 1)
		{
			
			
		}
	}
	
	if($("#showvotedescinfo").is("div"))
	{
		$("#showvotedescinfo").click(function(){
			
			if($("#votedescinfo").css("display") == "none")
			{
				$("#votedescinfo").show();
				$("#showvotedescinfo .arrow").removeClass("icon-double-angle-down");
				$("#showvotedescinfo .arrow").addClass("icon-double-angle-up");
			}
			else
			{
				$("#votedescinfo").hide();
				$("#showvotedescinfo .arrow").removeClass("icon-double-angle-up");
				$("#showvotedescinfo .arrow").addClass("icon-double-angle-down");
			}
			
		})
	}
	
	initWxVoteBtnClk();
	
	if(expired == 0)
	{
		try{
			
			var skt = io.connect('http://'+notifyserver);
			skt.emit("register",{guid:guid,ghash:ghash});
			skt.on('updatevotenum',function(data){
				
				$("#wxallvotenum").html(data.votenum);
				$("#wxallviewnum").html(data.views);
				
				_newopnum = parseInt(data.opnum);
				_nowopnum = parseInt($("#wxinfo_"+data.opid+" span").html());
				if(_newopnum > _nowopnum)
				{
					$("#wxinfo_"+data.opid+" span").html(data.opnum);
					$("#wxinfo_"+data.opid+" span").css({color:"red"});
					$("#wxinfo_"+data.opid).animate({"font-size":"20px"});
					$("#wxinfo_"+data.opid).animate({"font-size":"14px"});
					
				}
				//console.log(data);
			})
			
		}
		catch(err)
		{
			
		}
	}
	
})