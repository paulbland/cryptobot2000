/**
 * this bot will be set to run every x minutes on the heroku scheduler
 * it sets both sell and buy price for each of the three currencies
 * 
 */
var mongoose 	= require('mongoose');
var Gdax        = require('gdax');

// DATABASE
mongoose.connect(process.env.MONGODB_URI_NEW, {useMongoClient: true});
mongoose.Promise = global.Promise;

// adding back in. sort it out at work
// //Get the default connection
// var db = mongoose.connection;

// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var priceRecordModels = require('../models/pricerecordmodel')

module.exports = {

    run: function() {
        this.getPriceData('BTC')
        this.getPriceData('ETH')
        this.getPriceData('LTC')
    },

    getPriceData: function(currency) {

        var publicClient    = new Gdax.PublicClient(currency+'-USD');
        var pr              = new priceRecordModels[currency];

        publicClient.getProductTicker(function(err, response, data) {

            pr.datetime     = data.time;
            pr.value_buy    = data.price; //bid ***** currently just getting last price !
            pr.value_sell   = data.price; //ask
            pr.value_avg    = data.price; //no point in calculating if they're the same, eh?
            
            pr.save(function (err) {
                if (err) {
                    return handleError(err);
                }
                console.log('Saved ' + currency + ' from GDAX');
            });
        });
    }
}
