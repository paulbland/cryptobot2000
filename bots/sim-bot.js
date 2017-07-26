var mongoose 	        = require('mongoose');
var simulation 	        = require('../controllers/simulation')
var tools 	        	= require('../controllers/tools')
var priceRecordModels   = require('../models/pricerecordmodel') 
var simVarsModelETH     = require('../models/simvarsmodel') 

mongoose.Promise 	    = global.Promise;

module.exports = {

    test_periods: [15, 30, 45, 60, 75, 90, 105, 120],  

    run: function() {
        this.dbConnect();
    },

    dbConnect: function() {
        var self    = this;
        var promise = mongoose.connect(process.env.MONGODB_URI_NEW, {
			useMongoClient: true
		});

        promise.then(function(db) {
			console.log(`sim-bot: Running! (database: ${db.db.s.databaseName})`)
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

                short_term_sums = {period:0, offset:0, low:0, high:0}
                long_term_sums  = {period:0, offset:0, low:0, high:0}

                self.test_periods.forEach(function(days) {

                    var thisResult = simulation.runFullSimulation(price_data, 'ETH', days, 'json');

                    newSimVars.result_data.push({
                        time_period : `${days}_days`,
                        this_data   : thisResult
                    })

                    // compile short term/long term avgs
                    if (days===1||days===15||days===30||days===45) {
                        short_term_sums.period  += thisResult['max_results_avg'][4]['period']
                        short_term_sums.offset  += thisResult['max_results_avg'][4]['offset']
                        short_term_sums.low     += thisResult['max_results_avg'][4]['low']
                        short_term_sums.high    += thisResult['max_results_avg'][4]['high']
                    }
                    if (days===3||days===60||days===75||days===90) {
                        long_term_sums.period   += thisResult['max_results_avg'][4]['period']
                        long_term_sums.offset   += thisResult['max_results_avg'][4]['offset']
                        long_term_sums.low      += thisResult['max_results_avg'][4]['low']
                        long_term_sums.high     += thisResult['max_results_avg'][4]['high']
                    }
                })

                newSimVars.short_term = {
                    period  : tools.roundToPoint5(short_term_sums.period / 3),
                    offset  : tools.roundToPoint5(short_term_sums.offset / 3),
                    low     : (short_term_sums.low / 3).toFixed(3),     // this converts to string
                    high    : (short_term_sums.high / 3).toFixed(3)     // this converts to string
                }

                newSimVars.long_term = {
                    period  : tools.roundToPoint5(long_term_sums.period / 3),
                    offset  : tools.roundToPoint5(long_term_sums.offset / 3),
                    low     : (long_term_sums.low / 3).toFixed(3),      // this converts to string
                    high    : (long_term_sums.high / 3).toFixed(3)      // this converts to string
                }

                newSimVars.save(function (err) {
					if (err) {
                        console.log(err)//return handleError(err);
                    } else {    
                        console.log(`sim-bot: Saved newSimVars!`);
                    }
				});
            }
        });
    }
}
