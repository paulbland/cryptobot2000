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
mongoose.connect(process.env.MONGODB_URI_NEW, {useMongoClient: true});  // Set up default mongoose connection
mongoose.Promise 	= global.Promise;                  					// fix promise thing
PriceRecordModels 	= require('./models/pricerecordmodel') 

// SET TEMPLATING
app.set('view engine', 'ejs');
app.set('views',__dirname + '/views'); 

// SET STATIC FILE DIRECTORIES
app.use(express.static('static'))
app.use('/results', express.static('results'))

// INDEX
app.get('/', basicAuth, function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
})

// FULL SIMULATION
app.get('/run-simulation', basicAuth, function(req, res) {	

    if (typeof req.query.currency === 'undefined') {
        res.send('No currency vars present.')
	} else if (req.query.currency !== 'BTC' && req.query.currency !== 'ETH' && req.query.currency !== 'LTC') {
		res.send('Currency must be BTC ETH or LTC')
	} else if (typeof req.query.days === 'undefined') {
        res.send('No days var present.')
	}

    PriceRecordModels[req.query.currency].find({}).sort('datetime').exec(function(error, price_data) {
   		if (error) {
            res.json(error);
        }
        else {
			simulation.runFullSimulation(price_data, req.query.currency, req.query.days, 'browser');

			res.render('result', {
                currency    : req.query.currency,       // BTC, ETH or LTC
				data 		: simulation.browser_output,
				table_data  : simulation.table_data,
				average_chart_data : simulation.average_chart_data 
			});
        }
	});
})

// SINGLE SIMULATION
app.get('/run-simulation-single', basicAuth, function(req, res) {

    if ((typeof req.query.hrs_in_period === 'undefined') || (typeof req.query.offset === 'undefined') || (typeof req.query.low_threshold === 'undefined') || 
    	(typeof req.query.high_threshold === 'undefined') || (typeof req.query.currency === 'undefined')) {
        res.send('get vars not present')
    } else if (typeof req.query.days === 'undefined') {
        res.send('No days var present.')
	}

   	PriceRecordModels[req.query.currency].find({}).sort('datetime').exec(function(error, price_data) { 
   		if (error) {
            res.json(error);
        }
        else {
            simulation.runSingleSimulation( 
				parseFloat(req.query.hrs_in_period), parseFloat(req.query.offset), 
				parseFloat(req.query.low_threshold), parseFloat(req.query.high_threshold), 
				price_data, req.query.days
			);  

			res.render('result-single', {
                currency        : req.query.currency,
				data 		    : simulation.browser_output,
				chart_data 	    : simulation.chart_data,
                summary_output  : simulation.summary_output
			});
        }
	});
})

// LIVE RESULTS
app.get('/live-result', basicAuth, function(req, res) {
    var liveDataModels = require('./models/livedatamodel')
	liveDataModels['ETH'].find({}).sort('-datetime_updated').exec(function(error, live_data_eth) {
		if (error) {
			//res.json(error);
			process.exit(1);
		}
		else {
			res.render('live-result', {
				data : live_data_eth,
				moment : moment 
			});
		}
	});
})


// SIM VARS
app.get('/sim-vars', basicAuth, function(req, res) {
    var simVarsModelETH = require('./models/simvarsmodel')
	simVarsModelETH.find({}).sort('-datetime').exec(function(error, sim_vars_eth) {
		if (error) {
			//res.json(error);
			process.exit(1);
		}
		else {
			res.render('sim-vars', {
				data_string : JSON.stringify(sim_vars_eth, null, " "),
				data 		: sim_vars_eth,
				moment 		: moment 
			});
		}
	});
})

app.listen(process.env.PORT, function() { 
	console.log('running on port: ' + process.env.PORT)
})
