function getQueryStringRegExp(a){var b=new RegExp("(^|\\?|&)"+a+"=([^&]*)(\\s|&|$)","i");if(b.test(location.href)){return unescape(RegExp.$2.replace(/\+/g," "))}return""}var ref=getQueryStringRegExp("tracker_u");var uid=getQueryStringRegExp("uid");var websiteid=getQueryStringRegExp("website_id");var utype=getQueryStringRegExp("tracker_type");var adgroupKeywordID=getQueryStringRegExp("adgroupKeywordID");var expire_time=new Date((new Date()).getTime()+30*24*3600000).toGMTString();var expire_time2=new Date((new Date()).getTime()+30*24*3600000).toGMTString();var expire_time3=new Date((new Date()).getTime()).toGMTString();var expire_time_wangmeng=new Date((new Date()).getTime()+1*24*3600000).toGMTString();if(ref){if(ref!=""){document.cookie="unionKey="+ref+";expires="+expire_time_wangmeng+";domain=."+no3wUrl+";path=/"
}}if(adgroupKeywordID){if(adgroupKeywordID!=""){document.cookie="adgroupKeywordID="+adgroupKeywordID+";expires="+expire_time_wangmeng+";domain=."+no3wUrl+";path=/"}}if(utype){if(utype!=""){document.cookie="unionType="+utype+";expires="+expire_time2+";domain=."+no3wUrl+";path=/"}}if(uid){document.cookie="uid="+uid+";expires="+expire_time+";domain=."+no3wUrl+";path=/"}if(websiteid){document.cookie="websiteid="+websiteid+";expires="+expire_time+";domain=."+no3wUrl+";path=/"};