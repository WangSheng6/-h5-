require('./PageHome.styl');

const reactMixin = require('react-mixin');

const { Toast, Button, Grid, Icon } = SaltUI;

const Hello = require('../../components/hello');

class PageHome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleClick(options) {
        Toast.show(options);
    }

    handleLink(route) {
        location.hash = route;
    }

    handlePush() {
        salt.router.push({
            id: 'popwin',// frame id
            url: './popwin.html',// 跳转的frame 所需要加载的url
            anim: 2, // 转场动画,1:从左到右,2:bottom 从下往上;默认1;
            needPost: true, // 是否需要发送数据到加载的frame;
            param: {  // 当needPost 是true的时候发送的数据
                foo: 1,
                bar: 2
            }
        }).then().catch((e) => {
            if (e.errorCode === 1001) {
                location.href = './popwin.html';
            }
        });
    }

    render() {
        let t = this;
        return (
            <div className="page-home">
                <div className="t-PL10 t-PR10 t-PT10">
                    <Button type="primary" onClick={t.handleClick.bind(t, {
                        type: 'success',
                        content: 'You clicked'
                    })}>Click me</Button>
                </div>
                <div className="t-PL10 t-PR10 t-PT10">
                    <Button type="secondary" onClick={t.handlePush.bind(t)}>Pop new window</Button>
                </div>
                <div className="t-PL10 t-PR10 t-PT10">
                    <Button type="secondary" onClick={t.handleLink.bind(t, 'demo')}>Demo</Button>
                </div>
                <div className="t-PL10 t-PR10 t-PT10">
                    <Button type="secondary" onClick={t.handleLink.bind(t, 'test')}>test</Button>
                </div>
                <div className="t-PL10 t-PR10 t-PT10">
                    <Button type="secondary" onClick={t.handleLink.bind(t, 'integratesystem')}>积分系统</Button>
                </div>
                <Hello />
                <Grid col={3} className="t-BCf" square={true} touchable={true}>
                    <div className="demo" onClick={t.handleClick.bind(t, {
                        type: 'success',
                        content: 'You clicked'
                    })}>
                        <Icon name="user" fill={'#42A5F5'} />
                        <div className="menu-title">点我</div>
                    </div>
                    <div className="demo" onClick={t.handlePush.bind(t)}>
                        <Icon name="time" fill={'#FF8A65'}/>
                        <div className="menu-title">打开新窗口</div>
                    </div>
                    <div className="demo" onClick={t.handleLink.bind(t, 'demo')}>
                        <Icon name="star" fill={'#EA80FC'} />
                        <div className="menu-title">Demo</div>
                    </div>
                    <div className="demo" onClick={t.handleLink.bind(t, 'test')}>
                        <Icon name="map" fill={'#EF9A9A'}/>
                        <div className="menu-title">test</div>
                    </div>
                    <div className="demo" >
                        <Icon name="pen" fill={'#9FA8DA'}/>
                        <div className="menu-title">编辑</div>
                    </div>
                    <div className="demo" onClick={t.handleLink.bind(t, 'integratesystem')}>
                        <Icon name="info-circle" fill={'#80DEEA'}/>
                        <div className="menu-title">积分系统</div>
                    </div>
                    <div className="demo" >
                        <Icon name="plus-circle" fill={'#DCE775'}/>
                        <div className="menu-title">添加</div>
                    </div>
                    <div className="demo" >
                        <Icon name="search" fill={'#A1887F'}/>
                        <div className="menu-title">搜索</div>
                    </div>
                    <div className="demo" >
                        <Icon name="plus" fill={'#BDBDBD'}/>
                        <div className="menu-title" style={{color: '#bbb'}}>添加</div>
                    </div>
                </Grid>
            </div>
        );
    }
}

module.exports = PageHome;
