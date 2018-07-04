var mongoose 	        = require('mongoose');
var simulation 	        = require('../controllers/simulation')
var tools 	        	= require('../controllers/tools')
var priceRecordModels   = require('../models/pricerecordmodel') 
var simVarsModelETH     = require('../models/simvarsmodel') 

mongoose.Promise 	    = global.Promise;

module.exports = {

    test_periods: [30, 60, 90, 120, 180, 270, 360],

    run: function() {
        this.dbConnect();
    },

    dbConnect: function() {
        var self    = this;
        var promise = mongoose.connect(process.env.MONGODB_URI_NEW, {
			useMongoClient: true
		});

        promise.then(function(db) {
			console.log(`sim-bot: Starting. (database: ${db.db.s.databaseName})`)
            self.okRunTheThing()
            /* Use `db`, for instance `db.model()` */
         });
    },

    okRunTheThing: function() {
        var self = this;

        // get price data for sim
        priceRecordModels['ETH'].find({}).sort('datetime').exec(function(error, price_data) {
            if (error) {
                res.json(error);
            }
            else {
                var newSimVars          = new simVarsModelETH();
                newSimVars.datetime     = new Date();
                newSimVars.result_data  = []

                self.test_periods.forEach(function(days) {
                    console.log(`sim-bot: Running simulation on ${days} days:`)
                    var thisResult = simulation.runFullSimulation(price_data, 'ETH', days, 'json');

                    newSimVars.result_data.push({
                        time_period : `${days}_days`,
                        this_data   : thisResult
                    })

                    // add data directly to bot name (bot key must exist in schema!...)
                    // thisResult.max_results[0]; // use this for top 1
                    newSimVars[`${days}_day_bot`] = thisResult.max_results_avg[4] // use top_5_avg
                })

                newSimVars.save(function (err) {
					if (err) {
                        console.log(err)//return handleError(err);
                    } else {    
                        console.log(`sim-bot: Finished. (Saved newSimVars)`);
                    }
				});
            }
        });
    }
}
