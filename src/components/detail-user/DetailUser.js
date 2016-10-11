require('./DetailUser.styl');
const { Toast, Button, Grid, Icon, TabBar,Mask,Tab,List,Group,Slide,Avatar} = SaltUI;
class DetailUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }
    //禁止全屏滚动
    handleTouch(e){
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        let t = this;
        return (
            <div className="detail-user" onTouchMove={t.handleTouch.bind(t)}>
                <div className="t-user-info">
                    <Avatar className="t-user-avatar t-MB2" src={t.props.info.avatar} size="16vw"/>
                    <p className="userName t-MT8">
                        {t.props.info.name}
                    </p>
                    <p className="available">
                        {
                            (() => {
                                switch (t.props.ac) {
                                    case 0:  return (<span>{t.props.info.ScoreLeft}</span>); break;
                                    case 1: return (<span>{t.props.info.ScoreAll}</span>); break;
                                    default: return (<span> {t.props.info.ScoreAll-t.props.info.ScoreLeft} </span>);
                                }
                            })()
                        }
                    </p>
                </div>
            </div>
        );
    }

    componentWillMount() {

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

module.exports = DetailUser;
