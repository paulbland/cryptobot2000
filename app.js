var express 	= require('express');
var app 		= express();
var fs 			= require('fs');
var path    	= require('path');
var mongoose 	= require('mongoose');
var moment 		= require('moment-timezone');

var simulation 	= require('./controllers/simulation')
var tools 		= require('./controllers/tools')
var basicAuth   = require('./controllers/auth');



// DATABASE
mongoose.connect(process.env.MONGODB_URI_NEW, {useMongoClient: true});      // Set up default mongoose connection
mongoose.Promise = global.Promise;                  						// fix promise thing
//var db = mongoose.connection;                    						 	// Get the default connection
//db.on('error', console.error.bind(console, 'MongoDB connection error:')); // Bind connection to error event (to get notification of connection errors)




// THIS DIDNT WORK??
// var timeout = require('connect-timeout'); //express v4

// app.use(timeout('300s'));
// app.use(haltOnTimedout);

// function haltOnTimedout(req, res, next){
//   if (!req.timedout) next();
// }




// SET TEMPLATING
app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');



// SET STATIC FILE DIRECTORIES
app.use(express.static('static'))
app.use('/results', express.static('results'))



// GET MODELS
PriceRecordModels = require('./models/pricerecordmodel') 



// INDEX - nothing there
app.get('/', basicAuth, function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
})



// run the simulation many time - with all combinations of parameters
app.get('/run-simulation', basicAuth, function(req, res) {	

    if (typeof req.query.currency === 'undefined') {
        res.send('No currency vars present.')
	} else if (req.query.currency !== 'BTC' && req.query.currency !== 'ETH' && req.query.currency !== 'LTC') {
		 res.send('Currency must be BTC ETH or LTC')
	}

    PriceRecordModels[req.query.currency].find({}).sort('datetime').exec(function(error, price_data) {
   		if (error) {
            res.json(error);
        }
        else {
			if (req.query.reverse === 'true') {
				price_data = price_data.reverse()
			}

			simulation.runFullSimulation(price_data, req.query.currency);

			res.render('result', {
                currency    : req.query.currency,       // BTC, ETH or LTC
				data 		: simulation.browser_output,
                chart_data  : simulation.chart_data,
				table_data  : simulation.table_data,
				average_chart_data : simulation.average_chart_data 
			});
        }
	});
})



// Run the simulation once - with specifica parameters
app.get('/run-simulation-single', basicAuth, function(req, res) {

    if ((typeof req.query.hrs_in_period === 'undefined') || (typeof req.query.offset === 'undefined') || (typeof req.query.low_threshold === 'undefined') || 
    	(typeof req.query.high_threshold === 'undefined') || (typeof req.query.currency === 'undefined')) {
        res.send('get vars not present')
    }

   	PriceRecordModels[req.query.currency].find({}).sort('datetime').exec(function(error, price_data) { 
   		if (error) {
            res.json(error);
        }
        else {

			// need to add this to cell link before it works...! and the data isnt there....
			// if (req.query.reverse === 'true') {
			// 	price_data = price_data.reverse()
			// }

            simulation.runSingleSimulation(parseFloat(req.query.hrs_in_period), parseFloat(req.query.offset), 
                	parseFloat(req.query.low_threshold), parseFloat(req.query.high_threshold), price_data);  

			res.render('result-single', {
                currency        : req.query.currency,
				data 		    : simulation.browser_output,
				chart_data 	    : simulation.chart_data,
                table_data      : '',
                summary_output  : simulation.summary_output
			});
        }
	});
})



// just print whatevers in the live result table to the browser
app.get('/live-result', basicAuth, function(req, res) {

    var liveDataModelETH = require('./models/livedatamodeleth')

	liveDataModelETH.find({}).sort('-datetime_updated').exec(function(error, live_data_eth) {
		if (error) {
			//res.json(error);
			process.exit(1);
		}
		else {
           // res.setHeader('Content-Type', 'application/json');
           // res.send(JSON.stringify(live_data_eth, null, "  "));
			res.render('live-result', {
				data : live_data_eth,
				moment: moment 
			});
		}
	});

})



app.listen(process.env.PORT, function() { 
	console.log('running on port: ' + process.env.PORT)
})

