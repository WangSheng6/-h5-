require('./Hello.styl');

class Hello extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="hello t-p10">
                say hello!!
            </div>
        );
    }
    /* === react 组件生命周期 ===
        Mounting: 已插入真实 DOM
        Updating: 正在被重新渲染
        Unmounting：已移出真实 DOM
     React 为每个状态都提供了两种处理函数，will 函数在进入状态之前调用，did 函数在进入状态之后调用，三种状态共计五种处理函数。
    *
    * */
    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }//已加载组件收到新的参数时调用

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }//组件判断是否重新渲染时调用

    componentWillUpdate(nextProps, nextState) {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentWillUnmount() {
    }
}

module.exports = Hello;
