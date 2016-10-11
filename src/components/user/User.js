require('./User.styl');
var common = require('../../public/common.js');
const {Avatar} = SaltUI;
class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scoreAll:'加载中...',//用户荣誉积分
            scoreLeft:'加载中...',//用户可用积分
            seqAll:'加载中...',//用户荣誉积分排名
            seqLeft:'加载中...',//用户可用积分排名
            userImg:'',
            userName:'加载中...',
        };
    }
    //禁掉全屏滚动
    handleTouch(e){
        e.preventDefault();
        e.stopPropagation();
    }

    componentWillMount() {
        this.getUserInfo();
    }

    getUserInfo(){
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
                common.JSApi({
                    data: data,
                    methods:function(){
                        dd.biz.user.get({
                            onSuccess: function (info) {
                                t.state={
                                    userImg:info.avatar,
                                    userName:info.nickName
                                };
                                t.forceUpdate();
                                //if(info.isManager){
                                dd.biz.navigation.setRight({
                                    show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
                                    control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
                                    text: '积分管理',//控制显示文本，空字符串表示显示默认文本
                                    onSuccess : function(result) {
                                        location.hash = 'controldata';
                                    },
                                    onFail : function(err) {
                                        alert('跳转出错啦~');
                                    }
                                });
                                //  }
                                common.ajax({
                                    url:'http://dd.tongbu.com/api/api.ashx?UserScore',
                                    type: "GET", //请求方式
                                    data: {
                                        userid: info.emplId,
                                        "~callback":'jsonp',
                                    }, //请求参数
                                    successCb:function(data){
                                        var res = JSON.parse(data.responseText.match(/{.*?}}/g)[0]).Data;
                                        t.setState({
                                            userImg:t.state.userImg,
                                            userName:t.state.userName,
                                            scoreAll:res.ScoreAll,//用户荣誉积分
                                            seqAll:res.seqAll,//用户荣誉积分排名
                                            scoreLeft:res.ScoreLeft,//用户可用积分
                                            seqLeft:res.seqLeft,//用户可用积分排名
                                        });
                                        t.forceUpdate();
                                    },
                                    errorCb: function (res) {
                                        var res = JSON.parse(res.responseText.match(/{.*?}}/g)[0]).Data;
                                        t.state = {
                                            userImg:t.state.userImg,
                                            userName:t.state.userName,
                                            scoreAll:res.ScoreAll,//用户荣誉积分
                                            seqAll:res.seqAll,//用户荣誉积分排名
                                            scoreLeft:res.ScoreLeft,//用户可用积分
                                            seqLeft:res.seqLeft//用户可用积分排名
                                        }
                                        t.forceUpdate();//重新渲染组件
                                    }
                                });
                            },
                            onFail: function (err) {
                                alert('userGet fail: ' + JSON.stringify(err));
                            }
                        });
                    }
                });
            },
        })
    }


    render() {
        let t = this;
        return (
            <div onTouchMove={t.handleTouch.bind(t)} >
                {
                    this.props.acIndex == 2 ? (
                        <div className="t-user-info">
                            <Avatar className="t-user-avatar t-MB2" src={t.state.userImg} size="16vw"/>
                            <p className="userName t-MT8">
                                {t.state.userName}
                            </p>
                            <p className="available">
                                {
                                    (() => {
                                        switch (t.props.myIndex) {
                                            case 0:  return (<span>{t.state.scoreLeft}</span>); break;
                                            case 1: return (<span>{t.state.scoreAll}</span>); break;
                                            default: return (<span> {t.state.scoreAll-t.state.scoreLeft} </span>);
                                        }
                                    })()
                                }
                            </p>
                        </div>
                    ) :(
                        this.props.ac ==0 ? (
                            <div className="t-user-data">
                                <p className="t-now t-FS13">
                                    当前积分
                                </p>
                                <p className="honor">
                                    {t.state.scoreAll}
                                </p>
                            </div>

                        ):(
                            <div className="t-user-data">
                                <p className="t-now t-FS13">
                                    当前积分
                                </p>
                                <p className="available">
                                    {t.state.scoreLeft}
                                </p>
                            </div>
                        )
                    )

                }

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


    componentDidUpdate(prevProps, prevState) {
    }

    componentWillUnmount() {
    }
}

module.exports = User;
