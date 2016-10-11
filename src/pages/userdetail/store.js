const Actions = require('./actions');
const DB = require('../../app/db');

module.exports = Reflux.createStore({
    listenables: [Actions],
    data: {
        error:false,
        loaded: false,
        ac:0,

        detailData:{},
        hasMyData:true,

        detailGetData:{},
        hasGetData:true,

        detailUseData:{},
        hasUseData:true

    },

    onFetchAll: function(params, cb) {
        let t = this;
        DB.SomeModuleAPI.mime(params)
            .then(function(content) {
                t.data.loaded = true;
                if(content.Data.length == 0){
                    t.data.hasMyData = false;
                }else{
                    if(t.data.detailData.Data){
                        content.Data.forEach(function(item){
                            t.data.detailData.Data.push(item);
                        });
                    }else{
                        t.data.detailData = content;
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
        let t = this;
        DB.SomeModuleAPI.mime(params)
            .then(function(content) {
                t.data.loaded = true;
                if(content.Data.length == 0){
                    t.data.hasGetData = false;
                }else{
                    if(t.data.detailGetData.Data){
                        content.Data.forEach(function(item){
                            t.data.detailGetData.Data.push(item);
                        });
                    }else{
                        t.data.detailGetData = content;
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
        let t = this;
        DB.SomeModuleAPI.mime(params)
            .then(function(content) {
                t.data.loaded = true;
                if(content.Data.length == 0){
                    t.data.hasUseData = false;
                }else{
                    if(t.data.detailUseData.Data){
                        content.Data.forEach(function(item){
                            t.data.detailUseData.Data.push(item);
                        });
                    }else{
                        t.data.detailUseData = content;
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
        return this.data;
    }
});
