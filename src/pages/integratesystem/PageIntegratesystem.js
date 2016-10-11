require('./PageIntegratesystem.styl');

const reactMixin = require('react-mixin');
const Actions = require('./actions');
const Store = require('./store');
const {Toast, TabBar} = SaltUI;
const Dynamic = require('../../components/dynamic');
const Ranking = require('../../components/ranking');
const Myscore = require('../../components/myscore');
var common = require('../../public/common.js');

class Integratesystem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            acIndex:0,
            userid:''
        };
    }
    componentWillMount() {
        this.handleClick();
    }
    componentDidMount(){

    }
    handleClick(){
        let t = this;
        Toast.show({
            type: 'loading',
            content: 'Loading'
        });
        //获取 userid
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
    render() {
        let onChange = (activeIndex)=> {  // ES6语法
            document.body.scrollTop = 0; //解决滚动时,切换页面相互影响
            this.setState({
                acIndex:activeIndex,
                activeIndex:activeIndex
            })
        };
        let t = this;
        return (
            <div className="integratesystem">
                <TabBar activeIndex={this.state.activeIndex} onChange={onChange.bind(this)}>
                    <TabBar.Item title="积分动态" icon="info-circle">
                        <Dynamic />
                    </TabBar.Item>
                    <TabBar.Item title="积分榜" icon="search" >
                        <Ranking userid={t.state.userid} />
                    </TabBar.Item>
                    <TabBar.Item title="我的积分" icon="user">
                        <Myscore acIndex={t.state.acIndex} />
                    </TabBar.Item>
                </TabBar>
            </div>
        );
    }
}
reactMixin.onClass(Integratesystem, Reflux.connect(Store));

module.exports = Integratesystem;
