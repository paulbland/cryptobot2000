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




	/* 
	* this function takes a slide of the array (144 values for a day, fewer for other periods) and decides on selling or buying
	*/
	decideBuyOrSell: function(data_to_be_tested, latest_buy_price, latest_sell_price, low_threshold, high_threshold, buy_sell_method, print_full_debug) {

		var avg_for_period 				= this.calculateAverage(data_to_be_tested)						// get avg for period
		var avg_plus_high_threshold 	= (avg_for_period * (1 + high_threshold)).toFixed(2);
		var avg_minus_low_threshold 	= (avg_for_period * (1 - low_threshold)).toFixed(2);
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
			return false;
		}
	},


	calculateValuesForGivenPeriod: function(hrs_in_period, interval_in_minutes) {
		return ((hrs_in_period * 60) / interval_in_minutes); 	// 144 10-min incremetns in a 24 hr period)
	}	


}