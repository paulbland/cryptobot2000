module.exports  = {

    browser_output : '',

    debug: function(str) {
        this.browser_output += str;
    },

    getFinalOutput : function() {
        return this.browser_output;
    },

    reset: function() {
        this.browser_output = '';
    }
}