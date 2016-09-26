<?php

// +----------------------------------------------------------------------

// | ThinkPHP [ WE CAN DO IT JUST THINK IT ]

// +----------------------------------------------------------------------

// | Copyright (c) 2009 http://thinkphp.cn All rights reserved.

// +----------------------------------------------------------------------

// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )

// +----------------------------------------------------------------------

// | Author: liu21st <liu21st@gmail.com>

// +----------------------------------------------------------------------



class PublicAction extends Action {





	function _initialize() {

        import('@.ORG.Util.Cookie');

	}



	// 检查用户是否登录

	protected function checkUser() {

		if(!isset($_SESSION[C('USER_AUTH_KEY')])) {

			$this->assign('jumpUrl',C('USER_AUTH_GATEWAY'));

			$this->error('没有登录');

		}

	}



	// 顶部页面

	public function top() {

		C('SHOW_RUN_TIME',false);			// 运行时间显示

		C('SHOW_PAGE_TRACE',false);

		$model	=	M("Group");

		$list	=	$model->where('status=1')->getField('id,title');

		$this->assign('nodeGroupList',$list);

		$this->display();

	}

	// 尾部页面

	public function footer() {

		C('SHOW_RUN_TIME',false);			// 运行时间显示

		C('SHOW_PAGE_TRACE',false);

		$this->display();

	}

	// 菜单页面

	public function menu() {

        $this->checkUser();

        if(isset($_SESSION[C('USER_AUTH_KEY')])) {

            //显示菜单项

            $menu  = array();

            if(isset($_SESSION['menu'.$_SESSION[C('USER_AUTH_KEY')]])) {



                //如果已经缓存，直接读取缓存

                $menu   =   $_SESSION['menu'.$_SESSION[C('USER_AUTH_KEY')]];

            }else {

                //读取数据库模块列表生成菜单项

                $node    =   M("Node");

				$id	=	$node->getField("id");

				$where['level']=2;

				$where['status']=1;

				$where['pid']=$id;

                $list	=	$node->where($where)->field('id,name,group_id,title')->order('sort asc')->select();

                $accessList = $_SESSION['_ACCESS_LIST'];

                foreach($list as $key=>$module) {

                     if(isset($accessList[strtoupper(APP_NAME)][strtoupper($module['name'])]) || $_SESSION['administrator']) {

                        //设置模块访问权限

                        $module['access'] =   1;

                        $menu[$key]  = $module;

                    }

                }

                //缓存菜单访问

                $_SESSION['menu'.$_SESSION[C('USER_AUTH_KEY')]]	=	$menu;

            }

            if(!empty($_GET['tag'])){

                $this->assign('menuTag',$_GET['tag']);

            }

			//dump($menu);

            $this->assign('menu',$menu);

		}

		C('SHOW_RUN_TIME',false);			// 运行时间显示

		C('SHOW_PAGE_TRACE',false);

		$this->display();

	}



//	public function menu() {

//        $this->checkUser();

//        if(isset($_SESSION[C('USER_AUTH_KEY')])) {

//            //显示菜单项

//            $menu  = array();

//            if(isset($_SESSION['menu'.$_SESSION[C('USER_AUTH_KEY')]])) {

//

//                //如果已经缓存，直接读取缓存

//                $menu   =   $_SESSION['menu'.$_SESSION[C('USER_AUTH_KEY')]];

//            }else {

//                //读取数据库模块列表生成菜单项

//                $node    =   M("Node");

//				$id	=	$node->getField("id");

//				$where['level']=2;

//				$where['status']=1;

//				$where['pid']=$id;

//                $list	=	$node->where($where)->field('id,name,group_id,title')->order('sort asc')->select();

//                $accessList = $_SESSION['_ACCESS_LIST'];

//                foreach($list as $key=>$module) {

//                     if(isset($accessList[strtoupper(APP_NAME)][strtoupper($module['name'])]) || $_SESSION['administrator']) {

//                        //设置模块访问权限

//                        $module['access'] =   1;

//                        $menu[$key]  = $module;

//                    }

//                }

//                //缓存菜单访问

//                $_SESSION['menu'.$_SESSION[C('USER_AUTH_KEY')]]	=	$menu;

//            }

//            if(!empty($_GET['tag'])){

//                $this->assign('menuTag',$_GET['tag']);

//            }

//			//dump($menu);

//            $this->assign('menu',$menu);

//		}

//		C('SHOW_RUN_TIME',false);			// 运行时间显示

//		C('SHOW_PAGE_TRACE',false);

//		$this->display();

//	}



    // 后台首页 查看系统信息

