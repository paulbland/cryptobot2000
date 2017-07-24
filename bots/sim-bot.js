var simulation 	= require('../controllers/simulation')
var mongoose 	= require('mongoose');

// DATABASE
mongoose.connect(process.env.MONGODB_URI_NEW, {useMongoClient: true});  // Set up default mongoose connection
mongoose.Promise 	= global.Promise;                  					// fix promise thing

PriceRecordModels 	= require('../models/pricerecordmodel') 

PriceRecordModels['ETH'].find({}).sort('datetime').exec(function(error, price_data) {
    if (error) {
        res.json(error);
    }
    else {
        
        // run this 6 times
        // will run syncronously by default. so thats grea
        //though resutsl will chage to gotte get gets reuslts after each one
        //var results = {}
        //results['15_days'] = simulation.runFullSimulation(price_data, 'ETH', 15);
        //results['30_days'] = simulation.runFullSimulation(price_data, 'ETH', 30);
        //.....
        /// or something....

        // sort all results (this is a cut and paste) -- maybe try not to do it twice.
        simulation.all_results.sort(function(a, b) {
    		return parseFloat(b.value) - parseFloat(a.value);
        });
        
        console.log('top 10')
        console.log(simulation.all_results.slice(0, 10))
        console.log('Exiting...')
        
    }
});

/**
 * run with: `heroku local sim-bot -f Procfile.dev`
 */
