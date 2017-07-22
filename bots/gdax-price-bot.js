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

var priceRecordModels = require('../models/pricerecordmodel')

getMyData('BTC')
getMyData('ETH')
getMyData('LTC')

function getMyData(currency) {

    var publicClient    = new Gdax.PublicClient(currency+'-USD');
    var pr              = new priceRecordModels[currency];

    publicClient.getProductTicker(function(err, response, data) {

        pr.datetime     = data.time;
        pr.value_buy    = data.price; //bid ***** currently just getting last price !
        pr.value_sell   = data.price; //ask
        pr.value_avg    = data.price; //no point in calcualting if they're the sema eh?
        
        pr.save(function (err) {
            if (err) {
                return handleError(err);
            }
            console.log('Saved ' + currency + ' from GDAX');
        });
    });

}
