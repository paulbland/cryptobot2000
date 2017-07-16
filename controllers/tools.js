var reporting 	= require('./reporting')


module.exports  = {

	createRandomData: function() {

		var buy_price;
		var sell_price;

		var difference = 0.02; // %

		var result = 'module.exports = [';

		for (i=0; i<(144*30); i++) {

			buy_price 	= (2300 + (Math.random() * 600)).toFixed(6);
			sell_price 	= (buy_price * (1 - difference)).toFixed(6);

			result += '{datetime: "xxx", value_buy : ' + buy_price + ', value_sell : ' + sell_price + '}';

			if (i != ((144*90)-1)) {
				result += ',\n';
			}

		}

		result += ']';


		fs.writeFile("btc_data.js", result, function(err) {
		    if(err) {
		        return console.log(err);
		    }

		    console.log("The file was saved!");
		}); 
	},



	calculateAverage: function(data_to_be_tested) {
		var sum = 0;

		for (j=0; j < data_to_be_tested.length; j++) {
			sum += ((data_to_be_tested[j].value_buy + data_to_be_tested[j].value_sell) / 2);
		}
		return (sum/data_to_be_tested.length).toFixed(2); // orig was 24 hrs 'avg_for_24_hrs'
	},



	// return highest sell price
	// *****IT IS USING BUY PRICE! which should it be?
	calculateHigh: function(data_to_be_tested) {
		var highest = 0

		for (j=0; j < data_to_be_tested.length; j++) {
			highest = (data_to_be_tested[j].value_buy > highest) ? data_to_be_tested[j].value_buy : highest;
		}

		return highest;
	}, 


	calculateLow: function(data_to_be_tested) {
		// return lowest buy price

		var lowest = data_to_be_tested[0].value_sell;

		for (j=0; j < data_to_be_tested.length; j++) {
			lowest = (data_to_be_tested[j].value_sell < lowest) ? data_to_be_tested[j].value_sell : lowest;
		}

		return lowest;
	},



	calculateAvgPlusHighThreshold: function(avg_for_period, high_threshold) {
		return (avg_for_period * (1 + high_threshold));
	},


	calculateAvgMinusLowThreshold: function(avg_for_period, low_threshold) {
		return (avg_for_period * (1 - low_threshold));
	},




	/* 
	* this function takes a slide of the array (144 values for a day, fewer for other periods) and decides on selling or buying
	*/
	decideBuyOrSell: function(data_to_be_tested, latest_buy_price, latest_sell_price, low_threshold, high_threshold, buy_sell_method, print_full_debug) {

		var avg_for_period 				= this.calculateAverage(data_to_be_tested)						// get avg for period
		var avg_plus_high_threshold 	= this.calculateAvgPlusHighThreshold(avg_for_period, high_threshold);
		var avg_minus_low_threshold 	= this.calculateAvgMinusLowThreshold(avg_for_period, low_threshold)
		var high_for_period 			= this.calculateHigh(data_to_be_tested)						// get avg for period
		var low_for_period 				= this.calculateLow(data_to_be_tested)						// get avg for period
		var high_minus_high_threshold 	= (high_for_period * (1 - high_threshold)).toFixed(2);
		var low_plus_low_threshold 		= (low_for_period * (1 + low_threshold)).toFixed(2);
	
		if (buy_sell_method === 'avg') {

			var sell 	= (latest_sell_price > avg_plus_high_threshold) ? true : false;
			var buy 	= (latest_buy_price < avg_minus_low_threshold) ? true : false;

			if (print_full_debug) {
				reporting.debug('avg_for_period: $' + avg_for_period + '<br>');// print avg result to browser
				reporting.debug('(avg price plus high threshold ('+high_threshold+'%) is ' + avg_plus_high_threshold + ')<br />');
				reporting.debug('(avg price minus low threshold ('+low_threshold+'%) is ' + avg_minus_low_threshold + ')<br />');
			}

		} else if (buy_sell_method === 'peak') {

			var sell 	= (latest_sell_price > high_minus_high_threshold) ? true : false;
			var buy 	= (latest_buy_price < low_plus_low_threshold) ? true : false;

			if (print_full_debug) {
				reporting.debug('high_for_period is: $' + high_for_period + '<br>');// print avg result to browser
				reporting.debug('low_for_period is: $' + low_for_period + '<br>');// print avg result to browser
				reporting.debug('high_minus_high_threshold is: $' + high_minus_high_threshold + '<br>');// print avg result to browser
				reporting.debug('low_plus_low_threshold is: $' + low_plus_low_threshold + '<br>');// print avg result to browser
			}

		} else {
			return;
		}

		if (sell) {
			return 'sell';
		} else if (buy) {
			return 'buy';
		} else {
			return 'do_nothing';
		}
	},


	calculateValuesForGivenPeriod: function(hrs_in_period, interval_in_minutes) {
		return ((hrs_in_period * 60) / interval_in_minutes); 	// 144 10-min incremetns in a 24 hr period)
	},



	sellCoin: function(high_threshold, print_full_debug, sell_all, total_coins_owned, buy_sell_unit, current_coin_price_sell) {

		// wrapper must check for 0 coins

		if (sell_all) {
			var number_of_coins_to_sell = total_coins_owned							// SELL EVERYTHING
		} else {
			var number_of_coins_to_sell = (buy_sell_unit / current_coin_price_sell)	// SELL LIMIT

			if (number_of_coins_to_sell > total_coins_owned) {
				number_of_coins_to_sell = total_coins_owned
			}
		}

		var result_of_this_sale = (current_coin_price_sell * number_of_coins_to_sell)

		var transaction_notes = 'Selling ' + number_of_coins_to_sell.toFixed(2) + ' coins values at $' + current_coin_price_sell.toFixed(2) + ' each for a total sale of $' + result_of_this_sale.toFixed(2);

		
		if (print_full_debug) {
			reporting.debug('<span style="color:red">TRANSACTION: SELL ' + number_of_coins_to_sell + ' of my ' +  total_coins_owned + ' coins valued at $');
			reporting.debug(current_coin_price_sell + ' = $' + result_of_this_sale + '</span><br />');
		}

		return {
			"number_of_coins_to_sell" 	: number_of_coins_to_sell,
			"result_of_this_sale" 		: result_of_this_sale,
			"transaction_notes" 		: transaction_notes
		}


	},






	buyCoin: function(total_coins_owned, buy_sell_unit, current_coin_price_buy, print_full_debug, latest_sell_price, total_spent, total_sold, money_in_bank)  { 

		// expected number of coins to buy
		var number_of_coins_to_buy 					= (buy_sell_unit / current_coin_price_buy);
		var amount_spent_on_this_transaction 		= buy_sell_unit;

		var transaction_notes = 'Buying ' + number_of_coins_to_buy.toFixed(2) + ' coins valued at $' + current_coin_price_buy.toFixed(2) + ' each for a total purchase of $' + amount_spent_on_this_transaction.toFixed(2);

		if (print_full_debug) {
			reporting.debug('buy_sell_unit: ' 							+ buy_sell_unit + '<br />');
			reporting.debug('current_coin_price_buy: ' 					+ current_coin_price_buy + '<br />');
			reporting.debug('total_coins_owned: ' 						+ total_coins_owned + '<br />');
			reporting.debug('number_of_coins_to_buy: ' 					+ number_of_coins_to_buy + '<br />');
			reporting.debug('amount_spent_on_this_transaction: ' 		+ amount_spent_on_this_transaction + '<br />');
		}

		// value i own right now (not including currently owned coins)
		var profit = (total_spent - total_sold);

		// THIS WILL SPEND PROFIT
		if (money_in_bank < buy_sell_unit) {

		// THIS WILL RETAIN PROFIT
		//if ((money_in_bank - profit) < buy_sell_unit) {
																						
			 number_of_coins_to_buy 			= 0;
			 amount_spent_on_this_transaction 	= 0;

			transaction_notes += '***reached limit*** - setting number_of_coins_to_buy/amount_spent_on_this_transaction to 0';

			if (print_full_debug) {
				reporting.debug('***reached limit!***<br />')
				reporting.debug('---setting number_of_coins_to_buy and amount_spent_on_this_transaction to 0<br />');
			}

		}


		// if flag set, and already own coins -- dont buy again
		// should mean you only ever buy one unit
		// if (this.buy_only_once && (total_coins_owned > 0)) {

		// 	if (this.print_full_debug) {
		// 		reporting.debug('not buying -- already own');
		// 	}
		// 	return;
		// }


		// return some vars for sim to update 
		return {
			"number_of_coins_to_buy" 			: number_of_coins_to_buy,
			"amount_spent_on_this_transaction" 	: amount_spent_on_this_transaction,
			"transaction_notes" 				: transaction_notes
		}

	},

	getArrayAverage(arr) {
		var sum = arr.reduce(function add(a, b) {
    		return a + b;
		}, 0);
		return (sum / arr.length)
	}


}