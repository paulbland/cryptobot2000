/**
 * this bot will be set to run every x minutes on the heroku scheduler
 * it sets both sell and buy price for each of the three currencies
 * 
 */
var mongoose 	        = require('mongoose');
var Gdax                = require('gdax');
var priceRecordModels   = require('../models/pricerecordmodel')

module.exports = {

    currenciesComplete: 0,

    run: function() {
        this.currenciesComplete = 0;
        this.dbConnect();
    },

    dbConnect: function() {
        var self    = this;
        var promise = mongoose.connect(process.env.MONGODB_URI_NEW, {
			useMongoClient: true
        });
        
        promise.then(function(db) {
			console.log(`price-bot: Starting. (database: ${db.db.s.databaseName})`)
            //self.getPriceData('BTC')
            self.getPriceData('ETH')
            //self.getPriceData('LTC')
            /* Use `db`, for instance `db.model()` */
         });
    },

    getPriceData: function(currency) {
        var publicClient    = new Gdax.PublicClient(currency+'-USD');
        var pr              = new priceRecordModels[currency];
        var self            = this;

        publicClient.getProductTicker(function(err, response, data) {
            pr.datetime     = data.time;
            pr.value_buy    = data.price; //bid ***** currently just getting last price !
            pr.value_sell   = data.price; //ask
            pr.value_avg    = data.price; //no point in calculating if they're the same, eh?
            
            pr.save(function (err) {
                if (err) {
                    res.json(error);
					process.exit(1);
                }
                console.log('price-bot: Saved ' + currency + ' from GDAX');

                if (++self.currenciesComplete === 1) {//was 3! when im getting all three currencies (ln 27-29)
                    console.log('price-bot: Finished.');
                }
            });
        });
    }
}
