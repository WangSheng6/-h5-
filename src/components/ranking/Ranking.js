require('./Ranking.styl');
const reactMixin = require('react-mixin');
const Actions = require('./actions');
const Store = require('./store');
var common = require('../../public/common.js');
const User = require('../user');
const { Toast, Button, Grid, Icon, TabBar,Mask,Tab,List,Group,Slide,Avatar} = SaltUI;
var pageSize = 15;
var pageNum = {
    honor_pageNum:0,
    use_pageNum:0
}//页数
class Ranking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            active: 0,
            TActive:0,
            error:false,
            honorRankingContent:{}, //积分榜(荣誉积分榜)
            useRankingContent:{}, //积分榜(可用积分榜)

            hasHonorData:true, //是否有数据(荣誉积分榜)
            hasUseData:true, //是否有数据(可用积分榜)

            isHonorLoading : false, //控制异步加载
            isUseLoading : false, //控制异步加载
        };
    }

    loadData(){
        pageNum = {
            honor_pageNum:0,
            use_pageNum:0
        }
        setTimeout(function(){
            //荣誉积分榜
            Actions.fetchHonorRanking({
                isScoreAll:true,
                pageIndex: 0,
                pageSize: pageSize,
                "~callback":'jsonp',
            }, function(data) {
                Toast.hide();
            });

            //可用积分榜
            Actions.fetchUseRanking({
                isScoreAll:false,
                pageIndex: 0,
                pageSize: pageSize,
                "~callback":'jsonp',
            }, function(data) {
                Toast.hide();
            });
        },1500)
    }

    handleChange(obj) {
        var t = this;
        document.body.scrollTop = 0; //解决滚动时,切换页面相互影响
        this.setState({
            TActive:obj.active,
            activeIndex:this.state.activeIndex,
            active:obj.active
        })
        console.log({
            active: obj.active,
            preActive: obj.preActive,
            data:obj.data
        });
    }

    updateData(rank){
        /*
         document.body.scrollTop --网页被卷去的高
         window.screen.availHeight --网页工作区域
         document.body.clientHeight --网页可见区域高
         */

        var diffY = document.body.clientHeight - window.screen.availHeight;
        var hideY = document.body.scrollTop;

        if(hideY>=(diffY-55)){
            let t= this;
            if(rank == 'honorRanking'){
                if(t.state.isHonorLoading){
                    return ;
                }
                pageNum.honor_pageNum++;
                console.log(pageNum.honor_pageNum);

                t.refs.honorLoad.style.display = 'block';
                t.state.isHonorLoading = true;
                Actions.fetchHonorRanking({
                    isScoreAll:true,
                    pageIndex: pageNum.honor_pageNum,
                    pageSize: pageSize,
                    "~callback":'jsonp',
                }, function(data) {
                    if(data.hasHonorData){
                        t.refs.noHonorLoad.style.display = 'none';
                        t.refs.honorLoad.style.display = 'none';
                        t.state.isHonorLoading = false;
                    }else{
                        t.refs.honorLoad.style.display = 'none';
                        t.refs.noHonorLoad.style.display = 'block';
                        t.state.isHonorLoading = true;
                    }
                });
            }else if(rank == 'useRanking'){
                if(t.state.isUseLoading) return;
                pageNum.use_pageNum++;
                console.log(pageNum.use_pageNum);

                t.refs.useLoad.style.display = 'block';
                t.state.isUseLoading = true;
                Actions.fetchUseRanking({
                    isScoreAll:false,
                    pageIndex: pageNum.use_pageNum,
                    pageSize: pageSize,
                    "~callback":'jsonp'
                }, function(data) {
                    if(data.hasUseData){
                        t.refs.noUseLoad.style.display = 'none';
                        t.refs.useLoad.style.display = 'none';
                        t.state.isUseLoading = false;
                    }else{
                        t.refs.useLoad.style.display = 'none';
                        t.refs.noUseLoad.style.display = 'block';
                        t.state.isUseLoading = true;
                    }
                });
            }
        }
    }

    render() {
        let t = this;
        return (
            <div className="ranking">
                <User ac={this.state.TActive}/>
                <div style={{height:'17.6581vh'}}></div>
                <Tab active={this.state.active} className="t-tab-secondary" type={'brick'} onChange={t.handleChange.bind(t)}>
                    <Tab.Item title="荣誉积分榜">
                        <div className="demoListView tM10">
                            <div className="table-responsive">
                                <div style={{height:'46px'}}></div>
                                <div className="t-header t-PF">
                                    <ul className="t-all">
                                        <li className="rank">排名</li>
                                        <li className="name">姓名(工号)</li>
                                        <li className="t-honor">荣誉积分</li>
                                    </ul>
                                </div>
                                <table className="table">
                                    <thead>
                                    <tr className="t-head">
                                        <th>排名</th>
                                        <th>姓名(工号)</th>
                                        <th>荣誉积分</th>
                                    </tr>
                                    </thead>

                                    <tbody onTouchMove={t.updateData.bind(t,'honorRanking')}>
                                    {

                                        t.state.honorRankingContent.Data?
                                            t.state.honorRankingContent.Data.map(function(item){
                                                if(item.userid == t.props.userid){
                                                    return (
                                                        <tr style={{backgroundColor:'#F9F9F9'}}>
                                                            {(() => {
                                                                switch (item.seqAll) {
                                                                    case 1:  return (<td className="t-self"><img src="../src/images/gold.png" width="28.64%"/></td>) ;break;
                                                                    case 2: return(<td className="t-self"><img src="../src/images/silver.png" width="28.64%" /></td>);break;
                                                                    case 3: return (<td className="t-self"><img src="../src/images/copper.png" width="28.64%" /></td>);break;
                                                                    default: return (<td className="t-self" style={{paddingLeft:'6.15vw'}}>{item.seqAll}</td>);
                                                                }
                                                            })()}
                                                            <td><Avatar src={item.avatar} className="t-userAvatar t-selfAvatar" /> {item.name}</td>
                                                            <td className="t-FAC">{item.ScoreAll}</td>
                                                        </tr>
                                                    )

                                                }

                                            }):(
                                            <tr>
                                                {t.state.error ? 'Error' : ''}
                                            </tr>
                                        )
                                    }
                                    {

                                        t.state.honorRankingContent.Data?
                                            t.state.honorRankingContent.Data.map(function(item){
                                                if(item.userid == t.props.userid){

                                                }else{
                                                    return (
                                                        <tr>
                                                            {(() => {
                                                                switch (item.seqAll) {
                                                                    case 1:  return (<td><img src="../src/images/gold.png" width="28.64%"/></td>) ;break;
                                                                    case 2: return(<td><img src="../src/images/silver.png" width="28.64%" /></td>);break;
                                                                    case 3: return (<td><img src="../src/images/copper.png" width="28.64%" /></td>);break;
                                                                    default: return (<td style={{paddingLeft:'6.16vw'}}>{item.seqAll}</td>);
                                                                }
                                                            })()}
                                                            <td><Avatar src={item.avatar} className="t-userAvatar" /> &nbsp;{item.name}</td>
                                                            <td className="t-FAC">{item.ScoreAll}</td>
                                                        </tr>
                                                    )
                                                }
                                            }):(
                                            <tr>
                                                {t.state.error ? 'Error' : ''}
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                            </div>
                            <div className="t-loading t-H32 t-FS12" ref="honorLoad"><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 努力加载中...</div>
                            <div className="t-loading t-H32 t-FS12" ref="noHonorLoad">已没有底线了..</div>
                        </div>
                    </Tab.Item>
                    <Tab.Item title="可用积分榜">
                        <div>
                            <div className="table-responsive">
                                <div style={{height:'46px'}}></div>
                                <div className="t-header t-PF">
                                    <ul className="t-all">
                                        <li className="rank">排名</li>
                                        <li className="name">姓名(工号)</li>
                                        <li className="t-honor">可用积分</li>
                                    </ul>
                                </div>
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>排名</th>
                                        <th>姓名(工号)</th>
                                        <th>可用积分</th>
                                    </tr>
                                    </thead>
                                    <tbody onTouchMove={t.updateData.bind(t,'useRanking')}>
                                    {

                                        t.state.useRankingContent.Data?
                                            t.state.useRankingContent.Data.map(function(item){
                                                if(item.userid == t.props.userid){
                                                    return (
                                                        <tr style={{backgroundColor:'#F9F9F9'}}>
                                                            {(() => {
                                                                switch (item.seqLeft) {
                                                                    case 1:  return (<td className="t-self"><img src="../src/images/gold.png" width="28.64%"/></td>) ;break;
                                                                    case 2: return(<td className="t-self"><img src="../src/images/silver.png" width="28.64%" /></td>);break;
                                                                    case 3: return (<td className="t-self"><img src="../src/images/copper.png" width="28.64%" /></td>);break;
                                                                    default: return (<td className="t-self" style={{paddingLeft:'6.15vw'}}>{item.seqLeft}</td>);
                                                                }
                                                            })()}
                                                            <td><Avatar src={item.avatar} className="t-userAvatar t-selfAvatar" /> {item.name}</td>
                                                            <td className="t-FAC">{item.ScoreLeft}</td>
                                                        </tr>
                                                    )

                                                }

                                            }):(
                                            <tr>
                                                {t.state.error ? 'Error' : ''}
                                            </tr>
                                        )
                                    }
                                    {

                                        t.state.useRankingContent.Data?
                                            t.state.useRankingContent.Data.map(function(item){
                                                if(item.userid == t.props.userid){

                                                }else{
                                                    return (
                                                        <tr>
                                                            {(() => {
                                                                switch (item.seqLeft) {
                                                                    case 1:  return (<td><img src="../src/images/gold.png" width="28.64%"/></td>) ;break;
                                                                    case 2: return(<td><img src="../src/images/silver.png" width="28.64%" /></td>);break;
                                                                    case 3: return (<td><img src="../src/images/copper.png" width="28.64%" /></td>);break;
                                                                    default: return (<td style={{paddingLeft:'6.16vw'}}>{item.seqLeft}</td>);
                                                                }
                                                            })()}
                                                            <td><Avatar src={item.avatar} className="t-userAvatar" /> &nbsp;{item.name}</td>
                                                            <td className="t-FAC">{item.ScoreLeft}</td>
                                                        </tr>
                                                    )
                                                }
                                            }):(
                                            <tr>
                                                {t.state.error ? 'Error' : ''}
                                            </tr>
                                        )
                                    }

                                    </tbody>
                                </table>
                            </div>
                            <div className="t-loading t-H32 t-FS12" ref="useLoad"><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 努力加载中...</div>
                            <div className="t-loading t-H32 t-FS12" ref="noUseLoad">已没有底线了..</div>
                        </div>
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

reactMixin.onClass(Ranking, Reflux.connect(Store));

module.exports = Ranking;
