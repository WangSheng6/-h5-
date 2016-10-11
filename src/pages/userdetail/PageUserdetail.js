require('./PageUserdetail.styl');

const reactMixin = require('react-mixin');
const Actions = require('./actions');
const Store = require('./store');
const UserInfo = require('../../components/detail-user');
const { Toast, Button, Grid, Icon, TabBar,Mask,Tab,List,Group,Slide,Avatar} = SaltUI;
var pageSize = 15;
var pageNum = {
    all_pageNum:0,
    get_pageNum:0,
    use_pageNum:0
}//页数
class Userdetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error:false,
            userInfo:{},
            ac:0,

            detailData:{},
            hasMyData:true,
            isLoad : false, //控制异步加载

            detailGetData:{},
            hasGetData:true,
            isGetLoad: false,

            detailUseData:{},
            hasUseData:true,
            isUseLoad: false
        };
    }
    componentWillMount() {
        let t = this;
        // 控制标题文本
        dd.ready(function(){
            dd.biz.navigation.setTitle({
                title : '积分详情',//控制标题文本，空字符串表示显示默认文本
                onSuccess : function(result) {
                    /*结构
                     {
                     }*/
                },
                onFail : function(err) {}
            });
        });
        //存取参数
        this.state.userInfo =JSON.parse(salt.router.getMessage('userdetail'))||{};
        //通过接口取数据 --全部
        Actions.fetchAll({
            "~callback":'jsonp',
            pageIndex: 0,
            pageSize: pageSize,
            userid: this.state.userInfo.userid,
            scoreType: 0
        }, function(data) {
            t.state.detailData = data.detailData;
            t.forceUpdate();
        })

        //通过接口取数据 --获取
        Actions.fetchGet({
            "~callback":'jsonp',
            pageIndex: 0,
            pageSize: pageSize,
            userid: this.state.userInfo.userid,
            scoreType: 1
        }, function(data) {
            t.state.detailGetData = data.detailGetData;
            t.forceUpdate();
        })

        //通过接口取数据 --使用
        Actions.fetchUse({
            "~callback":'jsonp',
            pageIndex: 0,
            pageSize: pageSize,
            userid: this.state.userInfo.userid,
            scoreType: 2
        }, function(data) {
            t.state.detailUseData = data.detailUseData;
            t.forceUpdate();
        })
    }

    updateData(area){
        /*
         document.body.scrollTop --网页被卷去的高
         window.screen.availHeight --网页工作区域
         document.body.clientHeight --网页可见区域高
         */
        var diffY = document.body.clientHeight - window.screen.availHeight;
        var hideY = document.body.scrollTop;

        if(hideY>=(diffY-55)){
            let t= this;
            if(area == 'all'){
                if(t.state.isLoad){
                    return ;
                }
                pageNum.all_pageNum++;
                console.log(pageNum.all_pageNum);

                t.refs.allLoad.style.display = 'block';
                t.state.isLoad = true;
                Actions.fetchAll({
                    userid: this.state.userInfo.userid,
                    pageIndex: pageNum.all_pageNum,
                    pageSize: pageSize,
                    "~callback":'jsonp',
                    scoreType: 0
                }, function(data) {
                    if(data.hasMyData){
                        t.refs.noAllLoad.style.display = 'none';
                        t.refs.allLoad.style.display = 'none';
                        t.state.isLoad = false;
                    }else{
                        t.refs.allLoad.style.display = 'none';
                        t.refs.noAllLoad.style.display = 'block';
                        t.state.isLoad = true;
                    }
                });
            }else if(area == 'get'){
                if(t.state.isGetLoad){
                    return ;
                }
                pageNum.get_pageNum++;
                console.log(pageNum.get_pageNum);

                t.refs.getLoad.style.display = 'block';
                t.state.isGetLoad = true;
                Actions.fetchGet({
                    userid: this.state.userInfo.userid,
                    pageIndex: pageNum.get_pageNum,
                    pageSize: pageSize,
                    "~callback":'jsonp',
                    scoreType: 1
                }, function(data) {
                    if(data.hasGetData){
                        t.refs.noGetLoad.style.display = 'none';
                        t.refs.getLoad.style.display = 'none';
                        t.state.isGetLoad = false;
                    }else{
                        t.refs.getLoad.style.display = 'none';
                        t.refs.noGetLoad.style.display = 'block';
                        t.state.isGetLoad = true;
                    }
                });
            }else{
                if(t.state.isUseLoad){
                    return ;
                }
                pageNum.use_pageNum++;
                console.log(pageNum.use_pageNum);

                t.refs.useLoad.style.display = 'block';
                t.state.isUseLoad = true;
                Actions.fetchUse({
                    userid: this.state.userInfo.userid,
                    pageIndex: pageNum.use_pageNum,
                    pageSize: pageSize,
                    "~callback":'jsonp',
                    scoreType: 2
                }, function(data) {
                    if(data.hasUseData){
                        t.refs.noUseLoad.style.display = 'none';
                        t.refs.useLoad.style.display = 'none';
                        t.state.isUseLoad = false;
                    }else{
                        t.refs.useLoad.style.display = 'none';
                        t.refs.noUseLoad.style.display = 'block';
                        t.state.isUseLoad = true;
                    }
                });
            }
        }
    }

    handleChange(obj){
        var t = this;
        document.body.scrollTop = 0; //解决滚动时,切换页面相互影响
        this.setState({
            ac:obj.active
        })
        console.log({
            active: obj.active,
            preActive: obj.preActive,
            data:obj.data
        });
    }

    render() {
        let t = this;
        return (
            <div className="userdetail">
                <UserInfo info={this.state.userInfo} ac={this.state.ac}/>
                <div style={{height:'29.8556vh'}}></div>
                <Tab active={this.state.ac} className="t-tab-secondary" type={'brick'} onChange={t.handleChange.bind(t)}>
                    <Tab.Item title="全部">
                        <div  className="detail_list" onTouchMove={t.updateData.bind(t,'all')}>
                            <Group>
                                <Group.List lineIndent={15} itemIndent={15}>
                                    {
                                        t.state.detailData.Data ?
                                            t.state.detailData.Data.map(function(item) {
                                                return (
                                                    <div className="t-PT6 t-PB6">
                                                        <span className="t-Score t-FR">
                                                            {
                                                                item.Score > 0 ?
                                                                    /\+/g.test(item.Score)?(
                                                                        <span className="t-score t-FS16 t-success">
                                                                            {item.Score}
                                                                       </span>
                                                                    ):(
                                                                        <span className="t-score t-FS16 t-success">
                                                                            +{item.Score}
                                                                       </span>
                                                                    )

                                                                    : (
                                                                    <span className="t-score t-FS16 t-danger">
                                                                            {item.Score}
                                                                    </span>
                                                                )
                                                            }
                                                        </span>
                                                       <span className="t-name t-FS16">
                                                            <span className="t-reason t-omit t-FS16">
                                                                {item.Reason}
                                                            </span>
                                                        </span>
                                                        <span className="t-grantTime t-FS12">
                                                            {item.GrantTime}
                                                        </span>
                                                    </div>
                                                )
                                            }) : (
                                            <div className="t-PL10 t-LH44 t-FBH t-FBAC t-FBJC">
                                                {t.state.error ? 'Error' : 'No data'}
                                            </div>
                                        )
                                    }
                                </Group.List>
                            </Group>
                            <div className="t-loading t-lh t-H32 t-FS12" ref="allLoad"><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 努力加载中...</div>
                            <div className="t-loading t-lh t-H32 t-FS12" ref="noAllLoad">已没有底线了..</div>
                        </div>
                    </Tab.Item>
                    <Tab.Item title="获取">
                        <div  className="detail_list" onTouchMove={t.updateData.bind(t,'get')}>
                            <Group>
                                <Group.List lineIndent={15} itemIndent={15}>
                                    {
                                        t.state.detailGetData.Data ?
                                            t.state.detailGetData.Data.map(function(item) {
                                                if(item.Score >=0){
                                                    return (
                                                        <div className="t-PT6 t-PB6">
                                                                <span className="t-Score t-FR">
                                                                    {
                                                                        /\+/g.test(item.Score)?(
                                                                            <span className="t-score t-FS16 t-success">
                                                                                {item.Score}
                                                                           </span>
                                                                        ):(
                                                                            <span className="t-score t-FS16 t-success">
                                                                                +{item.Score}
                                                                           </span>
                                                                        )

                                                                    }
                                                                </span>
                                                               <span className="t-name t-FS16">
                                                                    <span className="t-reason t-omit t-FS16">
                                                                        {item.Reason}
                                                                    </span>
                                                                </span>
                                                                <span className="t-grantTime t-FS12">
                                                                    {item.GrantTime}
                                                                </span>
                                                        </div>

                                                    )}

                                            }) : (
                                            <div className="t-PL10 t-LH44 t-FBH t-FBAC t-FBJC">
                                                {t.state.error ? 'Error' : 'No data'}
                                            </div>
                                        )
                                    }
                                </Group.List>
                            </Group>
                            <div className="t-loading t-lh t-H32 t-FS12" ref="getLoad"><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 努力加载中...</div>
                            <div className="t-loading t-lh t-H32 t-FS12" ref="noGetLoad">已没有底线了..</div>
                        </div>
                    </Tab.Item>
                    <Tab.Item title="使用">
                        <div className="detail_list" onTouchMove={t.updateData.bind(t,'use')}>
                            <Group>
                                <Group.List lineIndent={15} itemIndent={15}>
                                    {
                                        t.state.detailUseData.Data ?
                                            t.state.detailUseData.Data.map(function(item) {
                                                if(item.Score < 0){
                                                    return (
                                                        <div className="t-PT6 t-PB6">
                                                                <span className="t-Score t-FR">
                                                                    <span className="t-score t-FS16 t-danger">
                                                                            {item.Score}
                                                                    </span>
                                                                </span>
                                                                <span className="t-name t-FS16">
                                                                    <span className="t-reason t-omit t-FS16">
                                                                        {item.Reason}
                                                                    </span>
                                                                </span>
                                                                <span className="t-grantTime t-FS12">
                                                                    {item.GrantTime}
                                                                </span>
                                                        </div>
                                                    )}

                                            }) : (
                                            <div className="t-PL10 t-LH44 t-FBH t-FBAC t-FBJC">
                                                {t.state.error ? 'Error' : 'No data'}
                                            </div>
                                        )
                                    }
                                </Group.List>
                            </Group>
                        </div>
                        <div className="t-loading t-lh t-H32 t-FS12" ref="useLoad"><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 努力加载中...</div>
                        <div className="t-loading t-lh t-H32 t-FS12" ref="noUseLoad">已没有底线了..</div>
                    </Tab.Item>
                </Tab>

            </div>
        );
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentWillUnmount() {
    }
}

reactMixin.onClass(Userdetail, Reflux.connect(Store, 'Userdetail'));

module.exports = Userdetail;
