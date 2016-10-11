const Actions = require('./actions');
const DB = require('../../app/db');

module.exports = Reflux.createStore({
    listenables: [Actions],
    data: {
        loaded:false,
        error:false,
    },

    updateComponent: function() {
        this.trigger(this.data);
    },

    getInitialState: function() {
        this.data = {
            loaded:false,
            error:false,
        }
        return this.data;
    }
});
