/**
 * Created by wangsheng on 16/9/7.
 */
const Actions = require('./actions');
const DB = require('../../app/db');

module.exports = Reflux.createStore({
    listenables: [Actions],
    data: {
        loaded: false,
        dynamic: {},
        hasDynamicData:true, //是否有数据(积分动态)
        isLoad : false, //控制异步加载
    },

    onGetDynamic: function(params, cb) {
        let t = this;
        DB.SomeModuleAPI.dynamic(params)
            .then(function(content) {
                t.data.loaded = true;
                if(content.Data.length==0){
                    t.data.activeIndex = 0;
                    t.data.hasDynamicData = false;
                }else{
                    if(t.data.dynamic.Data){
                        content.Data.forEach(function(item){
                            t.data.dynamic.Data.push(item);
                        });
                        t.data.activeIndex = 0;
                    }else{
                        t.data.dynamic = content;
                    }
                }
                t.updateComponent();
                cb && cb(t.data);
            })
            .catch(function(error) {
                t.data.error = error;
                t.updateComponent();
                cb && cb(t.data);
            });
    },

    updateComponent: function() {
        this.trigger(this.data);
    },

    getInitialState: function() {
        this.data = {
            loaded: false,
            dynamic: {},
            hasDynamicData:true, //是否有数据(积分动态)
            isLoad : false, //控制异步加载
        }
        return this.data;
    }
});
