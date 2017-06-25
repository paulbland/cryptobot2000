var express 	= require('express');
var mongoose 	= require('mongoose');
var coinbase 	= require('coinbase');
var app 		= express();




// DATABASE

// Set up default mongoose connection
mongoose.connect(process.env.MONGODB_URI);

// Get the default connection
mongoose.Promise = global.Promise;
var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema
var Schema = mongoose.Schema;

var PriceRecordSchema = new Schema({
    datetime	: Date,
    value_sell 	: Number,
    value_buy 	: Number
});



// Connect to Coinbase API
var client 	= new coinbase.Client({'apiKey': process.env.COINBASE_API_KEY, 'apiSecret': process.env.COINBASE_API_SECRET});

getMyData('PriceRecordModelBTC', 'BTC')
getMyData('PriceRecordModelETH', 'ETH')
getMyData('PriceRecordModelLTC', 'LTC')


function getMyData(modelName, currency) {

	// Compile model from schema
	var PriceRecordModel = mongoose.model(modelName, PriceRecordSchema);
	var pr = new PriceRecordModel;

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
			pr.save(function (err) {
				if (err) return handleError(err);
					console.log('saved ' + currency);
					//process.exit()
			})
		});

}