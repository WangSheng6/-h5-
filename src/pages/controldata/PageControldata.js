require('./PageControldata.styl');

const reactMixin = require('react-mixin');
const Actions = require('./actions');
const Store = require('./store');
const { Toast, Button, Grid, Icon,Mask,Tab,List,Group,Slide,Avatar,TextField,TextareaField,} = SaltUI;

class Controldata extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            score:'',
            reason:'',
            peopleInfo:{
                user:[]
            },
            users:[],
            corpId:'',
        };
    }
    handleTextChange(newValue) {
        this.setState({
            score: newValue
        });
    }
    handleChange(newValue) {
        this.setState({
            reason: newValue
        });
    }
    handleSubmit(){
        //判断信息的完整性
        if(!this.state.score || !this.state.reason || this.state.peopleInfo.user.length == 0){
            dd.device.notification.alert({
                message: "请填写完整信息",
                title: "温馨提示",//可传空
                buttonName: "好",
                onSuccess : function() {
                    //onSuccess将在点击button之后回调
                    /*回调*/
                },
                onFail : function(err) {}
            });
            return ;
        }
        // /^[+|-]{0,}\d{1,}$/g.test('+325')
        //判断 加减积分 是否为纯数字
        if(!(/^[+|-]{0,1}\d{1,}$/g.test(this.state.score))){
            dd.device.notification.alert({
                message: "加减积分必须为纯数字(例如:+100,-100,100,...)!",
                title: "错误提示",//可传空
                buttonName: "好",
                onSuccess : function() {
                    //onSuccess将在点击button之后回调
                    /*回调*/
                },
                onFail : function(err) {}
            });
            return ;
        }

        var userId = '', peopleInfo = this.state.peopleInfo.user;
        if(peopleInfo.length == 1){
            userId = peopleInfo[0].emplId;
        }else{
            for(var i=0; i<peopleInfo.length; i++){
                userId = i==peopleInfo.length-1 ? (
                    userId+=(peopleInfo[i].emplId)
                ): (
                    userId+=(peopleInfo[i].emplId+'|')
                )

            }
        }
        //alert(JSON.stringify(userId));
        dd.device.notification.showPreloader({
            text: "数据保存中...", //loading显示的字符，空表示不显示文字
            showIcon: true, //是否显示icon，默认true
            onSuccess : function(result) {
                /*{}*/
            },
            onFail : function(err) {}
        })
        //return;
       $.ajax({
           url: 'http://dd.tongbu.com/api/api.ashx?AddScore',
           type: 'POST',
           data: {
               corpid: this.state.corpId,
               userid: userId,
               Score: this.state.score,
               Reason: this.state.reason,
               '~callback': 'jsonp'
           },
           success: function(data){
               alert('success: '+JSON.stringify(data))
           },
           error: function(err){
               //alert('err: '+JSON.stringify(err))

               var res = JSON.parse(err.responseText.match(/{.*?}}/g)[0]);
               if(res.Code == 0){
                   dd.device.notification.hidePreloader({
                       onSuccess : function(result) {
                           /*{}*/
                       },
                       onFail : function(err) {}
                   });
                   dd.device.notification.confirm({
                       message: "保存成功!留在此页面继续操作?",
                       title: "温馨提示",
                       buttonLabels: ['YES', 'NO'],
                       onSuccess : function(result) {
                           //onSuccess将在点击button之后回调
                           /*
                            {
                            buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
                            }
                            */
                           if(result.buttonIndex == 0){

                           }else{
                               salt.router.goBack();
                               //location.hash = 'integratesystem';
                              /* dd.biz.navigation.close({
                                   onSuccess : function(result) {
                                       /!*result结构
                                        {}
                                        *!/
                                   },
                                   onFail : function(err) {}
                               })*/
                           }
                       },
                       onFail : function(err) {}
                   });
               }else{
                   dd.device.notification.alert({
                       message: "提交失败,请重试~",
                       title: "错误提示",//可传空
                       buttonName: "好",
                       onSuccess : function() {
                           //onSuccess将在点击button之后回调
                           /*回调*/
                       },
                       onFail : function(err) {}
                   });
               }
           }
       })
    }
    removeUser(){
        var _index = $(window.event.target).parent().index(); //删除元素,取其 index
        this.state.peopleInfo.user.splice(_index,1); //更新组件状态
        this.forceUpdate(); //重新渲染组件
    }
    handleAvatar(){
        let t = this;
        $.ajax({
            url: "http://dd.tongbu.com/ajax.ashx", //请求地址
            type: "GET", //请求方式
            data: {
                mode:'config',
                url: 'http://192.168.40.90:3002/',
                agentId: '35924532'
            }, //请求参数
            dataType: "jsonp",
            success: function (data) {
                t.state.corpId = data.corpId;
                var jsApiList = [
                    'biz.contact.choose'
                ];
                jsApiList.forEach(function(item){
                    data.jsApiList.push(item);
                });
                dd.config(data);
                dd.ready(function(){
                    //021866135421394575
                    t.state.users = [];
                    if(t.state.peopleInfo.user.length!=0){
                        t.state.peopleInfo.user.forEach(function(item){
                            t.state.users.push(item.emplId);
                        })
                    } //处理已选择用户
                    dd.biz.contact.choose({
                        startWithDepartmentId: 0, //-1表示打开的通讯录从自己所在部门开始展示, 0表示从企业最上层开始，(其他数字表示从该部门开始:暂时不支持)
                        multiple: true, //是否多选： true多选 false单选； 默认true
                        users: t.state.users||[], //默认选中的用户列表，userid；成功回调中应包含该信息
                        corpId: data.corpId, //企业id
                        max: 1500, //人数限制，当multiple为true才生效，可选范围1-1500
                        onSuccess: function(data) {
                            //onSuccess将在选人结束，点击确定按钮的时候被回调
                            /* data结构
                             [{
                             "name": "张三", //姓名
                             "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
                             "emplId": '0573', //userid
                             },
                             ...
                             ]
                             */
                            var list = [];//置空,防止出现重复数据

                            data.forEach(function(item){
                                list.push(item);
                            });

                            t.setState({
                                peopleInfo:{
                                    user:list
                                }
                            });
                            t.forceUpdate();//重新渲染组件
                        },
                        onFail : function(err) {
                            alert(JSON.stringify(err))
                        }
                    });
                });
                dd.error(function(err){
                    alert('dd error: ' + JSON.stringify(err));
                });
            },
            error: function (res) {
                alert('请求用户信息失败!');
            }
        });
    }

    render() {
        let t = this;
        let add = require('../../images/add.png');
        return (
            <div className="controldata">
                <Group>
                    <Group.List>
                        <TextField label="加减积分" placeholder="请输入" value={t.state.score} onChange={t.handleTextChange.bind(t)}/>
                    </Group.List>
                    <Group.List>
                        <TextareaField label="事由" minRows={2} maxRows={5}
                                       placeholder="请输入" value={t.state.reason}
                                       onChange={t.handleChange.bind(t)}/>
                    </Group.List>
                    <Group.List itemIndent={15}>
                        <div className="choosePeople">
                            选择人员&nbsp;&nbsp;<span className="deleteUser">(点击头像删除)</span><br />
                            <ul>
                                {
                                    t.state.peopleInfo.user.length ?
                                        t.state.peopleInfo.user.map(function(item){
                                            return (
                                                <li onClick={t.removeUser.bind(t)}>
                                                    <Avatar src={item.avatar} className="t-avatar"/><br />
                                                    {item.name}
                                                </li>
                                            )
                                        }):(
                                        <li>
                                        </li>
                                    )
                                }
                                <li onClick={t.handleAvatar.bind(t)}>
                                    <Avatar src={add} className="t-avatar" /><br />
                                    <span className="t-add t-FS14">添加</span>
                                </li>
                            </ul>
                            <div style={{clear:'both'}}></div>
                        </div>
                    </Group.List>
                </Group>
                <Button style={{marginTop:'15px',width:'90%',marginLeft:'5%'}} type="primary" size="medium" onClick={t.handleSubmit.bind(t)}>提&nbsp;交</Button>
            </div>
        );
    }

    componentWillMount() {
        //window.salt.router.preload({}).then().catch();
        Toast.show({
            type: 'loading',
            content: 'Loading'
        });
    }

    componentDidMount() {
        Toast.hide();
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

reactMixin.onClass(Controldata, Reflux.connect(Store));

module.exports = Controldata;
