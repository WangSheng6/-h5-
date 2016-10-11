/**
 * Created by wangsheng on 16/10/9.
 */
const Actions = require('./actions');
const DB = require('../../app/db');

module.exports = Reflux.createStore({
    listenables: [Actions],
    data: {
        loaded:false,
        error:false,
        myContent:{}, //我的积分(全部)
        getContent:{}, //我的积分(获取)
        useContent:{}, //我的积分(使用)

        activeIndex: 0,
        active: 0,
        hasMyData:true, //是否有数据(我的积分[全部])
        hasGetData:true, //是否有数据(我的积分[获取])
        hasUsedData:true, //是否有数据(我的积分[使用])
    },

    onFetchMime: function(params, cb) {
        var t = this;
        DB.SomeModuleAPI.mime(params)
            .then(function(content) {
                t.data.loaded = true;
                if(content.Data.length == 0){
                    t.data.activeIndex = 2;
                    t.data.hasMyData = false;
                }else{
                    if(t.data.myContent.Data){
                        content.Data.forEach(function(item){
                            t.data.myContent.Data.push(item);
                        });
                        t.data.activeIndex = 2;
                    }else{
                        t.data.myContent = content;
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
    onFetchGet: function(params, cb) {
        var t = this;
        DB.SomeModuleAPI.mime(params)
            .then(function(content) {
                t.data.loaded = true;
                if(content.Data.length == 0){
                    t.data.activeIndex = 2;
                    t.data.hasGetData = false;
                }else{
                    if(t.data.getContent.Data){
                        content.Data.forEach(function(item){
                            t.data.getContent.Data.push(item);
                        });
                        t.data.activeIndex = 2;
                    }else{
                        t.data.getContent = content;
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
    onFetchUse: function(params, cb) {
        var t = this;
        DB.SomeModuleAPI.mime(params)
            .then(function(content) {
                t.data.loaded = true;
                if(content.Data.length == 0){
                    t.data.activeIndex = 2;
                    t.data.hasUsedData = false;
                }else{
                    if(t.data.useContent.Data){
                        content.Data.forEach(function(item){
                            t.data.useContent.Data.push(item);
                        });
                        t.data.activeIndex = 2;
                    }else{
                        t.data.useContent = content;
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
            loaded:false,
            error:false,
            myContent:{}, //我的积分(全部)
            getContent:{}, //我的积分(获取)
            useContent:{}, //我的积分(使用)

            activeIndex: 0,
            active: 0,
            hasMyData:true, //是否有数据(我的积分[全部])
            hasGetData:true, //是否有数据(我的积分[获取])
            hasUsedData:true, //是否有数据(我的积分[使用])
        }
        return this.data;
    }
});
