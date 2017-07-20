/**
 * this bot will be set to run every 5/10 minutes on the heroku scheduler
 * it sets both ask and buy price for each of the three currencies
 * 
 */
var mongoose 	= require('mongoose');
var Gdax        = require('gdax');


// DATABASE
mongoose.connect(process.env.MONGODB_URI_NEW, {useMongoClient: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Define a schema
var Schema = mongoose.Schema;

var PriceRecordSchema = new Schema({
    datetime	: Date,
    value_sell 	: Number,
    value_buy 	: Number
});


getMyData('PriceRecordModelBTC', 'BTC')
getMyData('PriceRecordModelETH', 'ETH')
getMyData('PriceRecordModelLTC', 'LTC')


function getMyData(modelName, currency) {

    var publicClient = new Gdax.PublicClient(currency+'-USD');

	// Compile model from schema
	var PriceRecordModel = mongoose.model(modelName, PriceRecordSchema);
	var pr = new PriceRecordModel;

    publicClient.getProductTicker(function(err, response, data) {

        pr.datetime     = data.time;
        pr.value_buy    = data.bid;
        pr.value_sell   = data.ask;
        
        pr.save(function (err) {
            if (err) {
                return handleError(err);
            }
            console.log('Saved ' + currency + ' from GDAX');
        });
    });

}
