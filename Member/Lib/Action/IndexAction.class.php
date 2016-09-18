<?php

class IndexAction extends CommonAction {


     public function index(){

        $model = M ("Member" );
        $member = $model->where('mid='.$_SESSION [C ( 'USER_AUTH_KEY' )])->find();
        $this->assign ( 'member', $member );


            $model = M ("Notice" );
            //排序字段 默认为主键名
            if (!empty ( $_REQUEST ['_order'] )) {
                    $order = $_REQUEST ['_order'];
            } else {
                    $order = ! empty ( $sortBy ) ? $sortBy : $model->getPk ();
            }

            $order = 'addtime';
            //排序方式默认按照倒序排列
            //接受 sost参数 0 表示倒序 非0都 表示正序
            if (isset ( $_REQUEST ['_sort'] )) {
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


            Cookie::set ( '_currentUrl_', __SELF__ );
            $this->display ();


     }







        public function getAPI(){
                switch ($_GET['type']) {
                        case 'getMemberCount':
                                $Model = new Model();
                                $vo = $Model->query("SELECT count(*) as item1,mid,FROM_UNIXTIME(subscribe_time,'%Y-%m-%d') as y  FROM `".C("DB_PREFIX")."userinfo` where mid=".$_SESSION[C('USER_AUTH_KEY')]." group by y  order by y desc  limit 0,30");
                                echo "var memberCount = ".json_encode($vo).";";
                                break;
                        default:
                                break;
                }
         }



}

?>
