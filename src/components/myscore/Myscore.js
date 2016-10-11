require('./Myscore.styl');
const reactMixin = require('react-mixin');
const Actions = require('./actions');
const Store = require('./store');
var common = require('../../public/common.js');
const User = require('../user');
const { Toast,Tab,Group} = SaltUI;
var pageSize = 15;
var pageNum = {
    my_pageNum:0, //我的积分(全部)
    fetch_pageNum:0, //我的积分(获取)
    used_pageNum:0 //我的积分(使用)
}//页数
class Myscore extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            acIndex:0,
            myIndex:0,
            error:false,
            myContent:{}, //我的积分(全部)
            getContent:{}, //我的积分(获取)
            useContent:{}, //我的积分(使用)

            hasMyData:true, //是否有数据(我的积分[全部])
            hasGetData:true, //是否有数据(我的积分[获取])j
            hasUsedData:true, //是否有数据(我的积分[使用])

            isLoading : false, //控制异步加载(我的积分[全部])
            isGetLoading:false, //控制异步加载(我的积分[获取])
            isUsedLoading:false, //控制异步加载(我的积分[使用])

            userid:''
        };
    }

    loadData(){
        pageNum = {
            my_pageNum:0, //我的积分(全部)
            fetch_pageNum:0, //我的积分(获取)
            used_pageNum:0 //我的积分(使用)
        }
        let t = this;
        common.ajax({
            url: "http://dd.tongbu.com/ajax.ashx", //请求地址
            type: "GET", //请求方式
            data: {
                mode:'config',
                url: 'http://192.168.40.90:3002/',
                agentId: '35924532'
            }, //请求参数
            dataType: "jsonp", //跨域请求
            successCb: function (data) {
                var jsApiList = ['biz.user.get'];
                jsApiList.forEach(function(item){
                    data.jsApiList.push(item);
                });
                //jsapi权限验证配置
                common.JSApi({
                    data: data,
                    methods: function(){
                        dd.biz.user.get({
                            onSuccess: function (info) {
                                //0460253253939717
                                t.setState({
                                    userid:info.emplId
                                })

                                Actions.fetchMime({
                                    "~callback":'jsonp',
                                    pageIndex: 0,
                                    pageSize: pageSize,
                                    userid: info.emplId,
                                    scoreType: 0
                                }, function(data) {
                                    Toast.hide();
                                });

                                Actions.fetchGet({
                                    "~callback":'jsonp',
                                    pageIndex: 0,
                                    pageSize: pageSize,
                                    userid: info.emplId,
                                    scoreType: 1
                                }, function(data) {
                                    Toast.hide();
                                });

                                Actions.fetchUse({
                                    "~callback":'jsonp',
                                    pageIndex: 0,
                                    pageSize: pageSize,
                                    userid: info.emplId,
                                    scoreType: 2
                                }, function(data) {
                                    Toast.hide();
                                });
                            },
                            onFail: function (err) {
                                alert('userGet fail: ' + JSON.stringify(err));
                            }
                        });
                    }
                });
            }
        });
    }

    //异步加载数据
    updateData(tabBar){
        /*
         document.body.scrollTop --网页被卷去的高
         window.screen.availHeight --网页工作区域
         document.body.clientHeight --网页可见区域高
         */
        var diffY = document.body.clientHeight - window.screen.availHeight;
        var hideY = document.body.scrollTop;

        if(hideY>=(diffY-55)){
            if(tabBar == 'mime'){
                let t= this;
                if(t.state.isLoading){
                    return ;
                }
                pageNum.my_pageNum++;
                console.log(pageNum.my_pageNum);
                t.refs.load.style.display = 'block';
                t.state.isLoading = true;
                //0460253253939717
                Actions.fetchMime({
                    "~callback":'jsonp',
                    pageIndex: pageNum.my_pageNum,
                    pageSize: pageSize,
                    userid: t.state.userid,
                    scoreType:0
                }, function(data) {
                    if(data.hasMyData){
                        t.refs.load.style.display = 'none';
                        t.refs.noLoad.style.display = 'none';
                        t.state.isLoading = false;
                    }else{
                        t.refs.load.style.display = 'none';
                        t.refs.noLoad.style.display = 'block';
                        t.state.isLoading = true;
                    }

                })
            }else if(tabBar == 'myGet'){
                let t= this;
                if(t.state.isGetLoading){
                    return ;
                }
                pageNum.fetch_pageNum++;
                console.log(pageNum.fetch_pageNum);
                t.refs.loadGet.style.display = 'block';
                t.state.isGetLoading = true;

                Actions.fetchGet({
                    "~callback":'jsonp',
                    pageIndex: pageNum.fetch_pageNum,
                    pageSize: pageSize,
                    userid: t.state.userid,
                    scoreType:1
                }, function(data) {
                    if(data.hasGetData){
                        t.refs.loadGet.style.display = 'none';
                        t.refs.noLoadGet.style.display = 'none';
                        t.state.isGetLoading = false;
                    }else{
                        t.refs.loadGet.style.display = 'none';
                        t.refs.noLoadGet.style.display = 'block';
                        t.state.isGetLoading = true;
                    }
                })

            }else if(tabBar == 'myUse'){
                let t= this;
                if(t.state.isUsedLoading){
                    return ;
                }
                pageNum.used_pageNum++;
                console.log(pageNum.used_pageNum);
                t.refs.loadUse.style.display = 'block';
                t.state.isUsedLoading = true;

                Actions.fetchUse({
                    "~callback":'jsonp',
                    pageIndex: pageNum.used_pageNum,
                    pageSize: pageSize,
                    userid: t.state.userid,
                    scoreType:2
                }, function(data) {
                    if(data.hasUsedData){
                        t.refs.loadUse.style.display = 'none';
                        t.refs.noLoadUse.style.display = 'none';
                        t.state.isUsedLoading = false;
                    }else{
                        t.refs.loadUse.style.display = 'none';
                        t.refs.noLoadUse.style.display = 'block';
                        t.state.isUsedLoading = true;
                    }
                })
            }
        }
    }
    handleChange(obj) {
        var t = this;
        document.body.scrollTop = 0; //解决滚动时,切换页面相互影响
        t.setState({
            myIndex:obj.active
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
            <div className="myscore">
                <User acIndex={this.props.acIndex} myIndex={this.state.myIndex}/>
                <div style={{height:'29.8556vh'}}></div>
                <Tab active={this.state.myIndex} className="t-tab-secondary" type={'brick'} onChange={t.handleChange.bind(t)}>
                    <Tab.Item title="全部">
                        <div className="detail_list" ref="t-detail" onTouchMove={t.updateData.bind(t,'mime')}>
                            <Group>
                                <Group.List lineIndent={15} itemIndent={15}>
                                    {
                                        t.state.myContent.Data ?
                                            t.state.myContent.Data.map(function(item) {
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
                        </div>
                        <div className="t-loading t-lh t-H32 t-FS12" ref="load"><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 努力加载中...</div>
                        <div className="t-loading t-lh t-H32 t-FS12" ref="noLoad">已没有底线了..</div>
                    </Tab.Item>
                    <Tab.Item title="获取">
                        <div className="detail_list" onTouchMove={t.updateData.bind(t,'myGet')}>
                            <Group>
                                <Group.List lineIndent={15} itemIndent={15}>
                                    {
                                        t.state.getContent.Data ?
                                            t.state.getContent.Data.map(function(item) {
                                                if(item.Score >=0){
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
                        <div className="t-loading t-lh t-H32 t-FS12" ref="loadGet"><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 努力加载中...</div>
                        <div className="t-loading t-lh t-H32 t-FS12" ref="noLoadGet">已没有底线了..</div>
                    </Tab.Item>
                    <Tab.Item title="使用">
                        <div className="detail_list" onTouchMove={t.updateData.bind(t,'myUse')}>
                            <Group>
                                <Group.List lineIndent={15} itemIndent={15}>
                                    {
                                        t.state.useContent.Data ?
                                            t.state.useContent.Data.map(function(item) {
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
                        <div className="t-loading t-lh t-H32 t-FS12" ref="loadUse"><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 努力加载中...</div>
                        <div className="t-loading t-lh t-H32 t-FS12" ref="noLoadUse">已没有底线了..</div>
                    </Tab.Item>
                </Tab>
            </div>
        );
    }

    componentWillMount() {
        this.loadData();
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

reactMixin.onClass(Myscore, Reflux.connect(Store));
module.exports = Myscore;
