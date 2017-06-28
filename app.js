var express 	= require('express');
var app 		= express();
var fs 			= require('fs');
var path    	= require('path');

var mongoose 	= require('mongoose');



var simulation = require('./controllers/simulation.js')
//var simulation = require('./controllers/simulation')






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

// Compile model from schema
var PriceRecordModelBTC = mongoose.model('PriceRecordModelBTC', PriceRecordSchema);









// INDEX - nothing there
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
})

// THE OLD ONE - without db connection
// app.get('/sim-run-once', function(req, res) {
// 	var result = runOnce();
// 	res.send(result);
// })

// Not written yet
app.get('/sim-run-multiple', function(req, res) {
	
	PriceRecordModelBTC.find({}, function(error, price_data){
   		if (error) {
            res.json(error);
        }
        else {
        	simulation.browser_output = '';
    		simulation.runMultiple(price_data);
			res.send(simulation.browser_output);
        }
	});
})



// This is the one! 
app.get('/sim-run-once', function(req, res) {

	PriceRecordModelBTC.find({}, function(error, price_data){
   		if (error) {
            res.json(error);
        }
        else {
            // copy retund db object into dat object for texst script
    		
    		// set up some sample data here
    		// var price_data 		= require('./data/btc_data')	// 30 days of data (144*30 = 4320)
    		var hrs_in_period 		= 12; 		// working on full days = 24
    		var low_threshold 		= 0.01;		// buy price - as a %
			var high_threshold  	= 0.06;		// sell price  - as a %

    		// run the test! and send result to brwoser
    		simulation.browser_output = '';
    		simulation.runOnce(hrs_in_period, low_threshold, high_threshold, price_data);
			res.send(simulation.browser_output);
        }
	});
})


// for creating random data. wont need this anymore probably
// app.get('/create', function(req, res) {
// 	createRandomData();
// })

app.listen(process.env.PORT, function() { 
	console.log('running on port: ' + process.env.PORT)
})


















function createRandomData() {

	var buy_price;
	var sell_price;

	var difference = 0.02; // %

	var result = 'module.exports = [';

	for (i=0; i<(144*30); i++) {

		buy_price 	= (2300 + (Math.random() * 600)).toFixed(6);
		sell_price 	= (buy_price * (1 - difference)).toFixed(6);

		result += '{datetime: "xxx", value_buy : ' + buy_price + ', value_sell : ' + sell_price + '}';

		if (i != ((144*90)-1)) {
			result += ',\n';
		}

	}

	result += ']';


	fs.writeFile("btc_data.js", result, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	}); 


}