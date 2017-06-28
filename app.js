var express 	= require('express');
var app 		= express();
var fs 			= require('fs');
var path    	= require('path');
var mongoose 	= require('mongoose');

var simulation 	= require('./controllers/simulation')
var tools 		= require('./controllers/tools')



app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');






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
var PriceRecordModelETH = mongoose.model('PriceRecordModelETH', PriceRecordSchema);
var PriceRecordModelLTC = mongoose.model('PriceRecordModelLTC', PriceRecordSchema);

// var price_data 		= require('./data/btc_data')	// 30 days of data (144*30 = 4320)






// INDEX - nothing there
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
})


// run the simulation many time - with all combinations of parameters
app.get('/sim-run-multiple', function(req, res) {
	
	PriceRecordModelBTC.find({}, function(error, price_data){
   		if (error) {
            res.json(error);
        }
        else {
        	simulation.browser_output = '';
    		simulation.runMultiple(price_data);
			res.render('result', {
				data : simulation.browser_output
			});
        }
	});
})


// Run the simulation once - with specifica parameters
app.get('/sim-run-once', function(req, res) {

	PriceRecordModelBTC.find({}, function(error, price_data){
   		if (error) {
            res.json(error);
        }
        else {
    		simulation.browser_output = '';
    		simulation.runOnce(12, 0.01, 0.06, price_data);
			res.render('result', {
				data : simulation.browser_output
			});
        }
	});
})


// for creating random data. wont need this anymore probably
app.get('/create-data', function(req, res) {
	//tools.createRandomData();
})

app.listen(process.env.PORT, function() { 
	console.log('running on port: ' + process.env.PORT)
})




