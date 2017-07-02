var express 	= require('express');
var app 		= express();
var fs 			= require('fs');
var path    	= require('path');
var mongoose 	= require('mongoose');

var simulation 	= require('./controllers/simulation')
var tools 		= require('./controllers/tools')



// SET TEMPLATING
app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');




// DATABASE
mongoose.connect(process.env.MONGODB_URI);          // Set up default mongoose connection
mongoose.Promise = global.Promise;                  // fix promise thing
//var db = mongoose.connection;                     // Get the default connection
//db.on('error', console.error.bind(console, 'MongoDB connection error:')); // Bind connection to error event (to get notification of connection errors)




// GET MODELS
var PriceRecordModelBTC = require('./models/pricerecordmodelbtc')
var PriceRecordModelETH = require('./models/pricerecordmodeleth')
var PriceRecordModelLTC = require('./models/pricerecordmodelltc')





// INDEX - nothing there
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
})



// run the simulation many time - with all combinations of parameters
app.get('/run-simulation', function(req, res) {	
	PriceRecordModelETH.find({}, function(error, price_data){
   		if (error) {
            res.json(error);
        }
        else {
    		simulation.runFullSimulation(price_data);
			res.render('result', {
                currency    : 'ETH',
				data 		: simulation.browser_output,
                chart_data  : simulation.chart_data,
                table_data  : simulation.table_data
			});
        }
	});
})



// Run the simulation once - with specifica parameters
app.get('/run-simulation-single', function(req, res) {

    if ((typeof req.query.hrs_in_period === 'undefined') || (typeof req.query.offset === 'undefined') || 
        (typeof req.query.low_threshold === 'undefined') || (typeof req.query.high_threshold === 'undefined')) {
        res.send('get vars not present')
    }

	PriceRecordModelETH.find({}, function(error, price_data) { 
   		if (error) {
            res.json(error);
        }
        else {

            simulation.runSingleSimulation(parseInt(req.query.hrs_in_period), parseInt(req.query.offset), 
                    parseInt(req.query.low_threshold), parseInt(req.query.high_threshold), price_data);  

			res.render('result', {
                currency    : 'ETH',
				data 		: simulation.browser_output,
				chart_data 	: simulation.chart_data,
                table_data  : ''
			});
        }
	});
})





// 
app.get('/print-graph-data', function(req, res) {
	PriceRecordModelBTC.find({}, function(error, price_data) { 
   		if (error) {
            res.json(error);
        }
        else {
    		simulation.printGraphData(price_data);
			res.render('result', {
				data: simulation.browser_output,
				chart_data 	: simulation.chart_data
			});
        }
	});
})





// Run the simulation once - with specifica parameters
// app.get('/run-simulation-single-static', function(req, res) {

// 	simulation.browser_output 	= '';
// 	var price_data 				= require('./data/btc_data')    // 30 days of data (144*30 = 4320)

//     simulation.runSingleSimulation(24, 24, 0.01, 0.06, price_data);
// 	res.render('result', {
// 		data : simulation.browser_output
// 	});
    
// })




// for creating random data. wont need this anymore probably
// app.get('/create-data', function(req, res) {
// 	tools.createRandomData();
// })

app.listen(process.env.PORT, function() { 
	console.log('running on port: ' + process.env.PORT)
})




