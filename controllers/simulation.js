var tools 		= require('./tools')
var reporting 	= require('./reporting')


module.exports = {

	// Variables accessed globally defined here
	// not changed by refresh!!?!?!

	// these are constant vars thoughout entire simulation
	interval_in_minutes 	: 10,	// how often data is collected in minutes

	// these are here because they must be visible globally, even though are updated throughout iterations
	total_coins_owned 		: null,
	total_spent 			: null,
	total_sold 				: null,
	total_sell_transactions : null,
	total_buy_transactions 	: null,
	max_coins_ever_owned	: null,
	max_value_ever_owned	: null,
	browser_output 			: '',
	chart_data 				: '',
	summary_output			: '',
	currency 				: null,

	// output options
	print_full_debug		: null,
	print_basic_debug 		: null,
	print_chart_data		: false,
	print_table_data		: false,	

	// algorthim differences that arent looped
	buy_sell_method			: 'avg',		// 'avg' or 'peak'
	buy_sell_unit 			: 100,			//500/10k seems to be good  -- also 300/5k
	buy_limit				: 1000,
	sell_all				: true,			// false means sell just one unit
	simulate_crash 			: false, 
	

	printSummary: function(price_data) {
		var days_in_records = ((price_data.length / 24 / 60) * this.interval_in_minutes);
		reporting.debug('<strong>Analyzing ' + price_data.length + ' values (' + days_in_records.toFixed(2) + ' days)</strong><br />');
		reporting.debug('- sell_all: ' + this.sell_all+'<br />');
		reporting.debug('- buy_sell_method: \'' + this.buy_sell_method+'\'<br />');
		reporting.debug('- buy_sell_unit: ' + this.buy_sell_unit+'<br />');
		reporting.debug('- buy_limit: ' + this.buy_limit+'<br />');
		reporting.debug('- simulate_crash: ' + this.simulate_crash+'<br /><br />');
	},


	runFullSimulation: function(price_data, currency) {

		//this.browser_output 	= '';
		//this.chart_data 		= '';
		this.table_data 		= {};
		this.table_averages 	= {};
		this.print_basic_debug 	= false; 
		this.print_full_debug 	= false; 
		this.print_table_data 	= true;	
		this.currency 			= currency;
		

		reporting.reset();

		this.printSummary(price_data); 

		if (this.buy_sell_method === 'avg') {

			// FULL DATA FOR LONG TESTS
			var periods 	= [6, 12, 24]; 																// 6/12/24 - good,  48+ always bad
			var offsets 	= [6, 12, 24]; 																// 6/12/24 - good, 0 is mixed, 48+ bad
			var low_values 	= [0.05, 0.07, 0.09, 0.11, 0.13, 0.15, 0.17, 0.19, 0.21, 0.23, 0.25];		// this seems to be a good set for wide variety
			var high_values = [0.05, 0.07, 0.09, 0.11, 0.13, 0.15, 0.17, 0.19, 0.21, 0.23, 0.25];		// and they match each other

			// removed 0.01 and 0.03 - dont seem significant ever (both axes)

			// SHORT FOR HEROKU
			periods 	= [12]; 		// winner: period 6
			offsets 	= [6]; 			// winner: offset: 12
			low_values 	= [0.05, 0.07, 0.09, 0.11, 0.13, 0.15, 0.17, 0.19, 0.21, 0.23, 0.25];//[0.16];	 ???it was. a scond ago? //0.11
			high_values = [0.05, 0.07, 0.09, 0.11, 0.13, 0.15, 0.17, 0.19, 0.21, 0.23, 0.25];//[0.17];							//0.21

		} else if (this.buy_sell_method === 'peak') {

			var periods 	= [24, 36, 48, 72];
			var offsets 	= [0]; // offsets dont make sense here.. i dont think?
			var low_values 	= [0.020, 0.021, 0.022, 0.023, 0.024, 0.025];
			var high_values = [0.020, 0.021, 0.022, 0.023, 0.024, 0.025];

		} else {
			return;
		}
		
		

		for (x=0; x < periods.length; x++) {
			for (q=0; q < offsets.length; q++) {
				for (y=0; y < low_values.length; y++) {
					for (z=0; z < high_values.length; z++) {		
						this.processDataSet(periods[x], offsets[q], low_values[y], high_values[z], price_data)
					}
				}
			}
		}


		// print table average 
		for (x in this.table_averages) {
			// convert sum to average
			this.table_averages[x] = (this.table_averages[x] / (low_values.length * high_values.length));
		}

		reporting.debug('average value of table:<br />')
		for (x in this.table_averages) {
			reporting.debug(x + ': ' + this.table_averages[x]);
		}

		this.browser_output = reporting.getFinalOutput()
		this.chart_data 	= reporting.getFinalChartData()
	},


	runSingleSimulation: function(hrs_in_period, offset, low_threshold, high_threshold, price_data) {
		//this.browser_output 	= '';
		this.summary_output		= '';
		//this.chart_data 		= '';

		reporting.reset();
		
		this.table_data 		= {};
		this.print_basic_debug 	= true;
		this.print_full_debug 	= true; //usually true
		this.print_chart_data	= true;
		this.printSummary(price_data);
		this.processDataSet(hrs_in_period, offset, low_threshold, high_threshold, price_data)

		this.browser_output 	= reporting.getFinalOutput()
		this.chart_data 		= reporting.getFinalChartData()
	},


	

	processDataSet: function(hrs_in_period, offset, low_threshold, high_threshold, price_data) {

		//	console.log(hrs_in_period, offset, low_threshold, high_threshold, price_data)

		if (this.print_basic_debug) {
			this.printLoopSummary(hrs_in_period, offset, low_threshold, high_threshold)
		}

		// these vars are relative to the current single simulation, and will be reset for each run
		this.total_coins_owned 		= 0;
		this.total_spent			= 0;
		this.total_sold				= 0;
		this.total_sell_transactions	= 0;
		this.total_buy_transactions	= 0;
		this.max_coins_ever_owned 	= 0;
		this.max_value_ever_owned 	= 0;

		var values_per_period 		= ((hrs_in_period * 60) / this.interval_in_minutes); 	// 144 10-min incremetns in a 24 hr period)
		var values_in_offset		= ((offset * 60) / this.interval_in_minutes);
		var total_iterations 		= (price_data.length - values_per_period - values_in_offset)

		// loop the data
		for (i=0; i<=total_iterations; i++) {
			
			// get 24 hrs worth of data (As a slice of 144 values)
			// actually not just 24 hrs anymore. "a period" of 24 hrs )For example) is 144 values
			var data_to_be_tested 	= price_data.slice(i, (i + values_per_period));

			// NEW WITH OFFSET
			var this_index 			= (i + values_per_period + values_in_offset - 1)
			var latest_buy_price 	= price_data[this_index].value_buy;		// this will be the currect price we're evaluating
			var latest_sell_price 	= price_data[this_index].value_sell;	// this will be the currect price we're evaluating
			var current_date	 	= price_data[this_index].datetime

			if (this.print_full_debug) {
				this.printLoopDebug(i, values_per_period, price_data, hrs_in_period, this_index, offset, values_in_offset);
			}

			// run the decide algorithm on just this part
			var sell_or_buy = this.decideBuyOrSell(data_to_be_tested, latest_buy_price, latest_sell_price, low_threshold, high_threshold, current_date, 
				this.buy_sell_method, this.print_full_debug, this.print_chart_data)

			if (sell_or_buy === 'sell') {
				this.sellCoinSim(latest_sell_price, this.print_full_debug, high_threshold)
			} else if (sell_or_buy === 'buy') {
				this.buyCoinSim(latest_buy_price, this.print_full_debug, high_threshold)
			} else {
				// Do nothing
				if (this.print_full_debug) {
					reporting.debug('Neither higher nor lower -> do nothing<br />');
				}
			}

			if (this.print_full_debug) {
				reporting.printCurrentPosition(latest_buy_price, latest_sell_price, this.total_coins_owned, this.total_spent, 
					this.total_sold, this.total_sell_transactions, this.total_buy_transactions, this.max_coins_ever_owned, this.max_value_ever_owned);
			}

			var sell 	= (sell_or_buy === 'sell') ? true : false;
			var buy 	= (sell_or_buy === 'buy') ? true : false;
			
			// update chart data for each iteration of 10 mins
			if (this.print_chart_data) {
				reporting.updateChartData(current_date, latest_buy_price, buy, latest_sell_price, sell);
			}
		}

		// calculate final profit now set has been process
		var final_sell_price 	= price_data[(price_data.length - 1)].value_sell;
		
		// set final sell to 25%
		if (this.simulate_crash) {
			//final_sell_price *= 0.25;
			// changed: now crashes to period average. the crash thing was misleading
			final_sell_price = tools.calculateAverage(data_to_be_tested)
		}

		

		var final_profit 		= ((this.total_coins_owned * final_sell_price) + this.total_sold - this.total_spent)
		var invest_profit_ratio	= (this.max_value_ever_owned / final_profit).toFixed(2)
		var profit_percentage	= ((final_profit / this.max_value_ever_owned)* 100).toFixed(0)

		if (this.print_basic_debug) {
			this.summary_output += '<strong>final profit: $' + final_profit.toFixed(2) + '</strong> ';
			this.summary_output += '(<strong>max ever value: $' + this.max_value_ever_owned.toFixed(2) + '</strong>) ';
			this.summary_output += 'invested:profit ratio: ' + invest_profit_ratio + '<br /><br />';
		}

		if (this.print_table_data) {
			this.compileTableData(hrs_in_period, offset, low_threshold, high_threshold, final_profit, invest_profit_ratio, profit_percentage);
		}
	}, 



	printLoopDebug: function(i, values_per_period, price_data, hrs_in_period, this_index, offset, values_in_offset) {
		reporting.debug('<strong><u>Period ' + Math.floor((i + values_per_period) / values_per_period) + ' of ');
		reporting.debug((price_data.length / values_per_period).toFixed(2));
		reporting.debug(' (in ' + hrs_in_period + ' hr periods)</u></strong> ');
		reporting.debug('(increment ' + ((i % values_per_period) + 1) + ' of ' + values_per_period + ') ');
		reporting.debug('analyzing slice: ' + i + ' --> ' + (i + values_per_period) + '<br />');
		reporting.debug('this_index: ' + this_index + '<br />');
		reporting.debug('offset: ' + offset + '<br />');
		reporting.debug('values_in_offset: ' + values_in_offset + '<br />');
	},


	/* 
	* this function takes a slide of the array (144 values for a day, fewer for other periods) and decides on selling or buying
	*/
	decideBuyOrSell: function(data_to_be_tested, latest_buy_price, latest_sell_price, low_threshold, high_threshold, current_date, 
		buy_sell_method, print_full_debug, print_chart_data) {

		var avg_for_period 				= tools.calculateAverage(data_to_be_tested)						// get avg for period
		var avg_plus_high_threshold 	= (avg_for_period * (1 + high_threshold)).toFixed(2);
		var avg_minus_low_threshold 	= (avg_for_period * (1 - low_threshold)).toFixed(2);

		//console.log(avg_for_period, latest_buy_price, latest_sell_price, low_threshold, high_threshold, current_date)
		//console.log(avg_plus_high_threshold)
		
		var high_for_period 			= tools.calculateHigh(data_to_be_tested)						// get avg for period
		var low_for_period 				= tools.calculateLow(data_to_be_tested)						// get avg for period
		var high_minus_high_threshold 	= (high_for_period * (1 - high_threshold)).toFixed(2);
		var low_plus_low_threshold 		= (low_for_period * (1 + low_threshold)).toFixed(2);


		if (print_full_debug) {
			reporting.debug('data collected at: ' + data_to_be_tested[data_to_be_tested.length-1].datetime + '<br />');// print result
			reporting.debug('latest buy price: $' + latest_buy_price.toFixed(2) + '<br>');
			reporting.debug('latest sell price: $' + latest_sell_price.toFixed(2) + '<br>');
		}

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


	

	


	buyCoinSim: function(current_coin_price_buy, print_full_debug, high_threshold) {

		if (print_full_debug) {
			reporting.debug('latest price is lower than -' + high_threshold + '% --- buy!<br />');
		}

		// eg:
		// - unit 			= $1000
		// - limit 			= $5000
		// - buy price 		= $2500
		// - current 		= 1.9
		// - current value 	= $4750

		// value i own right now
		var value_of_coins_owned_right_now 	= (this.total_coins_owned * current_coin_price_buy)								// eg 4750 = 1.9 * 2500

		// expected number of coins to buy
		var number_of_coins_to_buy 			= (this.buy_sell_unit / current_coin_price_buy)  								// eg 0.4 = 1000/2500

		var amount_spent_on_this_transaction = this.buy_sell_unit															// eg 1000

		if (this.print_full_debug) {
			reporting.debug('this.buy_sell_unit: ' 				+ this.buy_sell_unit + '<br />');
			reporting.debug('this.buy_limit: ' 					+ this.buy_limit + '<br />');
			reporting.debug('current_coin_price_buy: ' 			+ current_coin_price_buy + '<br />');
			reporting.debug('this.total_coins_owned: ' 			+ this.total_coins_owned + '<br />');
			reporting.debug('value_of_coins_owned_right_now: ' 	+ value_of_coins_owned_right_now + '<br />');
			reporting.debug('number_of_coins_to_buy: ' 			+ number_of_coins_to_buy + '<br />');
			reporting.debug('amount_spent_on_this_transaction: ' + amount_spent_on_this_transaction + '<br />');

		}


		// this confusing block will make sure the amount to be purchased is not over limit, and if it is
		// set new purchase amount to the difference betwen current value and the limit

		// if what i already own + value of what im about to buy is >  than limit
		if ((value_of_coins_owned_right_now + (number_of_coins_to_buy * current_coin_price_buy)) > this.buy_limit) {		// eg	4750 + (0.4*2500) > 5000
																															// 	    4750 + 1000 > 5000
																															//	    5750 > 5000 
			// get the $ value difference between my limit and value of coins owned right now
			var difference = (this.buy_limit - value_of_coins_owned_right_now);												// eg  250 = 5000 - 4750

			// new number of coins to buy
			number_of_coins_to_buy = (difference / current_coin_price_buy)													// eg 0.1 = 250 / 2500

			// new amount spent
			amount_spent_on_this_transaction = difference;																	// eg 250


			if (this.print_full_debug) {
				reporting.debug('***reached limit! --- <br />')
				reporting.debug('***setting number_of_coins_to_buy to ' + number_of_coins_to_buy+ '<br />')
				reporting.debug('***setting amount_spent_on_this_transaction to ' + amount_spent_on_this_transaction + '<br />');
			}

		}





		// if flag set, and already own coins -- dont buy again
		// should mean you only ever buy one unit
		// if (this.buy_only_once && (this.total_coins_owned > 0)) {

		// 	if (this.print_full_debug) {
		// 		reporting.debug('not buying -- already own');
		// 	}
		// 	return;
		// }

		

		this.total_coins_owned 			+= number_of_coins_to_buy;
		this.total_spent 				+= amount_spent_on_this_transaction;
		this.total_buy_transactions++;

		// update total owned (set before transaction - need to be updated)
		value_of_coins_owned_right_now = (this.total_coins_owned * current_coin_price_buy)

		// update value for max coins ever owned
		this.max_coins_ever_owned = (this.total_coins_owned > this.max_coins_ever_owned) ? this.total_coins_owned : this.max_coins_ever_owned;

		// update value for max value of coins ever owned
		this.max_value_ever_owned = (value_of_coins_owned_right_now > this.max_value_ever_owned) ? value_of_coins_owned_right_now : this.max_value_ever_owned;

		if (this.print_full_debug) {
			reporting.debug('<span style="color:green">TRANSACTION: BUYING $' +  amount_spent_on_this_transaction.toFixed(2) + ': (' + number_of_coins_to_buy.toFixed(2) + ' coins valued at $');
			reporting.debug(current_coin_price_buy.toFixed(2) + ' each)</span><br />');
		}

	},



	 sellCoinSim: function(current_coin_price_sell, print_full_debug, high_threshold) {

		if (print_full_debug) {
			reporting.debug('latest price is higher than +' + high_threshold + '% --- sell!<br />');
		}

		if (this.total_coins_owned === 0) {
			if (this.print_full_debug) {
				reporting.debug('you don’t have any coins to sell!<br />')
			}
			return;
		}

		if (this.sell_all) {
			var number_of_coins_to_sell = this.total_coins_owned							// SELL EVERYTHING
		} else {
			var number_of_coins_to_sell = (this.buy_sell_unit / current_coin_price_sell)	// SELL LIMIT

			if (number_of_coins_to_sell > this.total_coins_owned) {
				number_of_coins_to_sell = this.total_coins_owned
			}
		}

		var result_of_this_sale = (current_coin_price_sell * number_of_coins_to_sell)

		if (this.print_full_debug) {
			reporting.debug('<span style="color:red">TRANSACTION: SELL ' + number_of_coins_to_sell + ' of my ' +  this.total_coins_owned + ' coins valued at $');
			reporting.debug(current_coin_price_sell + ' = $' + result_of_this_sale + '</span><br />');
		}

		this.total_coins_owned 	-= number_of_coins_to_sell;
		this.total_sold			+= result_of_this_sale;
		this.total_sell_transactions++;

	},

	printLoopSummary: function(hrs_in_period, offset, low_threshold, high_threshold) {
		reporting.debug('<strong>Loop variables:</strong><br />');
		reporting.debug('- hrs_in_period: ' + hrs_in_period + '<br />');
		reporting.debug('- offset: ' + offset + '<br />');
		reporting.debug('- low_threshold: ' + low_threshold + '<br />');
		reporting.debug('- high_threshold: ' + high_threshold + '<br /><br />');
	},



	compileTableData: function(hrs_in_period, offset, low_threshold, high_threshold, final_profit, invest_profit_ratio, profit_percentage) {
		//console.log('running with', hrs_in_period, offset, low_threshold, high_threshold, final_profit)


		var array_key 	= 'period_' + hrs_in_period + '_offset_' + offset;
		var row_key 	= 'row_'+high_threshold;
		var cell_link 	= '/run-simulation-single?hrs_in_period='+hrs_in_period+'&offset='+offset+'&low_threshold='+low_threshold+'&high_threshold='+high_threshold+'&currency='+this.currency;

		if (typeof this.table_data[array_key] === 'undefined') {
			this.table_data[array_key] = {
				'header_row' 	: ['<th>↓high\\low→</th>']
			}
			this.table_averages[array_key] = 0;
		}

		// adds for every loop. this prevents that. not elegant...
		if (this.table_data[array_key].header_row[(this.table_data[array_key].header_row.length - 1)] !== '<th>'+low_threshold+'</th>') {
			this.table_data[array_key].header_row.push('<th>'+low_threshold+'</th>')
		}

		// add value
		if (typeof this.table_data[array_key][row_key] === 'undefined') {
			this.table_data[array_key][row_key] = ['<th>'+high_threshold+'</th>']
		}

		// set color value from 0-255 based on value of final profit (from 0-500)

		// ok heres the fun part
		// convert final_product to 0->255
		// i dont have max value yet os lets just copy it in
		// 256 is obviosuly max rgba num
		// then set colors weighted to the total value
		var max 		= 250;
		var min  		= -50;
		var rgb_color 	= 0
		var color_text 	= ''
		var cell_str 	= '';
		var max_rgb_value = 210; // use 210 because 255 is too hard to read on white screen


		if (final_profit > 0) {

			rgb_color 	= Math.floor(final_profit * (max_rgb_value / max));
			rgb_color 	= (rgb_color > max_rgb_value) ? max_rgb_value : rgb_color;
			color_text 	= 'rgb(0,'+rgb_color+',0)';

		} else if (final_profit < 0) {

			rgb_color 	= Math.floor(final_profit * (max_rgb_value / min));
			rgb_color 	= (rgb_color > max_rgb_value) ? max_rgb_value : rgb_color;
			color_text 	= 'rgb('+rgb_color+',0,0)';

		}
		else if (final_profit === 0) {
			color_text = '#ccc';
		}


		cell_str += '<td>\
			<a style="font-weight:bold;color:'+color_text+'" href="'+cell_link+'" target="_blank">\
				$'+final_profit.toFixed(2)+'</a><br />\
				<span>($'+this.max_value_ever_owned.toFixed(2)+'\/'+profit_percentage+'%)</span>\
		</td>';

		// used to show a ratio. now shows % earnt
		//<span>($'+this.max_value_ever_owned.toFixed(2)+'\/'+invest_profit_ratio+')</span>\

		this.table_data[array_key][row_key].push(cell_str)

		this.table_averages[array_key] += final_profit;

		// this.table_data['x_y'] = {
		// 		"header_row" : ['', 0.05, 0.4, 0.7],
		// 		"row_0.05" : [34,234,454]
		//		"row_0.06" : [34,234,454]


	},

	





	printGraphData: function(price_data) {
		this.browser_output = '';
		for (a=0; a < price_data.length; a++) {
			this.browser_output += '"' + price_data[a].datetime + '",' + price_data[a].value_sell + ',' + price_data[a].value_buy + '<br />';
		}
	},




	




}