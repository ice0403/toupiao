<?php
/**
 * 通用通知接口demo
 * ====================================================
 * 支付完成后，微信会把相关支付和用户信息发送到商户设定的通知URL，
 * 商户接收回调信息后，根据需要设定相应的处理流程。
 *
 * 这里举例使用log文件形式记录回调信息。
*/

	include_once("./log_.php");
	include_once("../WxPayPubHelper/WxPayPubHelper.php");

    //使用通用通知接口
	$notify = new Notify_pub();

	//存储微信的回调
	$xml = $GLOBALS['HTTP_RAW_POST_DATA'];
	$notify->saveData($xml);

	//验证签名，并回应微信。
	//对后台通知交互时，如果微信收到商户的应答不是成功或超时，微信认为通知失败，
	//微信会通过一定的策略（如30分钟共8次）定期重新发起通知，
	//尽可能提高通知的成功率，但微信不保证通知最终能成功。
	if($notify->checkSign() == FALSE){
		$notify->setReturnParameter("return_code","FAIL");//返回状态码
		$notify->setReturnParameter("return_msg","签名失败");//返回信息
	}else{
		$notify->setReturnParameter("return_code","SUCCESS");//设置返回码
	}
	$returnXml = $notify->returnXml();
	echo $returnXml;

	//==商户根据实际情况设置相应的处理流程，此处仅作举例=======

	//以log文件形式记录回调信息
	$log_ = new Log_();
	$log_name="./notify_url.log";//log文件路径
	$log_->log_result($log_name,"【接收到的notify通知】:\n".$xml."\n");

	if($notify->checkSign() == TRUE)
	{
		if ($notify->data["return_code"] == "FAIL") {
			//此处应该更新一下订单状态，商户自行增删操作
			$log_->log_result($log_name,"【通信出错】:\n".$xml."\n");
		}
		elseif($notify->data["result_code"] == "FAIL"){
			//此处应该更新一下订单状态，商户自行增删操作
			$log_->log_result($log_name,"【业务出错】:\n".$xml."\n");
		}
		else{
			//此处应该更新一下订单状态，商户自行增删操作
			$log_->log_result($log_name,"【支付成功】:\n".$xml."\n");
		}

		//商户自行增加处理流程,
		//例如：更新订单状态
		//例如：数据库操作
		//例如：推送支付完成信息



$dbconfig = require_once dirname(__FILE__).'/../../../mysqlconf.php';
include_once('../../mysql.class.php');

$cfg['tb_pre'] = $dbconfig['DB_PREFIX'];
$cfg['db_charset'] = 'utf8';
$cfg['sqlerr'] = '1';
$cfg['errlog'] = '1';
$cfg['timediff'] = '0';

$fr_time = time();
define('FR_ROOT', str_replace("\\", '/', dirname(__FILE__)));
define('CACHE_ROOT', $cfg['cache_dir'] ? $cfg['cache_dir'] : FR_ROOT.'/cache');
define('DATA_ROOT', FR_ROOT.'/data');
$db = new db_mysql();
$db->halt = $cfg['sqlerr'];
$db->connect($dbconfig['DB_HOST'], $dbconfig['DB_USER'], $dbconfig['DB_PWD'], $dbconfig['DB_NAME'],0);


$xmlReturn = new DOMDocument();
$xmlReturn->loadXML($xml);

$array_e = $xmlReturn->getElementsByTagName('out_trade_no');
$out_trade_no = $array_e->item(0)->nodeValue;

$array_e = $xmlReturn->getElementsByTagName('transaction_id');
$transaction_id = $array_e->item(0)->nodeValue;

$array_e = $xmlReturn->getElementsByTagName('total_fee');
$total_fee = $array_e->item(0)->nodeValue;

$array_e = $xmlReturn->getElementsByTagName('openid');
$openid = $array_e->item(0)->nodeValue;


$array_e = $xmlReturn->getElementsByTagName('result_code');
$result_code = $array_e->item(0)->nodeValue;


$array_e = $xmlReturn->getElementsByTagName('time_end');
$time_end = $array_e->item(0)->nodeValue;

if($result_code == "SUCCESS"){
    $result_code = 1;
}else{
    $result_code = 0;
}

$total_fee = $total_fee / 100 ;


//$sql = "REPLACE INTO ".$dbconfig['DB_PREFIX']."vote_order(mid,out_trade_no,transaction_id,total_fee,openid,result_code,time_end,addtime) VALUES ('%s','%s','%s','%s','%s','%s','%s','%s')";
$sql = "REPLACE INTO ".$dbconfig['DB_PREFIX']."member_operation(mid,payment,pname,product,out_trade_no,buyid,money,openid,sta,time_end,mtime) VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')";
$sql = sprintf($sql, 0,'weixin','投票','投票', $out_trade_no,$transaction_id,$total_fee,$openid,$result_code,$time_end,time());
$db->query($sql);











	}
?>
