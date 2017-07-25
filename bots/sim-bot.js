var mongoose 	        = require('mongoose');
var simulation 	        = require('../controllers/simulation')
var priceRecordModels   = require('../models/pricerecordmodel') 

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

                // for each period we're looking at
                results['15_days'] = simulation.runFullSimulation(price_data, 'ETH', 15, 'json');
                //results['30_days'] = simulation.runFullSimulation(price_data, 'ETH', 30, 'json');
 
                console.log('top 20 - results (max and avg) is')
                console.log(results['15_days']['max_results'])
                console.log(results['15_days']['max_results_avg'])

                // ok great. next maybe make a sim model and ut this in it

                //datetime
                //top_10
                //top_10_avg

                // maybe add rank to max results. top_1, top_2, top_3...
                
            }
        });

    }


}
