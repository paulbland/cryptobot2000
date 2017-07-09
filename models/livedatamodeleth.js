var mongoose 	= require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var LiveDataSchema = new Schema({
    datetime_updated	: Date,
    total_coins_owned 	: Number,
    total_coins_sold 	: Number
});

// Compile model from schema
module.exports = mongoose.model('LiveDataModelETH', LiveDataSchema);