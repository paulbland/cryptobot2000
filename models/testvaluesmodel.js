var mongoose 	= require('mongoose');

var Schema = mongoose.Schema;

var testValuesObj = {
    'low_from'           : { type: Number, default: 0 },
    'low_to'             : { type: Number, default: 0 },
    'high_from'          : { type: Number, default: 0 },
    'high_to'            : { type: Number, default: 0 },
    'period_offset_from' : { type: Number, default: 0 },
    'period_offset_to'   : { type: Number, default: 0 }
}

var TestValuesSchema = new Schema({
    datetime    : Date,
    '30_days'   : testValuesObj,
    '45_days'   : testValuesObj,
    '60_days'   : testValuesObj,
    '75_days'   : testValuesObj,
    '90_days'   : testValuesObj          
});

module.exports = mongoose.model('TestValuesModel', TestValuesSchema);