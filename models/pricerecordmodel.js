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
var priceRecordModels = []
priceRecordModels['BTC'] = mongoose.model('PriceRecordModelBTC', PriceRecordSchema);
priceRecordModels['ETH'] = mongoose.model('PriceRecordModelETH', PriceRecordSchema);
priceRecordModels['LTC'] = mongoose.model('PriceRecordModelLTC', PriceRecordSchema);

module.exports = priceRecordModels;