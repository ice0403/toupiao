function closeMe(obj){
	var obj = $(obj);
	obj.hide();
}
function share(){
	if(qrcode == "0"){
		$("#share").show();
	}else{
		$("#win").show();
	}
}
$(function(){
	$('.notice').click(function(){
		closeMe(this);
	});
    $('.notices').click(function(){
		closeMe("#win");
	});	
})