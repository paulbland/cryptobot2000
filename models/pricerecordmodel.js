var mongoose 	= require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var PriceRecordSchema = new Schema({
    datetime	: Date,
    value_sell 	: Number,
    value_buy 	: Number,
    value_avg 	: Number
});

// Compile model from schema
var my_thing=[]
my_thing['BTC'] = mongoose.model('PriceRecordModelBTC', PriceRecordSchema);
my_thing['ETH'] = mongoose.model('PriceRecordModelETH', PriceRecordSchema);
my_thing['LTC'] = mongoose.model('PriceRecordModelLTC', PriceRecordSchema);


module.exports = my_thing;