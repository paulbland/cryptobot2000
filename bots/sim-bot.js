var mongoose 	        = require('mongoose');
var simulation 	        = require('../controllers/simulation')
var priceRecordModels   = require('../models/pricerecordmodel') 
var simVarsModelETH     = require('../models/simvarsmodel') 

mongoose.Promise 	    = global.Promise;

module.exports = {

    run: function() {
        this.dbConnect();
    },

    dbConnect: function() {
        var self    = this;
        var promise = mongoose.connect(process.env.MONGODB_URI_NEW, {
			useMongoClient: true
		});

        promise.then(function(db) {
			console.log(`Running: sim-bot.js (database: ${db.db.s.databaseName})`)
            self.okRunTheThing()
            /* Use `db`, for instance `db.model()` */
         });
    },

    okRunTheThing: function() {

        // get price data for sim
        priceRecordModels['ETH'].find({}).sort('datetime').exec(function(error, price_data) {
            if (error) {
                res.json(error);
            }
            else {
                var results = {}
                var test_periods = [1, 2, 3] //[15, 30, 45, 60, 75, 90]

                test_periods.forEach(function(days) {
                    results[`${days}_days`] = simulation.runFullSimulation(price_data, 'ETH', days, 'json');
                })
                //console.log(results)

                // so to regenerate my google sheet
                // console.log('90 days/top 5:', results['90_days']['max_results_avg'][4])
                // console.log('75 days/top 5:', results['75_days']['max_results_avg'][4])
                // console.log('60 days/top 5:', results['60_days']['max_results_avg'][4])
                // console.log('45 days/top 5:', results['45_days']['max_results_avg'][4])
                // console.log('30 days/top 5:', results['30_days']['max_results_avg'][4])
                // console.log('15 days/top 5:', results['15_days']['max_results_avg'][4])

                // ok great. next maybe make a sim model and ut this in it

                //datetime
                //top_10
                //top_10_avg

                // maybe add rank to max results. top_1, top_2, top_3... (maynbe just {rank : 1})

                var short_term = {
                    period : ((results['1_days']['max_results_avg'][4]['period'] + results['2_days']['max_results_avg'][4]['period'] + results['3_days']['max_results_avg'][4]['period']) / 3),
                }
                var long_term = {

                }

                var newSimVars = new simVarsModelETH();

                newSimVars.datetime         = new Date();
                newSimVars.max_results      = [
                    results['1_days']['max_results'],
                    results['2_days']['max_results'],
                    results['3_days']['max_results']
                ]
                newSimVars.max_results_avg  = [
                    results['1_days']['max_results_avg'],
                    results['2_days']['max_results_avg'],
                    results['3_days']['max_results_avg']
                ]
                newSimVars.short_term       = short_term;
                newSimVars.longterm         = long_term;
            
                newSimVars.save(function (err) {
					if (err) {
                        return handleError(err);
                    }
					console.log('Saved newSimVars!');
				})



                
            }
        });

    }


}
