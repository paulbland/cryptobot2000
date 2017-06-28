module.exports = {



	// Variables accessed globally defined here

	// not changed by refresh!!?!?!

	total_coins_owned 	: null,
	buy_sell_unit 		: null,
	total_spent 		: null,
	total_sold 			: null,
	total_transactions 	: null,
	max_coins_ever_owned: null,
	max_value_ever_owned: null,
	browser_output 		: '',
	show_full_debug		: false,



	runMultiple : function() {


	},


	runOnce : function(hrs_in_period, low_threshold, high_threshold, price_data) {

		var interval_in_minutes		= 10												// how often data is collected in minutes
		var values_per_period 		= ((hrs_in_period * 60) / interval_in_minutes); 	// 144; // there are 144 10-min incremetns in a day (24 hrs period)
		var days_in_records 		= ((price_data.length/24/60)*interval_in_minutes);

		// need to be reset here because for some reason dont change on refresh?!?
		this.total_coins_owned 		= 0;
		this.buy_sell_unit 			= 100;
		this.total_spent			= 0;
		this.total_sold				= 0;
		this.total_transactions	 	= 0;
		this.max_coins_ever_owned 	= 0;
		this.max_value_ever_owned 	= 0;
		this.browser_output			= '';

		this.debug('analyzing: ' + price_data.length + ' values ('+days_in_records.toFixed(2)+' days)<br />');
		this.debug('hrs_in_period: ' + hrs_in_period+'<br />');
		this.debug('low_threshold: ' + low_threshold+'<br />');
		this.debug('high_threshold: ' + high_threshold+'<br /><br />');

		var limit = (price_data.length - values_per_period)

		for (i=0; i<=limit; i++) {
			
			// define start and end indexes for main array
			if (this.show_full_debug) {
				this.debug('<strong><u>Period ' + Math.floor((i+values_per_period)/values_per_period) + ' of ' + (price_data.length/values_per_period).toFixed(2) + ' ');
				this.debug('(in '+hrs_in_period+' hr periods)</u></strong> ');
				this.debug('(' + days_in_records.toFixed(2) + ' days) ');
				this.debug('(increment ' + ((i % values_per_period)+1) + ' of ' + values_per_period + ') ');
				this.debug('testing slice: ' + i + ' --> ' + (i+values_per_period) + '<br />');
			}

			// get 24 hrs worth of data (As a slice of 144 values)
			// actually not just 24 hrs anymore. "a period" of 24 hrs )For example) is 144 values
			var data_to_be_tested = price_data.slice(i, (i+values_per_period));

			var final_iteration = (i === limit) ? true : false;

			// run the decide algorithm on just this part
			this.decideBuyOrSell(data_to_be_tested, low_threshold, high_threshold, final_iteration)
		}

	},


	/* 
	* this function takes a slide of the array (144 values for a day, less for other periods) and decides on selling or buying
	*/
	decideBuyOrSell : function(data_to_be_tested, low_threshold, high_threshold, final_iteration) {

		// print length to browser to make sure correct
		//this.browser_output += 'length is: ' + data_to_be_tested.length + '<br>';

		// calculate avg
		var sum = 0;
		for (j=0; j<data_to_be_tested.length; j++) {
			sum += ((data_to_be_tested[j].value_buy+data_to_be_tested[j].value_sell)/2);
		}
		var avg_for_period = (sum/data_to_be_tested.length).toFixed(2); // orig was 24 hrs 'avg_for_24_hrs'

		
		if (this.show_full_debug) {
			this.debug('data collected at: ' + data_to_be_tested[data_to_be_tested.length-1].datetime + '<br />');// print result
			this.debug('average price for last 24 hrs is: $' + avg_for_period + '<br>');// print avg result to browser
		}

		// get latest prices
		var latest_buy_price 	= data_to_be_tested[data_to_be_tested.length-1].value_buy;	// this will be the currect price we're evaluating
		var latest_sell_price 	= data_to_be_tested[data_to_be_tested.length-1].value_sell;	// this will be the currect price we're evaluating

		// print latest to browser
		if (this.show_full_debug) {
			this.debug('latest buy price: $' + latest_buy_price.toFixed(2) + '<br>');
			this.debug('latest sell price: $' + latest_sell_price.toFixed(2) + '<br>');
		}

		var avg_plus_high_threshold = (avg_for_period * (1 + high_threshold)).toFixed(2);
		var avg_minus_low_threshold = (avg_for_period * (1 - low_threshold)).toFixed(2);

		if (this.show_full_debug) {
			this.debug('(avg price plus high threshold ('+high_threshold+'%) is ' + avg_plus_high_threshold + ')<br />');
			this.debug('(avg price minus low threshold ('+low_threshold+'%) is ' + avg_minus_low_threshold + ')<br />');
		}

		if (latest_sell_price > avg_plus_high_threshold) {

			// check if price is higher than period avg + threshold
			if (this.show_full_debug) {
				this.debug('latest price is higher than +' + high_threshold + '% --- sell!<br />');
			}
			this.sellCoin(latest_sell_price)

		} else if (latest_buy_price < avg_minus_low_threshold) {

			// check if price is lwoer than period avg - threshold
			if (this.show_full_debug) {
				this.debug('latest price is lower than -' + high_threshold + '% --- buy!<br />');
			}
			this.buyCoin(latest_buy_price)

		} else {
			if (this.show_full_debug) {
				this.debug('Neither higher nor lower -> do nothing<br />');
			}
		}

		if (this.show_full_debug || final_iteration) {
			this.printCurrentPosition(latest_buy_price, latest_sell_price);
		}


	},

	 buyCoin : function(current_coin_price_buy) {

		// i think this line will mean you only make one purchase at a time
		//if (this.total_coins_owned > 0) return false;

		var number_of_coins_to_buy 	= (this.buy_sell_unit/current_coin_price_buy)

		this.total_coins_owned 			+= number_of_coins_to_buy;
		this.total_spent 				+= this.buy_sell_unit;
		this.total_transactions++;

		// update value for max coins ever owned
		this.max_coins_ever_owned = (this.total_coins_owned > this.max_coins_ever_owned) ? this.total_coins_owned : this.max_coins_ever_owned;

		// update value for max value of coins ever owned
		var value_of_coins_owned_right_now = (this.total_coins_owned * current_coin_price_buy)
		this.max_value_ever_owned = (value_of_coins_owned_right_now > this.max_value_ever_owned) ? value_of_coins_owned_right_now : this.max_value_ever_owned;

		if (this.show_full_debug) {
			this.debug('<span style="color:green">TRANSACTION: BUYING $' +  this.buy_sell_unit + ': ' + number_of_coins_to_buy + 'BTC  valued at $' + current_coin_price_buy + '</span><br />');
		}

	},



	 sellCoin: function(current_coin_price_sell) {

		if (this.total_coins_owned === 0) {
			return 'Don’t have any coins to sell! returning<br/>';
		}

		// SELL EVERYTHING

		var result_of_this_sale 		= (current_coin_price_sell*this.total_coins_owned)
		this.total_sold 				+= result_of_this_sale;
		this.total_transactions++;

		if (this.show_full_debug) {
			this.debug('<span style="color:red">TRANSACTION: SELL ALL COINS: ' +  this.total_coins_owned + ' BTC valued at $' + current_coin_price_sell + ' = $' + result_of_this_sale + '</span><br />');
		}

		this.total_coins_owned 	= 0;
	
	},


	printCurrentPosition: function (current_coin_price_buy, current_coin_price_sell) {

		this.debug('<strong> &gt;&gt; CURRENT POSITION</strong><br />');
		this.debug('&gt; total bitcoins owned right now: ' + this.total_coins_owned + '<br/>');
		this.debug('&gt; current bitcoin sell price: $' + current_coin_price_sell.toFixed(2) + '<br/>');
		this.debug('&gt; total coins owned value (as sell price) = $' + (this.total_coins_owned * current_coin_price_sell).toFixed(2) + '<br />');
		this.debug('&gt; total money invested spent = $' + this.total_spent + '<br />');
		this.debug('&gt; total sold = $' + this.total_sold.toFixed(2) + '<br />');
		this.debug('&gt; total position (coins+total sold-investments): $'	+ ((this.total_coins_owned * current_coin_price_sell) + this.total_sold - this.total_spent).toFixed(2) + '<br />');
		this.debug('&gt; total transactions ' + this.total_transactions + '<br />');
		this.debug('&gt; max coins ever owned ' + this.max_coins_ever_owned + '<br />');
		this.debug('&gt; max value ever owned $' + this.max_value_ever_owned.toFixed(2) + '<br /><br />');

	},

	debug: function(str) {
		this.browser_output += str;
	}





}