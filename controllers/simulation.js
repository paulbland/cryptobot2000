module.exports = {



	// Variables accessed globally defined here

	total_coins_owned 	: null,
	buy_sell_unit 		: null,
	total_spent 		: null,
	total_sold 			: null,
	total_transactions 	: null,
	max_coins_ever_owned: null,
	max_value_ever_owned: null,
	browser_output 		: '',


	runOnce : function(hrs_in_period, low_threshold, high_threshold, price_data) {

		var interval_in_minutes		= 10												// how often data is collected in minutes
		var values_per_period 		= ((hrs_in_period * 60) / interval_in_minutes); 	// 144; // there are 144 10-min incremetns in a day (24 hrs period)
		var days_in_records 		= ((price_data.length/24/60)*interval_in_minutes);

		this.total_coins_owned 		= 0;
		this.buy_sell_unit 			= 100;
		this.total_spent			= 0;
		this.total_sold				= 0;
		this.total_transactions	 	= 0;
		this.max_coins_ever_owned 	= 0;
		this.max_value_ever_owned 	= 0;

		this.browser_output += 'analyzing: ' + price_data.length + ' values ('+days_in_records.toFixed(2)+' days)<br /><br />';

		for (i=0; i<=(price_data.length - values_per_period); i++) {
			
			// define start and end indexes for main array
			this.browser_output += '<strong><u>Period ' + Math.floor((i+values_per_period)/values_per_period) + ' of ' + (price_data.length/values_per_period).toFixed(2) + ' ';
			this.browser_output += '(in '+hrs_in_period+' hr periods)</u></strong> ';
			this.browser_output += '(' + days_in_records.toFixed(2) + ' days) ';
			this.browser_output += '(increment ' + ((i % values_per_period)+1) + ' of ' + values_per_period + ') ';
			this.browser_output += 'testing slice: ' + i + ' --> ' + (i+values_per_period) + '<br />';

			// get 24 hrs worth of data (As a slice of 144 values)
			// actually not just 24 hrs anymore. "a period" of 24 hrs )For example) is 144 values
			var data_to_be_tested = price_data.slice(i, (i+values_per_period));

			// run the decide algorithm on just this part
			//this.browser_output += 
			this.decideBuyOrSell(data_to_be_tested, low_threshold, high_threshold)
		}

	},


	/* 
	* this function takes a slide of the array (144 values for a day, less for other periods) and decides on selling or buying
	*/
	decideBuyOrSell : function(data_to_be_tested, low_threshold, high_threshold) {


		var avg_for_period		= 0;	// orig was 24 hrs 'avg_for_24_hrs'
		var latest_buy_price	= 0;	// this will be the currect price we're evaluating
		var latest_sell_price	= 0;	// this will be the currect price we're evaluating

	

		// print length to browser to make sure correct
		//this.browser_output += 'length is: ' + data_to_be_tested.length + '<br>';

		// calculate avg
		var sum = 0;
		for (j=0; j<data_to_be_tested.length; j++) {
			sum += ((data_to_be_tested[j].value_buy+data_to_be_tested[j].value_sell)/2);
		}
		avg_for_period = (sum/data_to_be_tested.length).toFixed(2);

		// print result
		this.browser_output += 'data collected at: ' + data_to_be_tested[data_to_be_tested.length-1].datetime + '<br />';

		// print avg result to browser
		this.browser_output += 'average price for last 24 hrs is: $' + avg_for_period + '<br>';

		// get latest prices
		latest_buy_price 	= data_to_be_tested[data_to_be_tested.length-1].value_buy;
		latest_sell_price 	= data_to_be_tested[data_to_be_tested.length-1].value_sell;

		// print latest to browser
		this.browser_output += 'latest buy price: $' + latest_buy_price.toFixed(2) + '<br>';
		this.browser_output += 'latest sell price: $' + latest_sell_price.toFixed(2) + '<br>';


		var avg_plus_high_threshold = (avg_for_period * (1 + high_threshold)).toFixed(2);
		var avg_minus_low_threshold = (avg_for_period * (1 - low_threshold)).toFixed(2);

		this.browser_output += '(avg price plus high threshold ('+high_threshold+'%) is ' + avg_plus_high_threshold + ')<br />';
		this.browser_output += '(avg price minus low threshold ('+low_threshold+'%) is ' + avg_minus_low_threshold + ')<br />';


		if (latest_sell_price > avg_plus_high_threshold) {

			// check if price is higher than period avg + threshold
			this.browser_output += 'latest price is higher than +' + high_threshold + '% --- sell!<br />';
			//this.browser_output +=  
			this.sellCoin(latest_sell_price)

		} else if (latest_buy_price < avg_minus_low_threshold) {

			// check if price is lwoer than period avg - threshold
			this.browser_output += 'latest price is lower than -' + high_threshold + '% --- buy!<br />';
			//this.browser_output +=  
			this.buyCoin(latest_buy_price)

		} else {
			this.browser_output += 'Neither higher nor lower -> do nothing<br />';
		}

		/*this.browser_output += */
		this.printCurrentPosition(latest_buy_price, latest_sell_price);


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

		this.browser_output += '<span style="color:green">TRANSACTION: BUYING $' +  this.buy_sell_unit + ': ' + number_of_coins_to_buy + 'BTC  valued at $' + current_coin_price_buy + '</span><br />';


	},



	 sellCoin: function(current_coin_price_sell) {

		if (this.total_coins_owned === 0) {
			return 'Don’t have any coins to sell! returning<br/>';
		}

		// SELL EVERYTHING


		var result_of_this_sale = (current_coin_price_sell*this.total_coins_owned)
		this.total_sold 				+= result_of_this_sale;
		this.total_transactions++;

		this.browser_output += '<span style="color:red">TRANSACTION: SELL ALL COINS: ' +  this.total_coins_owned + ' BTC valued at $' + current_coin_price_sell + ' = $' + result_of_this_sale + '</span><br />';

		this.total_coins_owned 	= 0;

	
	},

	printCurrentPosition: function (current_coin_price_buy, current_coin_price_sell) {

		this.browser_output += '<strong> &gt;&gt; CURRENT POSITION</strong><br />';

		this.browser_output += '&gt; total bitcoins owned right now: ' 					+ this.total_coins_owned + '<br/>';
		this.browser_output += '&gt; current bitcoin sell price: $' 						+ current_coin_price_sell.toFixed(2) + '<br/>';
		this.browser_output += '&gt; total coins owned value (as sell price) = $' 		+ (this.total_coins_owned * current_coin_price_sell).toFixed(2) + '<br />';
		this.browser_output += '&gt; total money invested spent = $' 					+ this.total_spent + '<br />';
		this.browser_output += '&gt; total sold = $' 									+ this.total_sold.toFixed(2) + '<br />';
		this.browser_output += '&gt; total position (coins+total sold-investments): $' 	+ ((this.total_coins_owned * current_coin_price_sell) + this.total_sold - this.total_spent).toFixed(2) + '<br />';
		this.browser_output += '&gt; total transactions ' 								+ this.total_transactions + '<br />';
		this.browser_output += '&gt; max coins ever owned ' 								+ this.max_coins_ever_owned + '<br />';
		this.browser_output += '&gt; max value ever owned $' 							+ this.max_value_ever_owned.toFixed(2) + '<br /><br />';

	

	}





}