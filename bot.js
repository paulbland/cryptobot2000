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
    value 		: Number
});

// Compile model from schema
var PriceRecordModel = mongoose.model('PriceRecordModel', PriceRecordSchema);
	



// Connect to Coinbase API
var client = new coinbase.Client({'apiKey': process.env.COINBASE_API_KEY, 'apiSecret': process.env.COINBASE_API_SECRET});

client.getBuyPrice({'currencyPair': 'BTC-USD'}, function(err, obj) {
	
	console.log('storing date and current value in mlab: ' + obj.data.amount);

 	var pr = new PriceRecordModel;

	pr.datetime 	= new Date;
	pr.value 		= obj.data.amount;

	pr.save(function (err) {
  		if (err) return handleError(err);
  		// saved!);	

  		process.exit()
  	})
});



// app.get('/', function(req, res) {
// 	res.send('hello world');
// })

// app.listen(process.env.PORT, function() { 
// 	console.log('running on port: ' + process.env.PORT)
// })



