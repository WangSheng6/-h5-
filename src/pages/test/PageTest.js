require('./PageTest.styl');

const reactMixin = require('react-mixin');
const Actions = require('./actions');
const Store = require('./store');

class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            init:{}
        };
    }

    render() {
        return (
            <div className="test">
                {this.state.init}
            </div>
        );
    }

    componentWillMount() {
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
        })
        this.state.init = salt.router.getMessage('detaildata');
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

reactMixin.onClass(Test, Reflux.connect(Store));

module.exports = Test;
