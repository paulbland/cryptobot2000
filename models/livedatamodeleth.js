var mongoose 	= require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var LiveDataSchema = new Schema({
    datetime_updated	    : Date,
    total_coins_owned 	    : Number,
    total_coins_sold 	    : Number,
    latest_sell_price       : Number, 
    latest_buy_price        : Number,
    transaction             : String,
    total_sell_transactions : Number,
    total_buy_transactions  : Number,
    total_spent             : Number,
    total_buy_transactions  : Number
});

// Compile model from schema
module.exports = mongoose.model('LiveDataModelETH', LiveDataSchema);