var mongoose 	= require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var PriceRecordSchema = new Schema({
    datetime	: Date,
    value_sell 	: Number,
    value_buy 	: Number
});

// Compile model from schema
module.exports = mongoose.model('PriceRecordModelETH', PriceRecordSchema);