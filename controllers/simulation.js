module.exports = {

	// Variables accessed globally defined here
	// not changed by refresh!!?!?!

	// these are constant vars thoughout entire simulation
	interval_in_minutes 	: 10,	// how often data is collected in minutes
	buy_sell_unit 			: 100,

	// these are here because they must be visible globally, even though are updated throughout iterations
	total_coins_owned 		: null,
	total_spent 			: null,
	total_sold 				: null,
	total_transactions 		: null,
	max_coins_ever_owned	: null,
	max_value_ever_owned	: null,
	browser_output 			: '',
	show_full_debug			: true,
	sell_all				: true,	// false means sell just one unit



	printSummary: function(price_data) {
		var days_in_records = ((price_data.length / 24 / 60) * this.interval_in_minutes);
		this.debug('<strong>analyzing: ' + price_data.length + ' values (' + days_in_records.toFixed(2) + ' days)</strong><br /><br />');
	},


	runMultiple: function(price_data) {

		this.printSummary(price_data);

		var periods 	= [6, 12, 24]
		var offsets 	= [0, 24]
		var low_values 	= [0.01, 0.03, 0.05, 0.07, 0.1, 0.15];
		var high_values = [0.01, 0.03, 0.05, 0.07, 0.1, 0.15];
		
		this.show_full_debug = false;

		for (x=0; x < periods.length; x++) {
			for (q=0; q < offsets.length; q++) {
				for (y=0; y < low_values.length; y++) {
					for (z=0; z < high_values.length; z++) {		
						this.runOnce(periods[x], offsets[q], low_values[y], high_values[z], price_data)
					}
				}
			}
		}
	},

	runSingle: function(hrs_in_period, offset, low_threshold, high_threshold, price_data) {
		this.printSummary(price_data);
		this.runOnce(hrs_in_period, offset, low_threshold, high_threshold, price_data)
	},

	runOnce: function(hrs_in_period, offset, low_threshold, high_threshold, price_data) {

		this.debug('hrs_in_period: ' + hrs_in_period + ' ');
		this.debug('offset: ' + offset + ' ');
		this.debug('low_threshold: ' + low_threshold + ' ');
		this.debug('high_threshold: ' + high_threshold + '<br />');

		// these vars are relative to the current single simulation, and will be reset for each run
		this.total_coins_owned 		= 0;
		this.total_spent			= 0;
		this.total_sold				= 0;
		this.total_transactions	 	= 0;
		this.max_coins_ever_owned 	= 0;
		this.max_value_ever_owned 	= 0;

		var values_per_period 		= ((hrs_in_period * 60) / this.interval_in_minutes); 	// 144 10-min incremetns in a 24 hr period)
		var values_in_offset		= ((offset * 60) / this.interval_in_minutes);
		var total_iterations 		= (price_data.length - values_per_period - values_in_offset)

		// loop the data
		for (i=0; i<=total_iterations; i++) {
			
			// define start and end indexes for main array
			if (this.show_full_debug) {
				this.debug('<strong><u>Period ' + Math.floor((i + values_per_period) / values_per_period) + ' of ');
				this.debug((price_data.length / values_per_period).toFixed(2));
				this.debug(' (in ' + hrs_in_period + ' hr periods)</u></strong> ');
				this.debug('(increment ' + ((i % values_per_period) + 1) + ' of ' + values_per_period + ') ');
				this.debug('testing slice: ' + i + ' --> ' + (i + values_per_period) + '<br />');
			}

			// get 24 hrs worth of data (As a slice of 144 values)
			// actually not just 24 hrs anymore. "a period" of 24 hrs )For example) is 144 values
			var data_to_be_tested 	= price_data.slice(i, (i + values_per_period));
			var final_iteration 	= (i === total_iterations) ? true : false;
			
			// OLD WITHOUT OFFSET
			//var latest_buy_price 	= data_to_be_tested[(data_to_be_tested.length - 1)].value_buy;	// this will be the currect price we're evaluating
			//var latest_sell_price = data_to_be_tested[(data_to_be_tested.length - 1)].value_sell;	// this will be the currect price we're evaluating

			// NEW WITH OFFSET
			var this_index 			= (i + values_per_period + values_in_offset - 1)
			var latest_buy_price 	= price_data[this_index].value_buy;		// this will be the currect price we're evaluating
			var latest_sell_price 	= price_data[this_index].value_sell;	// this will be the currect price we're evaluating

			// run the decide algorithm on just this part
			this.decideBuyOrSell(data_to_be_tested, latest_buy_price, latest_sell_price, low_threshold, high_threshold, final_iteration)
		}

	},


	/* 
	* this function takes a slide of the array (144 values for a day, fewer for other periods) and decides on selling or buying
	*/
	decideBuyOrSell: function(data_to_be_tested, latest_buy_price, latest_sell_price, low_threshold, high_threshold, final_iteration) {

		var avg_for_period 			= this.calculateAverage(data_to_be_tested)						// get avg for period
		var avg_plus_high_threshold = (avg_for_period * (1 + high_threshold)).toFixed(2);
		var avg_minus_low_threshold = (avg_for_period * (1 - low_threshold)).toFixed(2);

		if (this.show_full_debug) {
			this.debug('data collected at: ' + data_to_be_tested[data_to_be_tested.length-1].datetime + '<br />');// print result
			this.debug('average price for last 24 hrs is: $' + avg_for_period + '<br>');// print avg result to browser
			this.debug('latest buy price: $' + latest_buy_price.toFixed(2) + '<br>');
			this.debug('latest sell price: $' + latest_sell_price.toFixed(2) + '<br>');
			this.debug('(avg price plus high threshold ('+high_threshold+'%) is ' + avg_plus_high_threshold + ')<br />');
			this.debug('(avg price minus low threshold ('+low_threshold+'%) is ' + avg_minus_low_threshold + ')<br />');
		}

		if (latest_sell_price > avg_plus_high_threshold) {

			// check if price is higher than period avg + threshold
			if (this.show_full_debug) this.debug('latest price is higher than +' + high_threshold + '% --- sell!<br />');
			this.sellCoin(latest_sell_price)

		} else if (latest_buy_price < avg_minus_low_threshold) {

			// check if price is lwoer than period avg - threshold
			if (this.show_full_debug) this.debug('latest price is lower than -' + high_threshold + '% --- buy!<br />');
			this.buyCoin(latest_buy_price)

		} else {
			if (this.show_full_debug) this.debug('Neither higher nor lower -> do nothing<br />');
		}

		if (this.show_full_debug) {
			this.printCurrentPosition(latest_buy_price, latest_sell_price);
		}

		// final debug thing
		if (final_iteration) {
			this.debug('<strong>final profit: $' + ((this.total_coins_owned * latest_sell_price) + this.total_sold - this.total_spent).toFixed(2) + '</strong> ');
			this.debug('(<strong>max ever value: $' + this.max_value_ever_owned.toFixed(2) + '</strong>)<br /><br />');
		}

	},


	calculateAverage: function(data_to_be_tested) {

		var sum = 0;

		for (j=0; j < data_to_be_tested.length; j++) {
			sum += ((data_to_be_tested[j].value_buy + data_to_be_tested[j].value_sell) / 2);
		}
		return (sum/data_to_be_tested.length).toFixed(2); // orig was 24 hrs 'avg_for_24_hrs'

	},


	buyCoin: function(current_coin_price_buy) {

		// i think this line will mean you only make one purchase at a time
		//if (this.total_coins_owned > 0) return false;

		var number_of_coins_to_buy 	= (this.buy_sell_unit / current_coin_price_buy)

		this.total_coins_owned 			+= number_of_coins_to_buy;
		this.total_spent 				+= this.buy_sell_unit;
		this.total_transactions++;

		// update value for max coins ever owned
		this.max_coins_ever_owned = (this.total_coins_owned > this.max_coins_ever_owned) ? this.total_coins_owned : this.max_coins_ever_owned;

		// update value for max value of coins ever owned
		var value_of_coins_owned_right_now = (this.total_coins_owned * current_coin_price_buy)
		this.max_value_ever_owned = (value_of_coins_owned_right_now > this.max_value_ever_owned) ? value_of_coins_owned_right_now : this.max_value_ever_owned;

		if (this.show_full_debug) {
			this.debug('<span style="color:green">TRANSACTION: BUYING $' +  this.buy_sell_unit + ': ' + number_of_coins_to_buy + 'BTC  valued at $');
			this.debug(current_coin_price_buy + '</span><br />');
		}

	},



	 sellCoin: function(current_coin_price_sell) {

		if (this.total_coins_owned === 0) {
			return 'Don’t have any coins to sell! returning<br/>';
		}

		if (this.sell_all) {
			var number_of_coins_to_sell = this.total_coins_owned						// SELL EVERYTHING
		} else {
			var number_of_coins_to_sell = (this.buy_sell_unit / current_coin_price_sell)	// SELL LIMIT
		}

		var result_of_this_sale = (current_coin_price_sell * number_of_coins_to_sell)

		if (this.show_full_debug) {
			this.debug('<span style="color:red">TRANSACTION: SELL ' + number_of_coins_to_sell + ' COINS: ' +  this.total_coins_owned + ' BTC valued at $');
			this.debug(current_coin_price_sell + ' = $' + result_of_this_sale + '</span><br />');
		}

		this.total_coins_owned 	-= number_of_coins_to_sell;
		this.total_sold			+= result_of_this_sale;
		this.total_transactions++;
	
	},


	printCurrentPosition: function (current_coin_price_buy, current_coin_price_sell) {

		this.debug('<strong> &gt;&gt; CURRENT POSITION</strong><br />');
		this.debug('&gt;&gt; total bitcoins owned right now: ' + this.total_coins_owned + '<br/>');
		this.debug('&gt;&gt; current bitcoin sell price: $' + current_coin_price_sell.toFixed(2) + '<br/>');
		this.debug('&gt;&gt; total coins owned value (as sell price) = $' + (this.total_coins_owned * current_coin_price_sell).toFixed(2) + '<br />');
		this.debug('&gt;&gt; total money invested spent = $' + this.total_spent + '<br />');
		this.debug('&gt;&gt; total sold = $' + this.total_sold.toFixed(2) + '<br />');
		this.debug('&gt;&gt; total position (coins+total sold-investments): $');
		this.debug(((this.total_coins_owned * current_coin_price_sell) + this.total_sold - this.total_spent).toFixed(2) + '<br />');
		this.debug('&gt;&gt; total transactions ' + this.total_transactions + '<br />');
		this.debug('&gt;&gt; max coins ever owned ' + this.max_coins_ever_owned + '<br />');
		this.debug('&gt;&gt; max value ever owned $' + this.max_value_ever_owned.toFixed(2) + '<br /><br />');

	},

	debug: function(str) {
		this.browser_output += str;
	}





}