    public function main() {

        $info = array(

            '操作系统'=>PHP_OS,

            '运行环境'=>$_SERVER["SERVER_SOFTWARE"],

            'PHP运行方式'=>php_sapi_name(),

            'ThinkPHP版本'=>THINK_VERSION.' [ <a href="http://thinkphp.cn" target="_blank">查看最新版本</a> ]',

            '上传附件限制'=>ini_get('upload_max_filesize'),

            '执行时间限制'=>ini_get('max_execution_time').'秒',

            '服务器时间'=>date("Y年n月j日 H:i:s"),

            '北京时间'=>gmdate("Y年n月j日 H:i:s",time()+8*3600),

            '服务器域名/IP'=>$_SERVER['SERVER_NAME'].' [ '.gethostbyname($_SERVER['SERVER_NAME']).' ]',

            '剩余空间'=>round((@disk_free_space(".")/(1024*1024)),2).'M',

            'register_globals'=>get_cfg_var("register_globals")=="1" ? "ON" : "OFF",

            'magic_quotes_gpc'=>(1===get_magic_quotes_gpc())?'YES':'NO',

            'magic_quotes_runtime'=>(1===get_magic_quotes_runtime())?'YES':'NO',

            );

        $this->assign('info',$info);

        $this->display();

    }



	// 用户登录页面

	public function login() {

		Cookie::set ( '_currentUrl_', __SELF__ );

		if(!isset($_SESSION[C('USER_AUTH_KEY')])) {

			$this->display();

		}else{

			$this->redirect('/');

		}

	}




	public function reg() {

		Cookie::set ( '_currentUrl_', __SELF__ );

		if(!isset($_SESSION[C('USER_AUTH_KEY')])) {

			$this->display();

		}else{

			$this->redirect('/');

		}

	}



	public function insertReg() {
	    $this->assign ( 'jumpUrl', Cookie::get ( '_currentUrl_' ) );

		if(!$this->_param('username')){
			$this->error('用户名不能为空！');
		}

		if($this->_param('password') != $this->_param('password2') ){
			$this->error('两次输入密码不一致！');
		}

		$model = M ("User");
		if(!$model->create()) {
			$this->error($model->getError());
		}else{
			$model->reg_time = time();
			$model->password = md5($this->_param('password'));
			if($result	 =	 $model->add()) {
			    $this->assign ( 'jumpUrl', '/Member/' );
				$this->success('注册成功！');
			}else{
				$this->error('注册失败！');
			}
	    }

	}




	public function index()

	{

		//如果通过认证跳转到首页

		redirect(__APP__);

	}



	// 用户登出

    public function logout()

    {

        if(isset($_SESSION[C('USER_AUTH_KEY')])) {

			unset($_SESSION[C('USER_AUTH_KEY')]);

			unset($_SESSION);

			session_destroy();

            $this->assign("jumpUrl",__URL__.'/login/');

            $this->success('登出成功！');

        }else {

            $this->error('已经登出！');

        }

    }



	// 登录检测

	public function checkLogin() {

		$this->assign ( 'jumpUrl', Cookie::get ( '_currentUrl_' ) );

		if(empty($_POST['admin_name'])) {

			$this->error('帐号错误！');

		}elseif (empty($_POST['password'])){

			$this->error('密码必须！');

		}

		// elseif (empty($_POST['verify'])){

		// 	$this->error('验证码必须！');

		// }

        //生成认证条件

        $map            =   array();

		// 支持使用绑定帐号登录

		$map['admin_name']	= $_POST['admin_name'];

        //$map["a_flag"]	=	array('gt',0);

		// if($_SESSION['verify'] != md5($_POST['verify'])) {

		// 	$this->error('验证码错误！');

		// }

		//import ( '@.ORG.Util.RBAC' );

        //$authInfo = RBAC::authenticate($map);

        //使用用户名、密码和状态的方式进行认证

        //if(false === $authInfo) {

            //$this->error('帐号不存在或已禁用！');

        //}else {



			$User	=	M('User');

			$vo = $User -> where("username = '".$_POST['admin_name']."'")->find();

			if(!$vo){

				$this->error('帐号不存在或已禁用！');

			}



            if($vo['password'] != md5($_POST['password'])) {

            	$this->error('密码错误！');

            }

            $_SESSION[C('USER_AUTH_KEY')]	=	$vo['id'];

            $_SESSION['loginUserName']		=	$vo['username'];

        	$_SESSION['administrator']		=	true;


            //保存登录信息

			$ip		=	get_client_ip();

			$time	=	time();

            $data = array();

			$data['id']	=	$vo['id'];

			$data['login_time']	=	$time;

			//$data['login_count']	=	array('exp','login_count+1');

			//$data['a_loginip']	=	$ip;

			$User->save($data);

			// 缓存访问权限

            //RBAC::saveAccessList();

			$this->success('登录成功！');

		//}

	}

