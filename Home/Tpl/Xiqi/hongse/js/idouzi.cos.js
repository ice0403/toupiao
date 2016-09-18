/*
 * 腾讯云cos文件上传
 * 依赖插件 jquery
 * 2015/10/22 item<1685384355@qq.com>
 *
 * var jobchat = {        
 *      cos_url : "",				获取签名url
 *      cos_select : "#liaotian",   上传前提示dom位置  #liaotian
 *      cos_offect : "bottom",      上传前提示的偏移  top/bottom;
 *  };
 */
	var idouziCos = (function (jobchat) {
    var xhr = [], parr = [], index = 0;
    var MAXSIZE = 3;
    /*
    $("body").on('click', ".coscancel", function () {
        jobchatCos.cancel($(this).closest('.cosreply').data('id'));
    });
    $("body").on('click', ".reply-up", function () {
        var index = $(this).data('index');
        $(".reply-up" , _get(index)).remove();
        if (parr[index].length == 2) {
            jobchatCos.upimages(parr[index][0], parr[index][1] , true);
        }
        if (parr[index].length == 3) {
            jobchatCos.upfiles(parr[index][0], parr[index][1], parr[index][2] , true);
        }
    });
    */    
    /* 
     * cos获取签名
     * Parameter file_type 签名类型 目前仅支持图片/文件
     * Parameter callback 成功后回调
     */

    var sign = function (file_type, callback, size) {
        /*
        var url = jobchat.cos_url.indexOf('?') == -1 ? (jobchat.cos_url + "?type=" + file_type) : (jobchat.cos_url + "&type=" + file_type);
        $.getJSON(url, function (d) {
            callback(d);
        });
        */
        
        var size = size||0, data = {file_length: size};
        if(file_type == 'img'){
            data.cos_img = 'on';
        }
        $.post("index.php@r=supplier_2Fapi_2FgetCosSign&wxid=839&apikey=839",data,function(d){
        	if(d.status == 1){
                callback({
                   status : 1,
                   url : d.url,
                   sign : d.sign
                });
            }else{
                callback({
                   status : 0,
                   info : '获取签名失败!'
                });
            }
        },"json");
    };
    /*
     * cos上传前load
     * Parameter file   上传对象
     * Parameter type   类型 img/file
     * Parameter select dom选择器 例子: "#imgreply"
     * Parameter offect load定位的位置 'bottom/top'
    var filesReply = function (file, at_index) {
        var html, select = select || jobchat.cos_select, offect = offect || jobchat.cos_offect;
        html = "<div class='cosreply' data-id='" + at_index + "'><span class='cosname'>" + subString(file.name, 10, true) + "</span><span class='cosstatus'>上传中</span><a class='coscancel'>[取消]</a></div>";
        if ($("#cosreplybox").length > 0) {
            $("#cosreplybox").append(html);
        } else {
            $(select).append("<div id = 'cosreplybox'>" + html + "</div>");
            $("#cosreplybox").css(offect, '0');
        }
        
        return true;
    };
    */
    //获取文件后缀名
    var getFileExt = function (name) {
        var len1 = name.lastIndexOf('.'), len2 = name.length;
        if (len1 == -1 || len2 == 0) {
            return false;
        }
        return name.substring(len1, len2);
    };
    /*
     * 字符串截取，兼容汉字
     * Parameter str    字符串
     * Parameter len    截取的字数
     * Parameter hasDot 是否显示... 默认false
     */
    var subString = function (str, len, hasDot) {
        var newLength = 0, newStr = "", chineseRegex = /[^\x00-\xff]/g, singleChar = "", hasDot = hasDot || false, strLength = str.replace(chineseRegex, "**").length;
        for (var i = 0; i < strLength; i++)
        {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) != null)
            {
                newLength += 2;
            }
            else
            {
                newLength++;
            }
            if (newLength > len)
            {
                break;
            }
            newStr += singleChar;
        }

        if (hasDot && strLength > len)
        {
            newStr += "...";
        }
        return newStr;
    };
    /*
     * 
     * @param {type} i 当前索引
     * @returns {$}    当前对象
     */
    var _get = function(i){
        return $(".cosreply[data-id='" + i + "']");
    }
    return {
    	maxSize:MAXSIZE,
        /* 
         * cos图片上传
         * Parameter file 上传的图片对象
         * Parameter imgcallback 图片上传前回调
         * Parameter callback 图片上传成功后回调
         */
        upimages: function (file, callback , isreply) {
            var isreply = isreply || false;
            if(isreply === false){
                ++index;
                parr[index] = [];
                parr[index].push(file);
                parr[index].push(callback);
            }
            var at_index = index; 
            if(file.size > 1024*1024*MAXSIZE){
            	callback({
                    status : 0,
                    info : '文件大小不能超过'+MAXSIZE+'MB!',
                    message : '文件大小不能超过'+MAXSIZE+'MB!'
                 });
            	return false;
            }
            sign('img', function (d) {
                if (d.status == 0) {
                	callback && callback({status: 0,info:d.info, message: d.info});
                }else{
                        var formData = new FormData();
                        var url = d.url + "?sign=" + encodeURIComponent(d.sign);
                        formData.append('FileContent', file);
                        xhr[at_index] = $.ajax({
                            type: 'POST',
                            url: url,
                            data: formData,
                            processData: false,
                            contentType: false,
                            headers: {
                                "Accept" : "text/json;charset=utf-8",
                            },
                            beforeSend: function (e) {
                            },
                            success: function (d) {
                            	callback && callback({status: 1, data: d});
                            },
                            error: function (e) {
                            	//console.log($.parseJSON(e.responseText));
                            	var msg = $.parseJSON(e.responseText).message || "文件服务器繁忙,稍后再试";
                            	callback && callback({status: 0,info:msg, message: msg});
                            }
                        });
                }
            }, file.size);
        },
        /* 
         * cos文件上传
         * #Parameter type 上传的类型 user: 会员图像上传, discuss: 讨论组背景上传, speak: 聊天室上传, 'share': 分享上传, matter_file: 事项文件上传, 'matter_voice': 聊天语音上传
         * Parameter type 上传文件目录 matter_file:讨论组, shenpi_file:审批,private_file:私人, attachment:其他
         * Parameter file 上传的图片对象
         * Parameter filecallback 文件上传前回调
         * Parameter callback 图片上传成功后回调
        upfiles: function (remotePath, file, callback , isreply) {  
            var isreply = isreply || false;
            if(isreply === false){
                ++index;
                parr[index] = [];
                parr[index].push(remotePath);
                parr[index].push(file);
                parr[index].push(callback);
            }
            
            var at_index = index;
            sign('file', function (d) {
                if (d.status == 0) {
                    callback({status: 0, info: d.info});
                } else {;
                    if (d.cos_can_upload == 0 || d.cos_free_capacity < file.size) {
                        callback({status: 0, info: d.info});
                    } else {
                        var formData = new FormData();
                        var url = d.url + encodeURI(remotePath) + "?sign=" + encodeURIComponent(d.sign);
                        formData.append('op', 'upload');
                        formData.append('fileContent', file);
                        xhr[at_index] = $.ajax({
                            type: 'POST',
                            url: url,
                            data: formData,
                            processData: false,
                            contentType: false,
                            dataType : 'json',
                            headers: {
                                "Accept" : "text/json;charset=utf-8"
                            },
                            beforeSend: function (e) {
                                if(isreply === false){
                                    filesReply(file , at_index);
                                }
                            },
                            success: function (d) {
                                if($(".reply-up" , _get(at_index)).length > 0 ){
                                    $(".reply-up" , _get(at_index)).remove();
                                }
                                $(".cosstatus" , _get(at_index)).text('上传成功');
                                callback({status: 1, data: d});
                                setTimeout(function () {
                                    $(".cosreply[data-id='" + at_index + "']").remove();
                                    //列队上传此处添加逻辑

                                }, 1000);
                            },
                            error: function (e) {
                                $(".cosstatus" , _get(at_index)).text('上传失败');
                                if($(".reply-up" , _get(at_index)).length == 0 ){
                                    $(".cosstatus" , _get(at_index)).after('<a href="javascript:void(0);" class="reply-up" data-index="' + at_index + '">[重新上传]</a>');
                                }
                                if(e.statusText != 'abort'){
                                    callback({status: 0, info: "文件服务器繁忙,稍后再试"});
                                }
                            }
                        });    
                    }
                    
                }
            }, file.size);
        },
        //分片上传
        sliceUploadFile: function(remotePath, file, callback , isreply){
            var isreply;
            isreply = isreply || false;
            if(isreply === false){
                ++index;
                parr[index] = [];
                parr[index].push(remotePath);
                parr[index].push(file);
                parr[index].push(callback);
            }           
            var at_index = index;
            var that = this, blobSlice;
            var reader = new FileReader();
            blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
            
            reader.onload = function (e) {
                if (e.target.result != null) {
                    g_totalSize += e.target.result.length;
                    if (e.target.result.length != 0) {
                        Qh.ftn_sign_update_dataurl(e.target.result);
                    }
                }
                g_currentChunk += 1;
                if (g_currentChunk <= g_chunks) {
                    if (g_iDelayReadData > 0)
                        clearTimeout(g_iDelayReadData);
                    if (g_LoadFileDelayTime > 0) {
                        g_iDelayReadData = setTimeout(nextSlice, g_LoadFileDelayTime);
                    } else {
                        g_iDelayReadData = 0;
                        nextSlice();
                    }
                }
                else {
                    g_running = false;
                    var sha1 = Qh.ftn_sha1_result();
                    console.log("sha1=%s", sha1);
                    sign('file', function (d) {
                        if (d.status == 0) {
                            callback({status: 0, info: d.info});
                        } else {
                            if (d.cos_can_upload == 0 || d.cos_free_capacity < file.size) {
                                callback({status: 0, info: d.info});
                            } else {
                                var sign = d.sign;
                                var session = '';
                                var sliceSize = 0;
                                var offset = 0;

                                //var url = that.cosapi_cgi_url + that.appid + "/" + bucketName + encodeURI(remotePath) + "?sign=" + encodeURIComponent(sign);
                                var url = d.url + "?sign=" + encodeURIComponent(d.sign);
                                var formData = new FormData();
                                formData.append('op', 'upload_slice');
                                formData.append('sha', sha1);
                                formData.append('filesize', file.size);
                                formData.append("slice_size", that.sliceSize);
                                var getSessionSuccess = function (result) {
                                    //var jsonResult = $.parseJSON(result);
                                    var jsonResult = result;
                                    if (jsonResult.data.access_url) {          
                                        callback({status: 1, data: result});
                                        return false;
                                    }
                                    session = jsonResult.data.session;
                                    sliceSize = jsonResult.data.slice_size;
                                    offset = jsonResult.data.offset
                                    sliceUpload();
                                };
                                var sliceUpload = function () {
                                    sign('file', function (d) {
                                        var sign = d.sign;
                                        var url = d.url;
                                        var formData = new FormData();
                                        formData.append('op', 'upload_slice');
                                        formData.append('session', session);
                                        formData.append('offset', offset);
                                        formData.append('fileContent', blobSlice.call(file, offset, offset + sliceSize));
                                        $.ajax({
                                            type: 'POST',
                                            url: url,
                                            data: formData,
                                            processData: false,
                                            contentType: false,
                                            dataType : 'json',
                                            headers: {
                                                "Accept" : "text/json;charset=utf-8"
                                            },
                                            success: sliceUploadSuccess,
                                            error: function (e) {
                                                $(".cosstatus" , _get(at_index)).text('上传失败');
                                                if($(".reply-up" , _get(at_index)).length == 0 ){
                                                    $(".cosstatus" , _get(at_index)).after('<a href="javascript:void(0);" class="reply-up" data-index="' + at_index + '">[重新上传]</a>');
                                                }
                                                if(e.statusText != 'abort'){
                                                    callback({status: 0, info: "文件服务器繁忙,稍后再试"});
                                                }
                                            }
                                        });
                                    }, file.size);
                                };
                                var sliceUploadSuccess = function (result) {
                                    console.log(result);
                                    //var jsonResult = $.parseJSON(result);
                                    var jsonResult = result;
                                    if (jsonResult.data.offset != undefined) {
                                        offset = jsonResult.data.offset + sliceSize;
                                        sliceUpload();
                                    }
                                    else {
                                        if($(".reply-up" , _get(at_index)).length > 0 ){
                                            $(".reply-up" , _get(at_index)).remove();
                                        }
                                        $(".cosstatus" , _get(at_index)).text('上传成功');
                                        callback({status: 1, data: d});
                                        setTimeout(function () {
                                            $(".cosreply[data-id='" + at_index + "']").remove();
                                            //列队上传此处添加逻辑

                                        }, 1000);
                                        return false;
                                    }
                                };
                                xhr[at_index] = $.ajax({
                                    type: 'POST',
                                    url: url,
                                    data: formData,
                                    processData: false,
                                    contentType: false,
                                    dataType : 'json',
                                    headers: {
                                        "Accept" : "text/json;charset=utf-8"
                                    },
                                    beforeSend: function (e) {
                                        if(isreply === false){
                                            filesReply(file , at_index);
                                        }
                                    },
                                    success: getSessionSuccess,
                                    error: function (e) {
                                        $(".cosstatus" , _get(at_index)).text('上传失败');
                                        if($(".reply-up" , _get(at_index)).length == 0 ){
                                            $(".cosstatus" , _get(at_index)).after('<a href="javascript:void(0);" class="reply-up" data-index="' + at_index + '">[重新上传]</a>');
                                        }
                                        if(e.statusText != 'abort'){
                                            callback({status: 0, info: "文件服务器繁忙,稍后再试"});
                                        }
                                    }
                                });
                            }
                        }
                    }, file.size);
                }
            };
            reader.onerror = error;
            var Qh = swfobject.getObjectById("qs");
            var g_LoadFileBlockSize = 2 * 1024 * 1024;
            var g_LoadFileDelayTime = 0;
            var g_chunkId = null;
            var g_totalSize = 0;
            var g_uniqueId = "chunk_" + (new Date().getTime());
            var g_chunks = Math.ceil(file.size / g_LoadFileBlockSize);
            var g_currentChunk = 0;
            var g_running = true;
            var g_startTime = new Date().getTime();
            var g_iDelayReadData = 0;

            var nextSlice = function (i, sliceCount) {
                var start = 0;
                var end = 0;
                start = g_currentChunk * g_LoadFileBlockSize;
                if (file != null) {
                    end = ((start + g_LoadFileBlockSize) >= file.size) ? file.size : start + g_LoadFileBlockSize;
                    reader.readAsDataURL(blobSlice.call(file, start, end));
                }
            };
            nextSlice();
        },
        */
        getFileExt: function (name) {
            return getFileExt(name);
        },
        filesReply: function (file, type, select, offect) {
            return filesReply(file, type, select, offect);
        },
        subString: function (str, len, hasDot) {
            return subString(str, len, hasDot)
        },
        version: "version : cos上传1.0 , author :item_3C1685384355_40qq.com> , Data : 2015-10-20",
        cancel: function (i) {   
            if (xhr[i]) {
                xhr[i].abort();
            }
            $(".cosreply[data-id='" + i + "']").remove();
        },
        //文件下载
        fileDown: function(path, type){
            var type = type || 'file';
            if(type == 'img'){
                window.open(path);
            }else{
                sign('file', function (d) {
                    if (d.status == 0) {
                        layer.alert(d.info, {icon : 2});
                    } else {
                        var url = path + "?sign=" + encodeURI(d.sign);
                        window.location.href = url;
                    }
                });
            }
        },
        //语音播放
        play: function(src, o, type){
            sign('file', function (d) {
                if (d.status == 0) {
                    layer.alert(d.info, {icon : 2});
                } else {
                    if(type == 1){
                        $('.audio_icon',$(o)).removeClass('evil_1').addClass('evil_2');
                    }else{
                        $('.audio_icon',$(o)).removeClass('evir_1').addClass('evir_2');
                    }
                    var url = src + "?sign=" + encodeURI(d.sign);
                    var audio = new Audio();
                    audio.src = url;
                    
                    audio.play();
                    audio.onended = function(){
                        if(type == 1){
                            $('.audio_icon',$(o)).removeClass('evil_2').addClass('evil_1');
                        }else{
                            $('.audio_icon',$(o)).removeClass('evir_2').addClass('evir_1');
                        }
                    };
                }
            });
        },
        //事项文件上传处理
        matterHandle: function(data){
            var i = 0, len = data.length, html = [];
            for(; i < len; ++i){
                if(data[i].status == 1){
                    html.push("<div class='cosreply' data-id='" + data[i].cosid + "'><span class='cosname'>" + subString(data[i].name, 10, true) + "</span><span class='cosstatus'>上传中</span><!--<a class='coscancel'>[取消]</a>--></div>");
                }
            }
            if ($("#cosreplybox").length > 0) {
                $("#cosreplybox").append(html.join(''));
            } else {
                $(jobchat.cos_select).append("<div id = 'cosreplybox'>" + html.join('') + "</div>");
                $("#cosreplybox").css(jobchat.cos_offect, '0');
            }
        }
    };
}(idouziCos));