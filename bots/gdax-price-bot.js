/**
 * this bot will be set to run every x minutes on the heroku scheduler
 * it sets both sell and buy price for each of the three currencies
 * 
 */
var mongoose 	        = require('mongoose');
var Gdax                = require('gdax');
var priceRecordModels   = require('../models/pricerecordmodel')

module.exports = {

    run: function() {
        this.dbConnect();
    },

    dbConnect: function() {
        var self    = this;
        var promise = mongoose.connect(process.env.MONGODB_URI_NEW, {useMongoClient: true});

        promise.then(function(db) {
			console.log(`Running: gdax-price-bot.js (database: ${db.db.s.databaseName})`)
            self.getPriceData('BTC')
            self.getPriceData('ETH')
            self.getPriceData('LTC')
            /* Use `db`, for instance `db.model()` */
         });
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
