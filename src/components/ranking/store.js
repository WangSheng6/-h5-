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
        honorRankingContent:{}, //积分榜数据(荣誉积分榜)
        useRankingContent:{}, //积分榜数据(可用积分榜)
        activeIndex: 0,
        active: 0,
        hasHonorData:true, //是否有数据(荣誉积分榜)
        hasUseData:true, //是否有数据(可用积分榜)
    },

    onFetchHonorRanking: function(params, cb) {
        var t = this;
        DB.SomeModuleAPI.honorRanking(params)
            .then(function(content) {
                t.data.loaded = true;
                if(content.Data.length==0){
                    t.data.active = 0;
                    t.data.activeIndex = 1;
                    t.data.hasHonorData = false;
                }else{
                    if(t.data.honorRankingContent.Data){
                        content.Data.forEach(function(item){
                            t.data.honorRankingContent.Data.push(item);
                        });
                        t.data.active = 0;
                        t.data.activeIndex = 1;
                    }else{
                        t.data.honorRankingContent = content;
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
    onFetchUseRanking: function(params, cb) {
        var t = this;
        DB.SomeModuleAPI.useRanking(params)
            .then(function(content) {
                t.data.loaded = true;
                if(content.Data.length==0){
                    t.data.active = 1;
                    t.data.activeIndex = 1;
                    t.data.hasUseData = false;
                }else {
                    if(t.data.useRankingContent.Data){
                        content.Data.forEach(function(item){
                            t.data.useRankingContent.Data.push(item);
                        });
                        t.data.active = 1;
                        t.data.activeIndex = 1;
                    }else{
                        t.data.useRankingContent = content;
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
            honorRankingContent:{}, //积分榜数据(荣誉积分榜)
            useRankingContent:{}, //积分榜数据(可用积分榜)
            activeIndex: 0,
            active: 0,
            hasHonorData:true, //是否有数据(荣誉积分榜)
            hasUseData:true, //是否有数据(可用积分榜)
        }
        return this.data;
    }
});
