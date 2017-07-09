var mongoose 	= require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var LiveDataSchema = new Schema({
    datetime_updated	    : Date,
    total_coins_owned 	    : { type: Number, default: 0 },
    total_coins_sold 	    : { type: Number, default: 0 },
    latest_sell_price       : { type: Number, default: 0 }, 
    latest_buy_price        : { type: Number, default: 0 },
    transaction             : { type: String, default: '' },
    total_sell_transactions : { type: Number, default: 0 },
    total_buy_transactions  : { type: Number, default: 0 },
    total_spent             : { type: Number, default: 0 },
    total_buy_transactions  : { type: Number, default: 0 },
    number_of_coins_to_sell : { type: Number, default: 0 },
    transaction_notes       : { type: String, default: '' },
    api_response_err        : { type: String, default: '' },
    api_response_xfer       : { type: String, default: '' }
});

// Compile model from schema
module.exports = mongoose.model('LiveDataModelETH', LiveDataSchema);