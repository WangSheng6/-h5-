require('./Dynamic.styl');

const reactMixin = require('react-mixin');
const Actions = require('./actions');
const Store = require('./store');
var common = require('../../public/common.js');
const {Avatar, Group, Toast} = SaltUI;
var pageNum = 0, pageSize=15;
var corpId;
class Dynamic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error:false,
            dynamic:{},
            hasDynamicData:true, //是否有数据(积分动态)
            isLoad : false, //控制异步加载
        };
    }
    handleClick(){
        pageNum = 0;
        Toast.show({
            type: 'loading',
            content: 'Loading'
        });

        //积分动态
        common.ajax({
            url: "http://dd.tongbu.com/ajax.ashx", //请求地址
            type: "GET", //请求方式
            data: {
                mode:'config',
                url: 'http://192.168.40.90:3002/',
                agentId: '35924532'
            }, //请求参数
            dataType: "jsonp", //跨域请求
            successCb:function(data){
                corpId = data.corpId;
                Actions.getDynamic({
                    corpid: corpId,
                    pageIndex: 0,
                    pageSize: pageSize,
                    "~callback":'jsonp',
                }, function(data) {
                    Toast.hide();
                });
            }
        });
    }
    updateLoadData(){
        /*
         document.body.scrollTop --网页被卷去的高
         window.screen.availHeight --网页工作区域
         document.body.clientHeight --网页可见区域高
         */
        var diffY = document.body.clientHeight - window.screen.availHeight;
        var hideY = document.body.scrollTop;

        if(hideY>=(diffY-55)){
            let t= this;
            if(t.state.isLoad){
                return ;
            }
            pageNum++;
            console.log(pageNum);

            t.refs.dynamicLoad.style.display = 'block';
            t.state.isLoad = true;
            Actions.getDynamic({
                corpid: corpId,
                pageIndex: pageNum,
                pageSize: pageSize,
                "~callback":'jsonp',
            }, function(data) {
                //alert(JSON.stringify(data.dynamic))
                if(data.hasDynamicData){
                    t.refs.noDynamicLoad.style.display = 'none';
                    t.refs.dynamicLoad.style.display = 'none';
                    t.state.isLoad = false;
                }else{
                    t.refs.dynamicLoad.style.display = 'none';
                    t.refs.noDynamicLoad.style.display = 'block';
                    t.state.isLoad = true;
                }
            });
        }
    }
    HandleDetail(data){
        //alert(JSON.stringify(data));
        salt.router.push({
            id: 'userdetail',// frame id
            url: './#/userdetail',// 跳转的frame 所需要加载的url
            //url: './detaildata.html',
            anim: 2, // 转场动画,1:从左到右,2:bottom 从下往上;默认1;
            needPost: true, // 是否需要发送数据到加载的frame;
            param: data  // 当needPost 是true的时候发送的数据

        }).then().catch((e) => {
            if (e.errorCode === 1001) {
                location.href = './detaildata.html';
            }
        });

    }
    render() {
        let t = this;
        return (
            <div className="dynamic" onTouchMove={t.updateLoadData.bind(t)}>
                <Group>
                    <Group.List lineIndent={15} itemIndent={15}>
                        {
                            t.state.dynamic.Data ?
                                t.state.dynamic.Data.map(function(item){
                                    return (
                                        <div className="t-PT6 t-PB6" onClick={t.HandleDetail.bind(t,item)}>
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
                                            <Avatar src={item.avatar} className="t-MR4 t-userAvatar" />
                                            <span className="t-name t-FS14">
                                                <span className="t-reason t-omit t-FS14">
                                                    {item.Reason}
                                                </span>
                                            </span>
                                            <span className="t-grantTime t-FS12">
                                                <span className="t-FS14 t-FC0">
                                                {item.name}
                                            </span>&nbsp;&nbsp;
                                                {item.GrantTime}
                                            </span>
                                        </div>
                                    )
                                }) : (
                                <div className="t-PT10 t-PB10">
                                    {t.state.error ? 'Error' : 'No data'}
                                </div>
                            )

                        }
                    </Group.List>
                </Group>
                <div className="t-loading t-lh t-H32 t-FS12" ref="dynamicLoad"><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 努力加载中...</div>
                <div className="t-loading t-lh t-H32 t-FS12" ref="noDynamicLoad">已没有底线了..</div>
            </div>

        );
    }

    componentWillMount() {
        this.handleClick();
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
reactMixin.onClass(Dynamic, Reflux.connect(Store));

module.exports = Dynamic;