    // 更换密码

    public function changePwd()

    {

		$this->checkUser();

        //对表单提交处理进行处理或者增加非表单数据

		if(md5($_POST['verify'])	!= $_SESSION['verify']) {

			$this->error('验证码错误！');

		}

		$map	=	array();

        $map['password']= pwdHash($_POST['oldpassword']);

        if(isset($_POST['account'])) {

            $map['account']	 =	 $_POST['account'];

        }elseif(isset($_SESSION[C('USER_AUTH_KEY')])) {

            $map['id']		=	$_SESSION[C('USER_AUTH_KEY')];

        }

        //检查用户

        $User    =   M("User");

        if(!$User->where($map)->field('id')->find()) {

            $this->error('旧密码不符或者用户名错误！');

        }else {

			$User->password	=	pwdHash($_POST['password']);

			$User->save();

			$this->success('密码修改成功！');

         }

    }

	public function profile() {

		$this->checkUser();

		$User	 =	 M("admin");

		$vo	=	$User->getById($_SESSION[C('USER_AUTH_KEY')]);

		$this->assign('vo',$vo);

		$this->display();

	}

	public function verify()

    {

		$type	 =	 isset($_GET['type'])?$_GET['type']:'gif';

        import("@.ORG.Util.Image");

        Image::buildImageVerify(4,1,$type);

    }


	public function lanrenVerify(){
		import("@.ORG.Util.Image");
		Image::GBVerify2($_GET['var'],40,30);
	}


	public function ajaxVerify(){
		$verify = $_GET['verify'];
		if(md5($verify) == $_SESSION['lrVerify']){
			echo 1;
		}else{
			echo 0;
		}
	}



// 修改资料

	public function change() {

		$this->checkUser();

		$User	 =	 D("User");

		if(!$User->create()) {

			$this->error($User->getError());

		}

		$result	=	$User->save();

		if(false !== $result) {

			$this->success('资料修改成功！');

		}else{

			$this->error('资料修改失败!');

		}

	}


	public function getMPJson(){
		$model = M("Member_p");
		$voList = $model->where("p_id=".$_GET['id'])->find();
		echo json_encode($voList);
	}
	//返回6位随机码
    private function productCode() {
        /*$str_1 = range('a','z');
        $str_2 = range('A', 'Z');*/
        $str_3 = range(0,9);
        //$strArr = array_merge($str_1,$str_2,$str_3);
        //随机产生6位随机数
        $strCode = '';
        for($i=0;$i<=5;$i++) {
            $strCode .= $str_3[mt_rand(0,9)];
        }
        return $strCode;
    }





 public function sendCode() {
        $tel = $this->_param('tel');
                $sms = M('Sms');

        $authCode = $this->productCode();

        $content = '您好，感谢您对本站的支持，您本次的随机验证码如下：';
        $content .= $authCode . ',请即刻验证！';


        $errorCode = $this->sms_sending($this->_param('mid'),$tel,$content);


        if($errorCode > 0) {
            $data['status'] = 1;
            $error =0;
            $msg = "手机验证码已发送至您手机，请注意查收!";
        } else if ($errorCode == -4) {
            $data['status'] = 0;
            $error = 1;
            $msg = "手机号码格式不正确！";
        }

        $data['vid'] = $this->_param('vid');
        $data['mid'] = $this->_param('mid');
        $data['code'] = $authCode;
        $data['mobile'] = $this->_param('tel');
        $data['addtime'] = time();
        $data['result'] = $errorCode;
         $sms->add($data);


        $this->ajaxReturn(array(
            'error'     => $error,
            'message'   =>$msg,
        ));
    }






	//短信发送
	//返回1为发送成功！
	function sms_sending($mid,$mobile,$content){
	    $content=preg_replace("/\s/","",$content);
	    $content = iconv("UTF-8","gb2312",$content);
	    $url = "http://sms.webchinese.cn/web_api/?Uid=metisteam@meishuquan.net&Key=1228f27af1f6dc4d0d25&smsMob=".$mobile."&smsText=".$content; //这里我这是测试例子，你们应该换成你们的，
	    if(function_exists('file_get_contents'))
	    {
	        $file_contents = file_get_contents($url);
	    }
	    else
	    {
	        $ch = curl_init();
	        $timeout = 5;
	        curl_setopt ($ch, CURLOPT_URL, $url);
	        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
	        curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
	        $file_contents = curl_exec($ch);
	        curl_close($ch);
	    }
	    //echo $url;
	    //echo $file_contents;
	    return $file_contents;
	}
}

?>
