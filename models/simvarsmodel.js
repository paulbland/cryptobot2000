var mongoose 	= require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var SimVarsSchema = new Schema({
    datetime	: Date,
    max_results : [
        {
            rank    : { type: Number, default: 0 },
            period  : { type: Number, default: 0 },
            offset  : { type: Number, default: 0 },
            low     : { type: Number, default: 0 },
            high    : { type: Number, default: 0 }
        }
    ],
    max_results_avg : [
        {
            rank    : { type: Number, default: 0 },
            period  : { type: Number, default: 0 },
            offset  : { type: Number, default: 0 },
            low     : { type: Number, default: 0 },
            high    : { type: Number, default: 0 }
        }
    ],
    short_term: {
        period  : { type: Number, default: 0 },
        offset  : { type: Number, default: 0 },
        low     : { type: Number, default: 0 },
        high    : { type: Number, default: 0 }
    },
    long_term : {
        period  : { type: Number, default: 0 },
        offset  : { type: Number, default: 0 },
        low     : { type: Number, default: 0 },
        high    : { type: Number, default: 0 }
    } 
    

    /* { type: String, default: '' }, */
       
});

// // Compile model from schema
// var liveDataModels = []
// liveDataModels['BTC'] = mongoose.model('LiveDataModelBTC', LiveDataSchema);
// liveDataModels['ETH'] = mongoose.model('LiveDataModelETH', LiveDataSchema);
// liveDataModels['LTC'] = mongoose.model('LiveDataModelLTC', LiveDataSchema);

// module.exports = liveDataModels;

module.exports = mongoose.model('SimVarsModelETH', SimVarsSchema);