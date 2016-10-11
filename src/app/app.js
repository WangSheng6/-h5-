require('./app.styl');

if (__LOCAL__ && window.chrome && window.chrome.webstore) { // This is a Chrome only hack
    // see https://github.com/livereload/livereload-extensions/issues/26
    setInterval(function() {
        document.body.focus();
    }, 200);
}

// bind fastclick
window.FastClick && FastClick.attach(document.body);

const { Router, Route, IndexRoute, Link, hashHistory } = ReactRouter;

const PageHome = require('../pages/home');
const PageDemo = require('../pages/demo');
const PageTest = require('../pages/test');
const PageIntegratesystem = require('../pages/integratesystem');
const PageControldata = require('../pages/controldata');
const PageUserdetail = require('../pages/userdetail');

class App extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route name="app" path="/" component={App}>
            <IndexRoute component={PageHome} />
            <Route path="home" component={PageHome} />
            <Route path="demo" component={PageDemo} />
            <Route path="test" component={PageTest} />
            <Route path="integratesystem" component={PageIntegratesystem} />
            <Route path="controldata" component={PageControldata} />
            <Route path="userdetail" component={PageUserdetail} />
        </Route>
    </Router>,
    document.getElementById('App')
);
