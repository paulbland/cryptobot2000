var mongoose 	= require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var SimVarsSchema = new Schema({
    datetime	: Date,
    result_data : [{
        time_period : { type: String, default: '' },
        this_data        : {
            max_results : [{
                rank    : { type: Number, default: 0 },
                period  : { type: Number, default: 0 },
                offset  : { type: Number, default: 0 },
                low     : { type: Number, default: 0 },
                high    : { type: Number, default: 0 },
                value   : { type: Number, default: 0 },
                profit  : { type: Number, default: 0 }
            }],
            max_results_avg : [{
                rank    : { type: String, default: '' },
                period  : { type: Number, default: 0 },
                offset  : { type: Number, default: 0 },
                low     : { type: Number, default: 0 },
                high    : { type: Number, default: 0 }
            }]
        }
    }],
    short_term: {
        period  : { type: Number, default: 0 },
        offset  : { type: Number, default: 0 },
        low     : { type: String, default: '' },    // string because limited to 3 decimals
        high    : { type: String, default: '' }     // string because limited to 3 decimals
    },
    long_term : {
        period  : { type: Number, default: 0 },
        offset  : { type: Number, default: 0 },
        low     : { type: String, default: '' },    // string because limited to 3 decimals
        high    : { type: String, default: '' }     // string because limited to 3 decimals
    }           
});

// // Compile model from schema
// var liveDataModels = []
// liveDataModels['BTC'] = mongoose.model('LiveDataModelBTC', LiveDataSchema);
// liveDataModels['ETH'] = mongoose.model('LiveDataModelETH', LiveDataSchema);
// liveDataModels['LTC'] = mongoose.model('LiveDataModelLTC', LiveDataSchema);

// module.exports = liveDataModels;

module.exports = mongoose.model('SimVarsModelETH', SimVarsSchema);