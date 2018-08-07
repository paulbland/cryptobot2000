var mongoose 	= require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var schemaSimVarsObj = {
    period  : { type: Number, default: 0 },
    offset  : { type: Number, default: 0 },
    low     : { type: Number, default: 0 },
    high    : { type: Number, default: 0 }
}

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
    '15_day_bot' : schemaSimVarsObj,
    '30_day_bot' : schemaSimVarsObj,
    '45_day_bot' : schemaSimVarsObj,
    '60_day_bot' : schemaSimVarsObj,
    '75_day_bot' : schemaSimVarsObj,
    '90_day_bot' : schemaSimVarsObj,
    '120_day_bot' : schemaSimVarsObj,
    '180_day_bot' : schemaSimVarsObj,
    '270_day_bot' : schemaSimVarsObj,
    '360_day_bot' : schemaSimVarsObj           
});

// // Compile model from schema
// var liveDataModels = []
// liveDataModels['BTC'] = mongoose.model('LiveDataModelBTC', LiveDataSchema);
// liveDataModels['ETH'] = mongoose.model('LiveDataModelETH', LiveDataSchema);
// liveDataModels['LTC'] = mongoose.model('LiveDataModelLTC', LiveDataSchema);

// module.exports = liveDataModels;

module.exports = mongoose.model('SimVarsModelETH', SimVarsSchema);