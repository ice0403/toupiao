<?php
  class PayAction extends CommonAction{




     public function index(){

	                        $model = M ("Member_operation" );
	                        //列表过滤器，生成查询Map对象
                            $map['mid'] = $_SESSION [C ( 'USER_AUTH_KEY' )];
                                //$map = $this->_search ();
                                if (method_exists ( $this, '_filter' )) {
                                        $this->_filter ( $map );
                                }
                            //读取数据库模块列表生成菜单项
                            $username = $this->_param('username');
                            if(!empty($username)){
                                $tmp = M("Form")->where("username='".$username."'")->field('id')->find();
                                $map['form_id'] = array('eq',$tmp['id']);
                            }
                            $buyid = $this->_param('buyid');
                            if(!empty($buyid)){
                                $map['buyid'] = array('eq',$buyid);
                            }

                                //排序字段 默认为主键名
                                if (!empty ( $_REQUEST ['_order'] )) {
                                        $order = $_REQUEST ['_order'];
                                } else {
                                        $order = ! empty ( $sortBy ) ? $sortBy : $model->getPk ();
                                }

                                //排序方式默认按照倒序排列
                                //接受 sost参数 0 表示倒序 非0都 表示正序
                                if (isset ( $_REQUEST ['_sort'] )) {
                //                      $sort = $_REQUEST ['_sort'] ? 'asc' : 'desc';
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
                                $this->assign ( 't',  $this->_param('t') );
                                $this->assign ( 'totalCount', $count );
                                $this->assign ( 'numPerPage', $p->listRows );
$this->assign ( 'totalPages', $p->totalPages );
                                $this->assign ( 'currentPage', !empty($_REQUEST[C('VAR_PAGE')])?$_REQUEST[C('VAR_PAGE')]:1);


                                $this->assign ( 'regis', $tmp);

                                Cookie::set ( '_currentUrl_', __SELF__ );
                                $this->display ();

         }



  }
?>
