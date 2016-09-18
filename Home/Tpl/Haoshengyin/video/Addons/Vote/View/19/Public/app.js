/**
 * Created by violet on 15/8/11.
 */
$(document).ready(function(){
    $app = new function(){
        var fullScreenAlert = function(theme){
            var id = layer.open({
                type: 1,
                content: "<div class='" + theme + "' />",
                style: "background-color:transparent;box-shadow:none; width: 90%"
            })
            $('.' + theme).click(function(){
                layer.close(id);
            })
        };

        this.alertRegClose = function(){
            fullScreenAlert("app-msg-reg-close");
        }

        this.alertVoteClose = function(){
            fullScreenAlert("app-msg-vote-close");
        }

        this.showShare = function(){
            var clientHeight = document.documentElement.clientHeight;
            var id = layer.open({
                type: 1,
                content: "<div class='app-msg-share' />",
                style: 'width:100%; height:'+ clientHeight +'px; background-color:transparent; border:none;'
            })
            $('.app-msg-share').height(clientHeight);
            $('.app-msg-share').click(function(){
                layer.close(id);
            })
        }

        this.showRule = function(url){
            $.getJSON(url,null,function(result){
                var maxHeight = document.documentElement.clientHeight * 0.7;
                var id = layer.open({
                    type: 1,
                    content: "<div class='rule-content'>"+result.rule+"</div>",
                    className: 'rule-pop',
                    style: 'width:90%;max-height:'+maxHeight+'px;overflow-x: scroll;'
                })
                $(".rule-content img").each(function(){
                    $(this).width("100%");
                })
            });
        }

        this.showMessage = function(html){
                var id = layer.open({
                    content: html,
                    style: 'width:90%;'
                });
        }

        this.showRegDesc = function(imgUrl, joinUrl){
            var joinContent = "";
            if(joinUrl != null && joinUrl != ""){
                joinContent = "<div class='att-note'><a data-role='none' data-ajax='false' href='" + joinUrl + "'></a></div>"
            }
            layer.open({
                type: 1,
                content: "<img width='100%' style='display: block' src='"+imgUrl+"'/><div class='pop-close'></div>"+joinContent,
                style: "width: 90%; background-color:transparent;position: relative;"
            })
            $('.pop-close').click(layer.closeAll);
        }

        this.recording = function(){
            var self = this;
            var recordUI =
                "<div class='ui-grid-b record-buttons'>" +
                "<div class='ui-block-a play'>试听声音</div>" +
                "<div class='ui-block-b record-note'>录制您的声音<br>点击按钮开始录制</div>" +
                "<div class='ui-block-c release'>发布声音</div>" +
                "</div>" +
                "<div class='btn-record'></div>";
            layer.open({
                type: 1,
                content: recordUI,
                className: "record-layer"
            });
            $(".btn-record")[0].addEventListener("touchstart",function(event){
                event.preventDefault();
                self.startRecord = true;
                wx.startRecord();
                $(".record-note").html("录制中...<br>松开按钮结束录制")
            });
            $(".btn-record")[0].addEventListener("touchend",function(event){
                event.preventDefault();
                if(self.startRecord == true);
                {
                    wx.stopRecord({
                        success: function (res) {
                            self.recordId = res.localId;
                            $(".record-note").html("录制完成!<br>点击按钮重新录制")
                        }
                    });
                }
            });

            $(".play").click(function(){
                if(self.recordId == null) return;
                wx.playVoice({
                    localId: self.recordId // 需要暂停的音频的本地ID，由stopRecord接口获得
                });
            })

            $(".release").click(function () {
                if(self.recordId == null) return;
                layer.closeAll();
                wx.uploadVoice({
                    localId: self.recordId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        self.recordServerId = res.serverId; // 返回音频的服务器端ID
                        $("#recordId").val(res.serverId);
                        layer.open({content:'声音录制成功,可以重新录制或试听!', time:2})
                        var btn = $(".up-audio");
                        btn.attr("src",btn.data("success-img"));
                    }
                });
            })

            wx.onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                complete: function (res) {
                    console.log(res.localId);
                    self.recordId = res.localId;
                }
            });
        }
    }
})