<?php
class IndexAction extends CommonAction {
	public function index() {
		$this->display ();
	}

        public function getAPI(){
                switch ($_GET['type']) {
                        case 'getMemberCount':
                                $Model = new Model();
                                $vo = $Model->query("SELECT count(*) as item1,FROM_UNIXTIME(m_addtime,'%Y-%m-%d') as y  FROM `".C("DB_PREFIX")."member` group by y  order by y desc  limit 0,30");
                                echo "var memberCount = ".json_encode($vo).";";
                                break;

                        case 'getArchivesCount':
                                $Model = new Model();
                                $vo = $Model->query("SELECT count(*) as item1,FROM_UNIXTIME(addtime,'%Y-%m-%d') as y  FROM `".C("DB_PREFIX")."article` group by y  order by y desc  limit 0,30");
                                echo "var archiveCount = ".json_encode($vo).";";
                                break;
                       case 'getVoteCount':
                                $Model = new Model();
                                $vo = $Model->query("SELECT count(*) as item1,FROM_UNIXTIME(statdate,'%Y-%m-%d') as y  FROM `".C("DB_PREFIX")."vote` group by y  order by y desc  limit 0,30");
                                echo "var archiveCount = ".json_encode($vo).";";
                                break;

                        default:
                                break;
                }
         }



}
?>
