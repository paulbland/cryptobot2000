var mongoose 	= require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var LiveDataSchema = new Schema({

    datetime_updated	    : Date,
    latest_sell_price       : { type: Number, default: 0 }, 
    latest_buy_price        : { type: Number, default: 0 },
    avg_for_period          : { type: Number, default: 0 },
    avg_plus_high_threshold : { type: Number, default: 0 },
    avg_minus_low_threshold : { type: Number, default: 0 },
    program_vars: {
        low_threshold 		: { type: Number, default: 0 },
		high_threshold 		: { type: Number, default: 0 },
		buy_sell_percentage	: { type: Number, default: 0 },
		buy_sell_unit	 	: { type: Number, default: 0 },
		period	 	        : { type: Number, default: 0 },
		offset	 	        : { type: Number, default: 0 },
		reinvest_profit	 	: Boolean
    },
    totals: {
        total_coins_owned 	    : { type: Number, default: 0 },
        total_coins_sold_value 	: { type: Number, default: 0 },
        total_sell_transactions : { type: Number, default: 0 },
        total_spent             : { type: Number, default: 0 },
        total_buy_transactions  : { type: Number, default: 0 },
        current_value_of_coins_owned  : { type: Number, default: 0 },
        current_position        : { type: Number, default: 0 },
        money_in_bank           : { type: Number, default: 0 }
    },
    transaction: {
        transaction             : { type: String, default: '' },
        number_of_coins_to_sell : { type: Number, default: 0 },
        result_of_this_sale     : { type: Number, default: 0 },
        transaction_notes       : { type: String, default: '' },
        api_response_err        : { type: String, default: '' },
        api_response_xfer       : { type: String, default: '' },
        number_of_coins_to_buy  : { type: Number, default: 0 },
        amount_spent_on_this_transaction : { type: Number, default: 0 }
    } 
});

// Compile model from schema
module.exports = mongoose.model('LiveDataModelETH', LiveDataSchema);