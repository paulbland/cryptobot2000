/**
 * this bot ...
 * 
 * 
 */
var mongoose 			= require('mongoose');
var coinbase 			= require('coinbase');
var priceRecordModels 	= require('../models/pricerecordmodel')

// Connect to Coinbase API
var client 	= new coinbase.Client({'apiKey': process.env.COINBASE_API_KEY, 'apiSecret': process.env.COINBASE_API_SECRET});

module.exports = {

	run: function() {
        this.dbConnect();
    },

    dbConnect: function() {
        var self    = this;
        var promise = mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

        promise.then(function(db) {
			console.log(`Running: coinbase-price-bot.js (database: ${db.db.s.databaseName})`)
            self.getPriceData('BTC')
            self.getPriceData('ETH')
            self.getPriceData('LTC')
            /* Use `db`, for instance `db.model()` */
         });
    },

	getPriceData: function(currency) {

		var pr = new priceRecordModels[currency];

		// Promise
		var myPromise1 = function() {
			return new Promise(function (resolve, reject) {
				client.getSellPrice({'currencyPair': currency+'-USD'}, function(err, obj) {
					pr.value_sell = obj.data.amount;
					resolve()
				});
			});
		}

		var myPromise2 = function() {
			return new Promise(function (resolve, reject) {
				client.getBuyPrice({'currencyPair': currency+'-USD'}, function(err, obj) {
					pr.value_buy = obj.data.amount;
					resolve()
				});
			});
		}

		myPromise1()
			.then(myPromise2)
			.then(function(fulfilled) {
				pr.datetime = new Date;
				pr.value_avg = ((pr.value_buy + pr.value_sell) / 2)
				pr.save(function (err) {
					if (err) return handleError(err);
						console.log('saved ' + currency + ' from Coinbase');
				})
			});

	}
}