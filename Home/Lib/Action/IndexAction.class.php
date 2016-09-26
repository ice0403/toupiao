<?php







class IndexAction extends Action {

    function _initialize() {
    	/*
        $agent = $_SERVER['HTTP_USER_AGENT'];
        if(!strpos($agent,"icroMessenger")) {
            echo '此功能只能在微信浏览器中使用';exit;
        }
        */

        //流量保护
        // if($_GET['id'] && $_GET['vid']){
        	 //$t = time();
         //	$t1 = $t - 30;
		 //	$tmp1 =  M("Vote_record")->where('vid='.$this->_param('id').' and form_id='.$this->_param('vid').' and addtime<'.$t.' and addtime>'.$t1)->count();
           //  if($tmp1>12){
               //  M("Form")->where("id=".$this->_param('vid'))->data(array("status"=>0))->save();
			 //	echo "<h1>error:该选手被系统监测出作弊行为，已下线。</h1>";
			 //	exit;
		 //	}
    //     }
        //END 流量保护


        import('@.ORG.Util.Cookie');
	}
	// 框架首页

	public function index() {

		if($this->_param('token') && $this->_param('token')){
			Cookie::set('token_'.$this->_param('id'),$this->_param('token'),C("cookie_time"));
			Cookie::set('wecha_id_'.$this->_param('id'),$this->_param('wecha_id'),C("cookie_time"));
		}


		$time = time();

		$model = M ( "Vote");

		$vo = $model->where ("id = ". $this->_param('id') ." and status=1 " )->find();
        if(!$vo){
			$this->error('投票不存在，或者过期！');
            exit();
		}
        $start = $vo['statdate'];
        $end = $vo['enddate'];
		if($start > $time){
			//$this->error('投票未开始！');
            //exit();
    		$this->assign ( 'msg', '投票未开始' );
		}
        elseif( $end < $time){
			//$this->error('投票已过期！');
            //exit();
    		$this->assign ( 'msg', '投票已结束' );
		}

		//member expried
		$member = M("Member")->where('m_id='.$vo['mid'])->find();
		$m_start = strtotime($member['m_startdate']);
		$m_end = strtotime($member['m_enddate']);
		if($m_start > time() || $m_end < time()){
			//$this->error('账号过期或未开放，请联系管理员！');
			//exit();
    		$this->assign ( 'msg', '账号过期或未开放，请联系管理员！' );
		}
		if($member['m_status'] == 0){
			$this->error('账号已停用，请联系管理员！');
			exit();
		}
		$this->assign ( 'member', $member );


		if($member['m_web_auth'] == 1){
			$token = Cookie::get('token_'.$this->_param('id'));
			$wecha_id = Cookie::get('wecha_id_'.$this->_param('id'));
			if(empty($token) && empty($wecha_id)){
				if(empty($_GET['auth'])){ //web网页授权
					header('Location: https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$member['m_appid'].'&redirect_uri='.C("site_url").'/oauth2.php&response_type=code&scope=snsapi_userinfo&state='.$this->_param('id').'A'.$member['m_id'].'#wechat_redirect');
					exit;
				}
			}
		}


		$vo['uptime'] = $vo['enddate'] * 1000;

		$count = M ( "Form")->where("vid=".$this->_param('id'))->count();

		$vo['person']  = $count;

		$vo['tickets'] = 0;



		$Model = new Model();

		$vo1 = $Model->query("select sum(ticket) as a  from ".C("DB_PREFIX")."form  where vid=".$this->_param('id'));

		 if($vo1){

			   $vo['tickets'] = $vo1[0]['a'];

		 }





		$this->assign ( 'vo', $vo );



		//add click

		$Model = new Model();

		$Model->execute("update ".C("DB_PREFIX")."vote  set count=count+1 where id=".$this->_param('id'));



		//ad

		$ad = M("Ad")->where("vid=".$this->_param('id').' and display=1')->order("addtime desc")->limit("0,10")->select();

		$this->assign ( 'ad', $ad );










		//列表过滤器，生成查询Map对象

				$map = array();

				$map['vid'] = array('eq',$this->_param("id"));

				$map['status'] = array('eq',1);
                if($vo['isPay']){
                    $map['isPay'] = array('eq',1);
                }



                if($_GET['gid']){
                    $map['gid'] = array('eq',$_GET['gid']);
                }

				//读取数据库模块列表生成菜单项

				$model = M ("Form" );



				//排序字段 默认为主键名

				$_REQUEST ['_order'] = "ticket";

				if (!empty ( $_REQUEST ['_order'] )) {

					$order = $_REQUEST ['_order'];

				} else {

					$order = ! empty ( $sortBy ) ? $sortBy : 'ticket';

				}


				//排序方式默认按照倒序排列

				//接受 sost参数 0 表示倒序 非0都 表示正序

				if (isset ( $_REQUEST ['_sort'] )) {

		//			$sort = $_REQUEST ['_sort'] ? 'asc' : 'desc';

					$sort = $_REQUEST ['_sort'] == 'asc' ? 'asc' : 'desc'; //zhanghuihua@msn.com

				} else {

					$sort = $asc ? 'asc' : 'desc';

				}

				//取得满足条件的记录数

				$count = $model->where ( $map )->count ();

				if ($count > 0) {

					import ( "@.ORG.Util.Page" );
					//创建分页对象
					if (! empty ( $_REQUEST ['listRows'] )) {
						$listRows = $_REQUEST ['listRows'];
					} else {
						$listRows = '';
					}

					$p = new Page ( $count, $listRows );

					//分页查询数据

					$voList = $model->where($map)->order( "`" . $order . "` " . $sort)->limit($p->firstRow . ',' . $p->listRows)->select ( );

					$list = array();
					$tmp = array();
					foreach($voList as $val){
						$tmp[$val[id]] = $val[id];
						$list[] = $val;
					}
					$tmp2 = $this->_param('s');
					if(!empty($tmp2)){
						if(!array_search($tmp2,$tmp)){
							$tmp3 = M ("Form" )->where('id='.$tmp2)->find();
							$list[] = $tmp3;
						}
					}



					//echo $model->getlastsql();

					//分页跳转的时候保证查询条件

					foreach ( $map as $key => $val ) {

						if (! is_array ( $val )) {

							$p->parameter .= "$key=" . urlencode ( $val ) . "&";

						}

					}

					//分页显示

					$page = $p->show ();

					//列表排序显示

					$sortImg = $sort; //排序图标

					$sortAlt = $sort == 'desc' ? '升序排列' : '倒序排列'; //排序提示

					$sort = $sort == 'desc' ? 1 : 0; //排序方式



					//模板赋值显示

					$this->assign ( 'list', $list );

					$this->assign ( 'sort', $sort );

					$this->assign ( 'order', $order );

					$this->assign ( 'sortImg', $sortImg );

					$this->assign ( 'sortType', $sortAlt );

					$this->assign ( "page", $page );

				}





				//zhanghuihua@msn.com

				$this->assign ( 'totalCount', $count );

				$this->assign ( 'totalPages', $p->totalPages );

				$this->assign ( 'numPerPage', $p->listRows );

				$this->assign ( 'currentPage', !empty($_REQUEST[C('VAR_PAGE')])?$_REQUEST[C('VAR_PAGE')]:1);


				$subscribe = 0;
				//判断是否关注
				$wecha_id =  Cookie::get('wecha_id_'.$this->_param('id'));
				if($member['m_appid'] && $member['m_appsecret'] && $wecha_id && $member['m_isConnent']){

					require_once "../Public/weixin/jssdk.php";
					$jssdk = new JSSDK($member['m_appid'], $member['m_appsecret']);
					$signPackage = $jssdk->GetSignPackage();
					$res = json_decode(file_get_contents("access_token-".$member['m_appid'].".json"),true);

					//var_dump($res);
					if(!isset($res['errcode'])){
						$access_token = $res['access_token'];
						$res1 = json_decode(httpGet("https://api.weixin.qq.com/cgi-bin/user/info?access_token=".$access_token."&openid=".$wecha_id),true);
					//var_dump($res1);
					if(!isset($res1['errcode'])){
							//Cookie::set('token_'.$this->_param('id'),'',-3600);
							//Cookie::set('wecha_id_'.$this->_param('id'),'',-3600);
                        $subscribe = $res1['subscribe'];

                        //weixin data
                        $userinfo = M("Userinfo")->where("wecha_id='".$wecha_id."'")->find();
                        $us['token'] = $token;
                        $us['wecha_id'] = $wecha_id;
                        $us['mid'] = $vo['mid'];
                        $us['wechaname'] = $res1['nickname'];
                        $us['sex'] = $res1['sex'];
                        $us['wechahead'] = $res1['headimgurl'];
                        $us['city'] = $res1['city'];
                        $us['province'] = $res1['province'];
                        $us['country'] = $res1['country'];
                        $us['subscribe_time'] = $res1['subscribe_time'];
                        if($userinfo){
                            $condition['id'] = $userinfo['id'];
                            M("Userinfo")->where($condition)->data($us)->save();
                        }else{
                            M("Userinfo")->data($us)->add();
                        }
                        //END



						}elseif($res1['errcode'] =="48001"){  //微信 未认证
							$subscribe = 1;
						}elseif($res1['errcode'] =="40001" || $res1['errcode'] =="42001"){
						    //access_token is invalid or not latest hint
						    //delete  access file
							unlink('access_token-'.$member['m_appid'].".json");
							unlink('jsapi_ticket-'.$member['m_appid'].".json");
							require_once "../Public/weixin/jssdk.php";
							$jssdk = new JSSDK($member['m_appid'], $member['m_appsecret']);
							$signPackage = $jssdk->GetSignPackage();
							$res = json_decode(file_get_contents("access_token-".$member['m_appid'].".json"),true);
							$access_token = $res['access_token'];
							$res1 = json_decode(httpGet("https://api.weixin.qq.com/cgi-bin/user/info?access_token=".$access_token."&openid=".$wecha_id),true);
							if(!isset($res1['errcode'])){
								$subscribe = $res1['subscribe'];
							}
						}
					}
				}
			   $this->assign ( 'subscribe', $subscribe);

				$template = M("Template")->where("status=1 and id=".$vo['template'])->find();
			    $this->assign ( 'template', $template);
				$this->display($template['folder'].'/index');

	}



public function search() {



		$time = time();

		$model = M ( "Vote");

		$vo = $model->where ("id = ". $this->_param('id') ." and status=1 and statdate<".$time." and enddate>".$time  )->find();



		if(!$vo){

			echo "[]";

		}

        $where = "vid=".$this->_param('id')." and status=1 and username like '%".$this->_param('term')."%'";
        if($vo['isPay']){
           $where .= " and isPay=1";
        }
		$list = M("Form")->where($where)->limit("0,10")->select();


		$str="";

		foreach($list as $v){

			$str.= json_encode($v['num']."号 ".$v['username']).",";

		}

		echo "[".trim($str,",")."]";





	}





public function search2() {

		$time = time();

		$model = M ( "Vote");

		$vo = $model->where ("id = ". $this->_param('id') ." and status=1 and statdate<".$time." and enddate>".$time  )->find();

		if(!$vo){

			echo "bb";

		}

		$name = $this->_param('name');
		$id = intval($name);
        $where = "vid=".$this->_param('id')." and status=1 and num = '".$id."'";
        if($vo['isPay']){
           $where .= " and isPay=1";
        }
		$vo = M("Form")->where($where)->find();
		if($vo){
			echo $vo['id']."|1";
		}else{
			echo "bb";
		}
	}





	public function rank() {



		$time = time();

		$model = M ( "Vote");

		$vo = $model->where ("id = ". $this->_param('id') ." and status=1 "  )->find();



		if(!$vo){

			$this->error('投票不存在！');

			exit();

		}

        $tmp = '';
        if($_GET['gid']){
            $tmp  = ' and gid='.$_GET['gid'];
        }


		$vo['uptime'] = $vo['enddate'] * 1000;



		$count = M ( "Form")->where("vid=".$this->_param('id'))->count();

		$vo['person']  = $count;

		$vo['tickets'] = 0;



		$Model = new Model();

		$vo1 = $Model->query("select sum(ticket) as a  from ".C("DB_PREFIX")."form  where vid=".$this->_param('id') . $tmp);

		 if($vo1){

			   $vo['tickets'] = $vo1[0]['a'];

		 }



		$this->assign ( 'vo', $vo );


		$listRows = 20;
		$list = M("Form")->where("vid=".$this->_param('id').' and status=1'.$tmp)->order("ticket desc")->limit("0,".$listRows)->select();
		$this->assign ( 'list', $list );

		$count = M("Form")->where("vid=".$this->_param('id').' and status=1'.$tmp)->count ();
		if ($count > 0) {
			import ( "@.ORG.Util.Page" );
			$p = new Page ( $count, $listRows );
		}
		$this->assign ( 'totalCount', $count );
		$this->assign ( 'totalPages', $p->totalPages );
		$this->assign ( 'numPerPage', $p->listRows );
		$this->assign ( 'currentPage', !empty($_REQUEST[C('VAR_PAGE')])?$_REQUEST[C('VAR_PAGE')]:1);


		$ad = M("Ad")->where("vid=".$this->_param('id').' and display=1')->order("addtime desc")->limit("0,10")->select();
		$this->assign ( 'ad', $ad );


	    $this->assign ( "subscribe", empty($_GET['subscribe'])?0:$_GET['subscribe']);

		$template = M("Template")->where("status=1 and id=".$vo['template'])->find();
	    $this->assign ( 'template', $template);
		$this->display($template['folder'].'/rank');

	}







	public function pageData() {



				//列表过滤器，生成查询Map对象

				$map = array();

				$map['vid'] = array('eq',$this->_param("id"));

				$map['status'] = array('eq',1);
                 if($_GET['gid']){
                    $map['gid'] = array('eq',$_GET['gid']);
                }


				$time = time();
				$model = M ( "Vote");
				$vo = $model->where ("id = ". $this->_param('id') ." and status=1 and statdate<".$time." and enddate>".$time  )->find();
				$this->assign ( 'vo', $vo );


				//member expried
				$member = M("Member")->where('m_id='.$vo['mid'])->find();
				$m_start = strtotime($member['m_startdate']);
				$m_end = strtotime($member['m_enddate']);
				if($m_start > time() || $m_end < time()){
					$this->error('账号过期或未开放，请联系管理员！');
					exit();
				}
				if($member['m_status'] == 0){
					$this->error('账号已停用，请联系管理员！');
					exit();
				}
				$this->assign ( 'member', $member );



				//读取数据库模块列表生成菜单项

				$model = M ("Form" );



				//排序字段 默认为主键名
				$_REQUEST ['_order'] = "ticket";



				if (!empty ( $_REQUEST ['_order'] )) {

					$order = $_REQUEST ['_order'];

				} else {

					$order = ! empty ( $sortBy ) ? $sortBy : 'ticket';

				}







				//排序方式默认按照倒序排列

				//接受 sost参数 0 表示倒序 非0都 表示正序

				if (isset ( $_REQUEST ['_sort'] )) {

		//			$sort = $_REQUEST ['_sort'] ? 'asc' : 'desc';

					$sort = $_REQUEST ['_sort'] == 'asc' ? 'asc' : 'desc'; //zhanghuihua@msn.com

				} else {

					$sort = $asc ? 'asc' : 'desc';

				}

				//取得满足条件的记录数

				$count = $model->where ( $map )->count ();

				if ($count > 0) {

					import ( "@.ORG.Util.Page" );

					//创建分页对象
					if (! empty ( $_REQUEST ['listRows'] )) {

						$listRows = $_REQUEST ['listRows'];

					} else {

						$listRows = '';

					}

					$p = new Page ( $count, $listRows );

					//分页查询数据

					$voList = $model->where($map)->order( "`" . $order . "` " . $sort)->limit($p->firstRow . ',' . $p->listRows)->select ( );



					//echo $model->getlastsql();

					//分页跳转的时候保证查询条件

					foreach ( $map as $key => $val ) {

						if (! is_array ( $val )) {

							$p->parameter .= "$key=" . urlencode ( $val ) . "&";

						}

					}

					//分页显示

					$page = $p->show ();

					//列表排序显示

					$sortImg = $sort; //排序图标

					$sortAlt = $sort == 'desc' ? '升序排列' : '倒序排列'; //排序提示

					$sort = $sort == 'desc' ? 1 : 0; //排序方式



					//模板赋值显示

					$this->assign ( 'list', $voList );

					$this->assign ( 'sort', $sort );

					$this->assign ( 'order', $order );

					$this->assign ( 'sortImg', $sortImg );

					$this->assign ( 'sortType', $sortAlt );

					$this->assign ( "page", $page );

				}





				//zhanghuihua@msn.com

				$this->assign ( 'totalCount', $count );

				$this->assign ( 'totalPages', $p->totalPages );

				$this->assign ( 'numPerPage', $p->listRows );

				$this->assign ( 'currentPage', !empty($_REQUEST[C('VAR_PAGE')])?$_REQUEST[C('VAR_PAGE')]:1);


				$this->assign ( "subscribe", $_GET['subscribe']);
				$template = M("Template")->where("status=1 and id=".$vo['template'])->find();
			    $this->assign ( 'template', $template);
				$this->display($template['folder'].'/pageData');

	}




	public function content() {



		$time = time();

		$model = M ( "Vote");

		$vo = $model->where ("id = ". $this->_param('id') ." and status=1 and statdate<".$time." and enddate>".$time  )->find();



		if(!$vo){

			$this->error('投票不存在，或者过期！');

			exit();

		}

		$count = M ( "Form")->where("vid=".$this->_param('id'))->count();

		$vo['person']  = $count;

		$vo['tickets'] = 0;

		$Model = new Model();

		$vo1 = $Model->query("select sum(ticket) as a  from ".C("DB_PREFIX")."form  where vid=".$this->_param('id'));

		 if($vo1){

			   $vo['tickets'] = $vo1[0]['a'];

		 }

		//member expried
		$member = M("Member")->where('m_id='.$vo['mid'])->find();
		$m_start = strtotime($member['m_startdate']);
		$m_end = strtotime($member['m_enddate']);
		if($m_start > time() || $m_end < time()){
			$this->error('账号过期或未开放，请联系管理员！');
			exit();
		}
		if($member['m_status'] == 0){
			$this->error('账号已停用，请联系管理员！');
			exit();
		}
		$this->assign ( 'member', $member );


				$subscribe = 0;
				//判断是否关注
				$wecha_id =  Cookie::get('wecha_id_'.$this->_param('id'));
				if($member['m_appid'] && $member['m_appsecret'] && $wecha_id && $member['m_isConnent']){

					require_once "../Public/weixin/jssdk.php";
					$jssdk = new JSSDK($member['m_appid'], $member['m_appsecret']);
					$signPackage = $jssdk->GetSignPackage();
					$res = json_decode(file_get_contents("access_token-".$member['m_appid'].".json"),true);

					//var_dump($res);
					if(!isset($res['errcode'])){
						$access_token = $res['access_token'];
						$res1 = json_decode(httpGet("https://api.weixin.qq.com/cgi-bin/user/info?access_token=".$access_token."&openid=".$wecha_id),true);
					//var_dump($res1);
					if(!isset($res1['errcode'])){
							//Cookie::set('token_'.$this->_param('id'),'',-3600);
							//Cookie::set('wecha_id_'.$this->_param('id'),'',-3600);
							$subscribe = $res1['subscribe'];
						}elseif($res1['errcode'] =="48001"){  //微信 未认证
							$subscribe = 1;
						}elseif($res1['errcode'] =="40001" || $res1['errcode'] =="42001"){
						    //access_token is invalid or not latest hint
						    //delete  access file
							unlink('access_token-'.$member['m_appid'].".json");
							unlink('jsapi_ticket-'.$member['m_appid'].".json");
							require_once "../Public/weixin/jssdk.php";
							$jssdk = new JSSDK($member['m_appid'], $member['m_appsecret']);
							$signPackage = $jssdk->GetSignPackage();
							$res = json_decode(file_get_contents("access_token-".$member['m_appid'].".json"),true);
							$access_token = $res['access_token'];
							$res1 = json_decode(httpGet("https://api.weixin.qq.com/cgi-bin/user/info?access_token=".$access_token."&openid=".$wecha_id),true);
							if(!isset($res1['errcode'])){
								$subscribe = $res1['subscribe'];
							}
						}
					}
				}
			   $this->assign ( 'subscribe', $subscribe);

		if($member['m_isConnent'] === '0'){
			$this->assign ( 'subscribe', 1 );
		}

		if(!empty($_GET['keyword'])){
		   $where = "vid=".$this->_param('id')." and (num = '".trim($this->_param("keyword"))."' or username='".trim($this->_param("keyword"))."') and status=1";
		}else{
		   $where = "id=".$this->_param('fid')." and status=1";
        }

        if($vo['isPay']){
             $where .= " and isPay=1";
        }


		$form = M ( "Form")->where($where)->find();
		$this->assign ( 'form', $form );

		//ad

		$ad = M("Ad")->where("vid=".$this->_param('id').' and display=1')->order("addtime desc")->limit("0,10")->select();

		$this->assign ( 'ad', $ad );



		$this->assign ( 'vo', $vo );




         //add click
        $Model = new Model();
        $Model->execute("update ".C("DB_PREFIX")."form  set view=view+1 where id=".$this->_param('fid'));


        $template = M("Template")->where("status=1 and id=".$vo['template'])->find();
        $this->assign ( 'template', $template);
        $this->display($template['folder'].'/content');



	}









	public function signup() {



		$time = time();

		$model = M ( "Vote");

		$vo = $model->where ("id = ". $this->_param('id') ." and status=1 and statdate<".$time." and enddate>".$time  )->find();



		if(!$vo){

			$this->error('投票不存在，或者过期！');

			exit();

		}


		//member expried
		$member = M("Member")->where('m_id='.$vo['mid'])->find();
		$m_start = strtotime($member['m_startdate']);
		$m_end = strtotime($member['m_enddate']);
		if($m_start > time() || $m_end < time()){
			$this->error('账号过期或未开放，请联系管理员！');
			exit();
		}
		if($member['m_status'] == 0){
			$this->error('账号已停用，请联系管理员！');
			exit();
		}
		$this->assign ( 'member', $member );



		$tmp = M("Userinfo")->where("token='".$this->_param('token')."' and wecha_id='".$this->_param('wecha_id')."'")->find();

		if($tmp){
			Cookie::set('token_'.$this->_param('id'),$this->_param('token'),C("cookie_time"));
			Cookie::set('wecha_id_'.$this->_param('id'),$this->_param('wecha_id'),C("cookie_time"));
		}


		$this->assign ( 'subscribe', $_GET['subscribe'] );
		if($member['m_isConnent'] === '0'){
			$this->assign ( 'subscribe', 1 );
		}









		$count = M ( "Form")->where("vid=".$this->_param('id'))->count();

		$vo['count']  = $count;





		//ad

		$ad = M("Ad")->where("vid=".$this->_param('id').' and display=1')->order("addtime desc")->limit("0,10")->select();

		$this->assign ( 'ad', $ad );



		$this->assign ( 'vo', $vo );






		$template = M("Template")->where("status=1 and id=".$vo['template'])->find();
	    $this->assign ( 'template', $template);
		$this->display($template['folder'].'/signup');

	}





	public function record() {



		if(!$this->_param('sid')){

			header('Location: /User/');

			exit;

		}



		$model = M ( "Soli");

		$soli = $model->where ( "s_id=".$this->_param('sid') )->find();

		$this->assign ( 'soli', $soli );



		$this->display ();

	}











public function vote(){

		$time = time();
		$vote = M("Vote")->where ("id = ". $this->_param('id') ." and status=1 and statdate<".$time." and enddate>".$time)->field('wx_url,prevent,cknums,mid,jump,hour,allperson,nativeplace,v_startdate,v_enddate,isVerify')->find();
		if(!$vote){
			$this->error('投票不存在，或者过期！');
			exit();
		}


		$tmp3 = time();
		if($vote['v_startdate'] > 0 && $vote['v_enddate'] > 0){
			if($vote['v_startdate']< $tmp3 && $vote['v_enddate'] > $tmp3){

			}else{
				$this->error('不能投票，投票时间未开放!');
				exit();
			}
		}

		if($vote['isVerify']){
			$verify = $_GET['verify'];
			if(md5($verify) != $_SESSION['lrVerify']){
				$this->error('投票失败，验证码错误!');
				exit();
			}
		}


		$token = Cookie::get('token_'.$this->_param('id'));
		$wecha_id = Cookie::get('wecha_id_'.$this->_param('id'));
		$member = M("Member")->where('m_id='.$vote['mid'])->field('m_isConnent,m_appid,m_appsecret,m_wxname,m_startdate,m_enddate,m_status')->find();

		$m_start = strtotime($member['m_startdate']);
		$m_end = strtotime($member['m_enddate']);
		if($m_start > time() || $m_end < time()){
			$this->error('账号过期或未开放，请联系管理员！');
			exit();
		}
		if($member['m_status'] == 0){
			$this->error('账号已停用，请联系管理员！');
			exit();
		}


		if( ($token && $wecha_id) || $member['m_isConnent'] === '0' ){
			$ip = get_client_ip();

			$dd = 3600*intval($vote['hour']);

			if($member['m_isConnent'] === '0'){ //不关注微信号，按ip判断

				if($vote['allperson']){
					$tmp1 =  M("Vote_record")->where('form_id='.$this->_param('vid').' and ip=\''.$ip.'\' and addtime+'.$dd.' >'.time())->count();
					if($tmp1>0){
						C('sitename',$member['m_wxname']);
						$this->error('投票失败，在规定时间内不能重复投给同一个人','__URL__/index/id/'.$this->_param('id').'.html');
					}
				}

				$tmp =  M("Vote_record")->where('vid='.$this->_param('id').' and ip=\''.$ip.'\'  and addtime+'.$dd.' >'.time())->count();
				if($tmp > $vote['cknums'] ){
					C('sitename',$member['m_wxname']);
					$this->error('投票失败，您已超过每天投票次数','__URL__/index/id/'.$this->_param('id').'.html');
				}


			}else{

            //判断微信ID是否存在，防止有人恶意篡改cookie
            $userinfo = M("Userinfo")->where("wecha_id='".$wecha_id."'")->field("id")->find();
            if(!$userinfo  || empty($wecha_id)){
                $this->error('投票失败，非法wecha_id','__URL__/index/id/'.$this->_param('id').'.html');
            }
            //END

				if($vote['prevent']){
					//24点来计算
					date_default_timezone_set('PRC');
					$dd = strtotime(date("Y-m-d"));
					$dd2 = $dd+86399;
					$tmp =  M("Vote_record")->where('vid='.$this->_param('id').' and token=\''.$token.'\' and wecha_id=\''.$wecha_id.'\' and addtime>'.$dd.' and addtime<'.$dd2)->count();
					if($tmp >= $vote['cknums'] ){
						C('sitename',$member['m_wxname']);
						$this->error('投票失败，您已超过投票次数！','__URL__/index/id/'.$this->_param('id').'.html');
					}

					if($vote['allperson']){
						$tmp1 =  M("Vote_record")->where('form_id='.$this->_param('vid').' and token=\''.$token.'\' and wecha_id=\''.$wecha_id.'\' and addtime>'.$dd.' and addtime<'.$dd2)->count();
						if($tmp1>0){
							C('sitename',$member['m_wxname']);
							$this->error('投票失败，在规定时间内不能重复投给同一个人','__URL__/index/id/'.$this->_param('id').'.html');
						}
					}

				}else{

					$tmp =  M("Vote_record")->where('vid='.$this->_param('id').' and token=\''.$token.'\' and wecha_id=\''.$wecha_id.'\' and addtime+'.$dd.' >'.time())->count();
					if($tmp >= $vote['cknums']){
						C('sitename',$member['m_wxname']);
						$this->error('投票失败，您已超过投票次数','__URL__/index/id/'.$this->_param('id').'.html');
					}

					if($vote['allperson']){
						$tmp1 =  M("Vote_record")->where('form_id='.$this->_param('vid').' and token=\''.$token.'\' and wecha_id=\''.$wecha_id.'\' and addtime+'.$dd.' >'.time())->count();
						if($tmp1>0){
							C('sitename',$member['m_wxname']);
							$this->error('投票失败，在规定时间内不能重复投给同一个人','__URL__/index/id/'.$this->_param('id').'.html');
						}
					}

				}


			}

			//投票地区判断
			if(!empty($vote['nativeplace'])){
				$currnet_ip = get_client_ip();
				$result = file_get_contents("http://api.map.baidu.com/location/ip?ip=".$currnet_ip."&coor=bd09ll&ak=MxEpomRtabSjLAEe1KDFjwo5");
				$result = json_decode($result,true);
				if($result['status'] ==0){
					$location = $result['content']['address_detail'];
					$nat = M("Sys_enum")->where("evalue='".$vote['nativeplace']."'")->field("ename")->find();
					if(!in_array($nat['ename'],$location)){
						C('sitename',$member['m_wxname']);
						$this->error('投票失败，所在地区不在投票范围内','__URL__/index/id/'.$this->_param('id').'.html');
					}
				}
			}


			//add click
			$Model = new Model();
			$result1 = $Model->execute("update ".C("DB_PREFIX")."form  set ticket=ticket+1 where status=1 and id=".$this->_param('vid'));

			//weixin data
			if($member['m_appid'] && $member['m_appsecret'] && $wecha_id && $member['m_isConnent'] ){

			      require_once "../Public/weixin/jssdk.php";
			      $jssdk = new JSSDK($member['m_appid'], $member['m_appsecret']);
			      $signPackage = $jssdk->GetSignPackage();
				  $res = json_decode(file_get_contents("access_token-".$member['m_appid'].".json"),true);

				if(!isset($res['errcode'])){
					$access_token = $res['access_token'];
					$res1 = json_decode(httpGet("https://api.weixin.qq.com/cgi-bin/user/info?access_token=".$access_token."&openid=".$wecha_id),true);
					if(!isset($res1['errcode'])){
						$userinfo = M("Userinfo")->where("wecha_id='".$wecha_id."'")->find();
						$us['token'] = $token;
						$us['wecha_id'] = $wecha_id;
						$us['mid'] = $vote['mid'];
						$us['wechaname'] = $res1['nickname'];
						$us['sex'] = $res1['sex'];
						$us['wechahead'] = $res1['headimgurl'];
						$us['city'] = $res1['city'];
						$us['province'] = $res1['province'];
						$us['country'] = $res1['country'];
						$us['subscribe_time'] = $res1['subscribe_time'];
						if($userinfo){
							$condition['id'] = $userinfo['id'];
							M("Userinfo")->where($condition)->data($us)->save();
						}else{
							M("Userinfo")->data($us)->add();
						}
					}
				}
			}

            if($result1){
                    $record = M("Vote_record");
                    $data['form_id'] = $this->_param('vid');
                    $data['vid'] = $this->_param('id');
                    $data['token'] = $token;
                    $data['wecha_id'] = $wecha_id;
                    $data['addtime'] = time();
                    $data['ip'] = $ip;
                    $data['mid'] = $vote['mid'];
                    $record->add($data);
                    if($vote['jump']){
                        C('sitename',$member['m_wxname']);
                        $this->success('投票成功！',$vote['jump']);
                    }else{
                        C('sitename',$member['m_wxname']);
                        $this->success('投票成功！','__URL__/index/id/'.$this->_param('id').'.html');
                    }
                }else{
                        C('sitename',$member['m_wxname']);
                        $this->error('投票失败！选手未审核','__URL__/index/id/'.$this->_param('id').'.html');
                    }
		}else{

			$this->error('请先关注微信公众号',$vote['wx_url']);

		}



}




public function addView(){
	$model = M ("Form");
	$model->where("id=".$this->_param("id"))->setInc('view');
}




public function insertform(){

        C('TOKEN_ON',false);
		$model = M("Form");
		if(!$this->_param("username")){
			$this->error('提交失败！用户名不能为空！');
		}
		
		if(!$this->_param("tel")){
			$this->error('提交失败！电话不能为空！');
		}

		if(!preg_match("/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/",$this->_param("tel"))){    
		   $this->error('提交失败！手机号格式有误！');
		}
		//验证码
		$sms = M("Sms")->where("vid=".$this->_param("vid")." and code='".$this->_param("code")."' and status=1 and mobile='".$this->_param("tel")."'")->order("addtime desc")->count();
		if($sms<1){
		    $this->error('手机验证码不正确');
		}
		//END 验证码
		/*
        $tmp = $model->where("tel='".$this->_param("tel")."' and vid='".$this->_param("vid")."'")->find();
		if($tmp){
			if($this->_param("is_ajax")){
				echo '{"message":"提交失败！该电话已存在!","code":"0"}';
				exit;
			}
			$this->error('提交失败！该电话已存在！');
		}
		*/
		
		if(empty($_POST['avatar'])){
			if($this->_param("is_ajax")){
				echo '{"message":"提交失败！必须上传一张头像！","code":"0"}';
				exit;
			}
	        $this->error('提交失败！必须上传一张头像！');
	    }
	
	    if(empty($_POST['picurl'])){
			if($this->_param("is_ajax")){
				echo '{"message":"提交失败！必须上传一张作品！","code":"0"}';
				exit;
			}
	        $this->error('提交失败！必须上传一张作品！');
	    }

		if(!$model->create()) {
			if($this->_param("is_ajax")){
				echo '{"message":"'.$model->geterror().'","code":"0"}';
				exit;
			}
			$this->error($model->geterror());
		}else{

        import('@.ORG.Util.imgExif');
	    $i = new imgexif();
	    if(!empty($_POST['picurl'])){
			$tmp = str_replace("thumb_", "", $_POST['picurl']);
			$arr = $i->getimginfo($tmp,'common','1');
			$model->p_make = empty($arr['制造商'])?"":$arr['制造商'];
			$model->p_date = empty($arr['拍摄时间'])?"":$arr['拍摄时间'];
			$model->p_model = empty($arr['型号'])?"":$arr['型号'];
		}


	    if(!empty($_POST['picurl1'])){
			$tmp = str_replace("thumb_", "", $_POST['picurl1']);
			$arr = $i->getimginfo($tmp,'common','1');
			$model->p_make1 = empty($arr['制造商'])?"":$arr['制造商'];
			$model->p_date1 = empty($arr['拍摄时间'])?"":$arr['拍摄时间'];
			$model->p_model1 = empty($arr['型号'])?"":$arr['型号'];

		}
	    if(!empty($_POST['picurl2'])){
			$tmp = str_replace("thumb_", "", $_POST['picurl2']);
			$arr = $i->getimginfo($tmp,'common','1');
			$model->p_make2 = empty($arr['制造商'])?"":$arr['制造商'];
			$model->p_date2 = empty($arr['拍摄时间'])?"":$arr['拍摄时间'];
			$model->p_model2 = empty($arr['型号'])?"":$arr['型号'];

		}
	    if(!empty($_POST['picurl3'])){
			$tmp = str_replace("thumb_", "", $_POST['picurl3']);
			$arr = $i->getimginfo($tmp,'common','1');
			$model->p_make3 = empty($arr['制造商'])?"":$arr['制造商'];
			$model->p_date3 = empty($arr['拍摄时间'])?"":$arr['拍摄时间'];
			$model->p_model3 = empty($arr['型号'])?"":$arr['型号'];

		}

		if(!empty($_POST['picurl4'])){
			$tmp = str_replace("thumb_", "", $_POST['picurl4']);
			$arr = $i->getimginfo($tmp,'common','1');
			$model->p_make4 = empty($arr['制造商'])?"":$arr['制造商'];
			$model->p_date4 = empty($arr['拍摄时间'])?"":$arr['拍摄时间'];
			$model->p_model4 = empty($arr['型号'])?"":$arr['型号'];
		}


			$num = M("Form")->where("vid=".$this->_param("vid"))->max('num');
			if(!empty($num)){
				$num = intval($num) + 1;
				$model->num = $num;
			}else{
				$model->num = 1;
			}

			$vote = M("Vote")->where("id=".$this->_param("vid"))->field("mid,ischeck,isPay,price")->find();
			$model->status = empty($vote['ischeck'])?1:0;

            $model->info = str_replace(array("\r\n", "\r", "\n"), '',$this->_param("info"));
			$model->addtime = time();

			if($result	 =	 $model->add()) {
				$member = M("Member")->where('m_id='.$vote['mid'])->field('m_isconnent,m_appid,m_appsecret,m_wxname')->find();

				//保存多媒体文件
				if(!empty($_POST['record_id'])){
					$media = $_POST['record_id'];
					if(!strstr($media, 'serverId')){
						if($member['m_appid'] && $member['m_appsecret']){
						  //由于录音连接上传三次后 token 总是失效
						  unlink('access_token-'.$member['m_appid'].".json");
						  unlink('jsapi_ticket-'.$member['m_appid'].".json");

							require_once "../Public/weixin/jssdk.php";
							$jssdk = new JSSDK($member['m_appid'], $member['m_appsecret']);
							$signPackage = $jssdk->GetSignPackage();
							$res = json_decode(file_get_contents("access_token-".$member['m_appid'].".json"),true);

							if(!isset($res['errcode'])){
								$access_token = $res['access_token'];
								file_put_contents($media.".amr", fopen("http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=".$access_token."&media_id=".$media, 'r'));
                                if(file_exists($media.".amr")){
                                    define('FFMPEG_LIBRARY', '/usr/local/bin/ffmpeg ');
                                    $exec_string = FFMPEG_LIBRARY.' -i '.$media.'.amr '.$media.'.mp3';
                                    system($exec_string);

                                    //update recording
                                    if(file_exists($media.".mp3")){
            							$us['recording'] = C("site_url").'/Home/'.$media.".mp3";
										M("Form")->where("id=".$result)->data($us)->save();
                                    }
                                 }
                              }


						}
					}
				}
				//END


				if($this->_param("is_ajax")){
					echo '{"message":"添加成功!","code":"1","media":"http://file.api.weixin.qq.com/cgi-bin/media/get?access_token='.$access_token.'&media_id='.$media.'"}';
					exit;
				}

                if($vote['isPay']){
                    header("Location: /Home/index.php?m=Index&a=pay&id=".$this->_param("vid")."&mid=".$vote['mid']."&fid=".$result."&price=".$vote['price']."&type=1&num=1");
                exit;
                }


				if($this->_param("jumpUrl")){
					$jumpUrl = $this->_param("jumpUrl");
					$this->success('提交成功！',$jumpUrl);
				}else{
					$this->success('提交成功,等待审核！！');
				}
			}else{

				if($this->_param("is_ajax")){
					echo '{"message":"提交失败!","code":"0"}';
					exit;
				}
				$this->error('提交失败！');
			}
	    }

}

public function insertformcopy(){

        C('TOKEN_ON',false);
		$model = M("Form");
		if(!$this->_param("username")){
			$this->error('提交失败！用户名不能为空！');
		}
		
		if(!$this->_param("tel")){
			$this->error('提交失败！电话不能为空！');
		}

		if(!preg_match("/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/",$this->_param("tel"))){    
		   $this->error('提交失败！手机号格式有误！');
		}
		
		//验证码
		$sms = M("Sms")->where("vid=".$this->_param("vid")." and code='".$this->_param("code")."' and status=1 and mobile='".$this->_param("tel")."'")->order("addtime desc")->count();
		if($sms<1){
		    $this->error('手机验证码不正确');
		}
		//END 验证码
		
		$_POST['ticket_code'] = $this->getRandomString(6);
		$model->ticket_code = $_POST['ticket_code'];

		if(!$model->create()) {
			if($this->_param("is_ajax")){
				echo '{"message":"'.$model->geterror().'","code":"0"}';
				exit;
			}
			$this->error($model->geterror());
		}else{
			$num = M("Form")->where("vid=".$this->_param("vid"))->max('num');
			if(!empty($num)){
				$num = intval($num) + 1;
				$model->num = $num;
			}else{
				$model->num = 1;
			}

			$vote = M("Vote")->where("id=".$this->_param("vid"))->field("mid,ischeck,isPay,price")->find();
			$model->status = empty($vote['ischeck'])?1:0;

            $model->info = str_replace(array("\r\n", "\r", "\n"), '',$this->_param("info"));
			$model->addtime = time();

			if($result	 =	 $model->add()) {
				$member = M("Member")->where('m_id='.$vote['mid'])->field('m_isconnent,m_appid,m_appsecret,m_wxname')->find();

				//保存多媒体文件
				if(!empty($_POST['record_id'])){
					$media = $_POST['record_id'];
					if(!strstr($media, 'serverId')){
						if($member['m_appid'] && $member['m_appsecret']){
						  //由于录音连接上传三次后 token 总是失效
						  unlink('access_token-'.$member['m_appid'].".json");
						  unlink('jsapi_ticket-'.$member['m_appid'].".json");

							require_once "../Public/weixin/jssdk.php";
							$jssdk = new JSSDK($member['m_appid'], $member['m_appsecret']);
							$signPackage = $jssdk->GetSignPackage();
							$res = json_decode(file_get_contents("access_token-".$member['m_appid'].".json"),true);

							if(!isset($res['errcode'])){
								$access_token = $res['access_token'];
								file_put_contents($media.".amr", fopen("http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=".$access_token."&media_id=".$media, 'r'));
                                if(file_exists($media.".amr")){
                                    define('FFMPEG_LIBRARY', '/usr/local/bin/ffmpeg ');
                                    $exec_string = FFMPEG_LIBRARY.' -i '.$media.'.amr '.$media.'.mp3';
                                    system($exec_string);

                                    //update recording
                                    if(file_exists($media.".mp3")){
            							$us['recording'] = C("site_url").'/Home/'.$media.".mp3";
										M("Form")->where("id=".$result)->data($us)->save();
                                    }
                                 }
                              }


						}
					}
				}
				//END


				if($this->_param("is_ajax")){
					echo '{"message":"添加成功!","code":"1","media":"http://file.api.weixin.qq.com/cgi-bin/media/get?access_token='.$access_token.'&media_id='.$media.'"}';
					exit;
				}

                if($vote['isPay']){
                    header("Location: /Home/index.php?m=Index&a=pay&id=".$this->_param("vid")."&mid=".$vote['mid']."&fid=".$result."&price=".$vote['price']."&type=1&num=1");
                exit;
                }


				if($this->_param("jumpUrl")){
					$jumpUrl = $this->_param("jumpUrl");
					$this->success('提交成功！',$jumpUrl);

				}else{
					$this->success('提交成功,等待审核！！');
				}
			}else{

				if($this->_param("is_ajax")){
					echo '{"message":"提交失败!","code":"0"}';
					exit;
				}
				$this->error('提交失败！');
			}
	    }
}
	public function getRandomString($len, $chars=null){
        if (is_null($chars)){
            //$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            //生成小写和数字 去除相似
            $chars = "abcdefghjkmnopqrstuvwxyz023456789";
        }
        mt_srand(10000000*(double)microtime());
        for ($i = 0, $str = '', $lc = strlen($chars)-1; $i < $len; $i++){
            $str .= $chars[mt_rand(0, $lc)];  
        }
        return $str;
    }
	//短信发送
	//返回1为发送成功！
	function sms_sending_copy($mobile,$content){
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












//统计



public function analyse(){







	echo '{result:1,msg:"请求成功"}';







}









public function pay(){
                $model = M ( "Vote");
                $vo = $model->where ("id = ". $this->_param('id') ." and status=1 " )->find();
        if(!$vo){
                        $this->error('投票不存在，或者过期！');
            exit();
                }
        $template = M("Template")->where("status=1 and id=".$vo['template'])->find();
        $this->assign ( 'template', $template);
        $this->display($template['folder'].'/pay');
}





public function payVote(){
        $time = time();
        $vote = M("Vote")->where ("id = ". $this->_param('id') ." and status=1 and statdate<".$time." and enddate>".$time)->find();
        if(!$vote){
            $this->error('投票不存在111，或者过期！');
            exit();
        }

        $token = Cookie::get('token_'.$this->_param('id'));
        $wecha_id = Cookie::get('wecha_id_'.$this->_param('id'));

         //微信支付判断
        $pay = M("Member_operation")->where("out_trade_no='".$_GET['out_trade_no']."'  and sta=1 ")->find();
        if(!$pay){
            $this->error('失败，未支付','__URL__/index/id/'.$this->_param('id').'.html');
        }
        $tmp = M("Member_operation")->where("out_trade_no='".$_GET['out_trade_no']."' and sta=1 ")->save(array("form_id"=>$this->_param('vid'),"mid"=>$this->_param('mid')));

        $data['out_trade_no'] = $_GET['out_trade_no'];
        $tmp =  M("Member_operation")->where("out_trade_no='".$_GET['out_trade_no']."' and sta=1")->count();  //防止android点返回再次增加票
        if($tmp > 1){
            $this->success('提交成功！',U("Index/index",array("id"=>$this->_param('id'))));
            exit;
        }

        $sql = "update ".C("DB_PREFIX")."form set isPay=1   where  id=".$this->_param('vid');
        //echo $sql;exit;

        $Model = new Model();
        $result1 = $Model->execute($sql);
		$send = M("Form")->where('id='.$_GET['vid'])->field('tel,ticket_code,ticket_code_status')->find();
		if(!empty($send['ticket_code']) && $send['ticket_code_status'] == 1){
			$content = '恭喜您已获得金笔奖入场票【1张】，购票码为：【'.$send['ticket_code'].'】。请您保存好此短信，当日持短信进入会场。';
			$this->sms_sending_copy($send['tel'],$content);
			$send['ticket_code_status'] = 2;
			$send->save();
		}	
        $this->success('提交成功！',U("Index/index",array("id"=>$this->_param('id'))));
        exit;

}



}







?>
