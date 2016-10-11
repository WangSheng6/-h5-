const Actions = require('./actions');
const DB = require('../../app/db');

module.exports = Reflux.createStore({
    listenables: [Actions],
    data: {
        loaded: false,
        error:'',
        status:'',
        msg:''
    },

    onFetch: function(params, cb) {
        let t = this;
        //t.data.loaded = true;
        //t.updateComponent();
        //cb && cb(t.data);
        DB.SomeModuleAPI.postData(params)
            .then(function(content) {
                alert(JSON.stringify(content))
                t.data.loaded = true;
                t.data.status = content.Data.Status;
                t.data.msg = content.Data.Message;
                //alert(JSON.stringify(content));
                //t.data.content = content;
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
