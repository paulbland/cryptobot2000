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
	buy_sell_unit 			: 200,			//500/10k seems to be good  -- also 300/5k
	buy_limit				: 2000,
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

		this.table_data 		= {};
		this.table_averages 	= {};
		this.global_averages 	= {};
		this.print_basic_debug 	= false; 
		this.print_full_debug 	= false; 
		this.print_table_data 	= true;	
		this.currency 			= currency;
		
		reporting.resetOutput(); 

		this.printSummary(price_data); 

		if (this.buy_sell_method === 'avg') {

			// FULL DATA FOR LONG TESTS (KINDA OLD NOW)
			// var periods 	= [6, 12, 24]; 																// 6/12/24 - good,  48+ always bad
			// var offsets 	= [6, 12, 24]; 																// 6/12/24 - good, 0 is mixed, 48+ bad
			// var low_values 	= [0.05, 0.07, 0.09, 0.11, 0.13, 0.15, 0.17, 0.19, 0.21, 0.23, 0.25];		// this seems to be a good set for wide variety
			// var high_values = [0.05, 0.07, 0.09, 0.11, 0.13, 0.15, 0.17, 0.19, 0.21, 0.23, 0.25];		// and they match each other

			// ok big 15 minute test:
			// var periods 	= [4, 6, 8, 10, 12, 14, 16, 18]; 	
			// var offsets 	= [4, 6, 8, 10, 12, 14, 16, 18]; 	
			// var low_values 	= [0.06, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20];
			// var high_values = [0.06, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20]; 

			// test
			var low_values 	= [0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18];
			var high_values = [0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18];

		} else if (this.buy_sell_method === 'peak') {

			var periods 	= [24, 36, 48, 72];
			var offsets 	= [0]; // offsets dont make sense here.. i dont think?
			var low_values 	= [0.020, 0.021, 0.022, 0.023, 0.024, 0.025];
			var high_values = [0.020, 0.021, 0.022, 0.023, 0.024, 0.025]; 

		} else {
			return;
		}


		// NEW WAY
		// only run combos that add up to 24 (or whatver the sweet spot is...)
		// 21.5 - still could be fine tuned
		var period_offset_combos = [
			{period: 1, offset: 20.5},
			{period: 2, offset: 19.5},
			{period: 3, offset: 18.5},
			{period: 4, offset: 17.5},
			{period: 5, offset: 16.5},
			{period: 6, offset: 15.5},
			{period: 7, offset: 14.5},
			{period: 8, offset: 13.5},
			{period: 9, offset: 12.5},
			{period: 10, offset: 11.5},
			{period: 11, offset: 10.5},
			{period: 12, offset: 9.5},
			{period: 13, offset: 8.5},
			{period: 14, offset: 7.5},
			{period: 15, offset: 6.5},
			{period: 16, offset: 5.5},
			{period: 17, offset: 4.5},
			{period: 18, offset: 3.5},
			{period: 19, offset: 2.5},
			{period: 20, offset: 1.5},
			{period: 21, offset: 0.5}
		]




		

		// OLD WAY
		// var total_tests 		= (periods.length * offsets.length * low_values.length * high_values.length);
		// NEW WAY
		var total_tests			= (period_offset_combos.length * low_values.length * high_values.length);
		var start 				= new Date();
		var time_per_test_min 	= 0.05;
		var time_per_test_max 	= 0.17;
		console.log("Running " + total_tests + " tests");
		console.log("Should be about " + (time_per_test_min * total_tests).toFixed(2) + "-" + (time_per_test_max * total_tests).toFixed(2) + " seconds.")

		// OLD WAY
		// for (x=0; x < periods.length; x++) {
		// 	for (q=0; q < offsets.length; q++) {
		// 		for (y=0; y < low_values.length; y++) {
		// 			for (z=0; z < high_values.length; z++) {		
		// 				this.processDataSet(periods[x], offsets[q], low_values[y], high_values[z], price_data)
		// 			}
		// 		}
		// 	}
		// }

		// NEW WAY
		for (x=0; x < period_offset_combos.length; x++) {
			for (y=0; y < low_values.length; y++) {
				for (z=0; z < high_values.length; z++) {		
					this.processDataSet(period_offset_combos[x].period, period_offset_combos[x].offset, low_values[y], high_values[z], price_data)
				}
			}
		}

		var execution_time = ((new Date() - start)/1000)
		console.log('Took ' + execution_time.toFixed(2) + ' seconds. (about ' + (execution_time / total_tests).toFixed(2) + ' seconds each)')



		// print table averages
		reporting.debug('average value of table:<br />')
		for (x in this.table_averages) {
			reporting.debug(x + ': ' + tools.getArrayAverage(this.table_averages[x]).toFixed(0) + '<br />')
		}

		// print global averages
		reporting.debug('<br />global averages:<br />')
		for (x in this.global_averages) {
			reporting.debug(x + ': ' + tools.getArrayAverage(this.global_averages[x]).toFixed(0) + '<br />')
		}

		this.browser_output = reporting.getFinalOutput()
		this.chart_data 	= reporting.getFinalChartData()
	},


	runSingleSimulation: function(hrs_in_period, offset, low_threshold, high_threshold, price_data) {

		reporting.resetOutput();
		
		this.table_data 		= {};
		this.print_basic_debug 	= true;
		this.print_full_debug 	= true; //usually true
		this.print_chart_data	= true;
		this.printSummary(price_data);
		this.processDataSet(hrs_in_period, offset, low_threshold, high_threshold, price_data)

		this.browser_output 	= reporting.getFinalOutput()
		this.chart_data 		= reporting.getFinalChartData()
		this.summary_output		= reporting.getSummaryData()
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

		var values_per_period 		= tools.calculateValuesForGivenPeriod(hrs_in_period, this.interval_in_minutes)		//((hrs_in_period * 60) / interval_in_minutes); 	
		var values_in_offset		= tools.calculateValuesForGivenPeriod(offset, this.interval_in_minutes)				//((offset * 60) / this.interval_in_minutes);
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
				reporting.printLoopDebug(i, values_per_period, price_data, hrs_in_period, this_index, offset, values_in_offset);
				reporting.debug('data collected at: ' + data_to_be_tested[data_to_be_tested.length-1].datetime + '<br />');// print result
				reporting.debug('latest buy price: $' + latest_buy_price.toFixed(2) + '<br>');
				reporting.debug('latest sell price: $' + latest_sell_price.toFixed(2) + '<br>');
			} 

			// run the decide algorithm on just this part
			var sell_or_buy = tools.decideBuyOrSell(data_to_be_tested, latest_buy_price, latest_sell_price, low_threshold, high_threshold, 
				this.buy_sell_method, this.print_full_debug)

			if (sell_or_buy === 'sell') {
				this.sellCoinSim(latest_sell_price, high_threshold)
			} else if (sell_or_buy === 'buy') {
				this.buyCoinSim(latest_buy_price, high_threshold)
			} else {
				// Do nothing
				// return 'do_nothing'
				if (this.print_full_debug) {
					reporting.debug('Neither higher nor lower -> do nothing<br />');
				}
			}

			if (this.print_full_debug) {
				reporting.printCurrentPosition(latest_buy_price, latest_sell_price, this.total_coins_owned, this.total_spent, this.total_sold, 
					this.total_sell_transactions, this.total_buy_transactions, this.max_coins_ever_owned, this.max_value_ever_owned);
			}

			// update chart data for each iteration of 10 mins
			if (this.print_chart_data) {
				var sell = (sell_or_buy === 'sell') ? true : false;
				var buy = (sell_or_buy === 'buy') ? true : false;
				reporting.updateChartData(current_date, latest_buy_price, buy, latest_sell_price, sell, tools.calculateAverage(data_to_be_tested));
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
		var profit_percentage	= ((final_profit / this.max_value_ever_owned) * 100).toFixed(2)

		if (this.print_basic_debug) {
			reporting.updateSummaryData(final_profit, this.max_value_ever_owned, invest_profit_ratio, profit_percentage)
			
		}

		if (this.print_table_data) {
			this.compileTableData(hrs_in_period, offset, low_threshold, high_threshold, final_profit, invest_profit_ratio, profit_percentage);
		}

		if (this.print_table_data) {
			this.compileGlobalAverages(hrs_in_period, offset, low_threshold, high_threshold, final_profit)

			
		}
	}, 




	buyCoinSim: function(current_coin_price_buy, high_threshold) {


		if (this.print_full_debug) {
			reporting.debug('latest price is lower than -' + high_threshold + '% --- buy!<br />');
		}

		var buy_coin_result = tools.buyCoin(this.total_coins_owned, this.buy_sell_unit, this.buy_limit, current_coin_price_buy, this.print_full_debug)

		// update sim values
		this.total_coins_owned 			+= buy_coin_result.number_of_coins_to_buy;
		this.total_spent 				+= buy_coin_result.amount_spent_on_this_transaction;
		this.total_buy_transactions++;


		// update total owned (set before transaction - need to be updated)
		var value_of_coins_owned_after_transaction = (this.total_coins_owned * current_coin_price_buy)

		// update value for max coins ever owned
		this.max_coins_ever_owned = (this.total_coins_owned > this.max_coins_ever_owned) ? this.total_coins_owned : this.max_coins_ever_owned;

		// update value for max value of coins ever owned
		this.max_value_ever_owned = (value_of_coins_owned_after_transaction > this.max_value_ever_owned) ? value_of_coins_owned_after_transaction : this.max_value_ever_owned;

		if (this.print_full_debug) {
			reporting.debug('<span style="color:green">TRANSACTION: BUYING $' +  buy_coin_result.amount_spent_on_this_transaction.toFixed(2) + ':');
			reporting.debug('(' + buy_coin_result.number_of_coins_to_buy.toFixed(2) + ' coins valued at $');
			reporting.debug(current_coin_price_buy.toFixed(2) + ' each)</span><br />');
		}

	},



	 sellCoinSim: function(current_coin_price_sell, high_threshold) {

		if (this.print_full_debug) {
			reporting.debug('latest price is higher than +' + high_threshold + '% --- sell!<br />');
		}

		if (this.total_coins_owned === 0) {
			if (this.print_full_debug) {
				reporting.debug('you don’t have any coins to sell!<br />')
			}
			return;
		}

		var sell_coin_result = tools.sellCoin(high_threshold, this.print_full_debug, this.sell_all, this.total_coins_owned, this.buy_sell_unit, current_coin_price_sell)

		this.total_coins_owned 	-= sell_coin_result.number_of_coins_to_sell;
		this.total_sold			+= sell_coin_result.result_of_this_sale;
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
		var row_key 	= 'row_' + high_threshold;
		var cell_link 	= '/run-simulation-single?hrs_in_period='+hrs_in_period+'&offset='+offset+'&low_threshold='+low_threshold+'&high_threshold='+high_threshold+'&currency='+this.currency;

		if (typeof this.table_data[array_key] === 'undefined') {
			this.table_data[array_key] = {
				'header_row' 	: ['<th>↓high\\low→</th>']
			}
			this.table_averages[array_key] = [];
			this.table_averages['sum_' + (hrs_in_period + offset)] = [];
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
		var max 		= 1000;
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

		// create array of final profity values (print average later)
		this.table_averages[array_key].push(final_profit)
		this.table_averages['sum_' + (hrs_in_period + offset)].push(final_profit)
	
		// this.table_data['x_y'] = {
		// 		"header_row" : ['', 0.05, 0.4, 0.7],
		// 		"row_0.05" : [34,234,454]
		//		"row_0.06" : [34,234,454]


	},




	
	compileGlobalAverages: function(hrs_in_period, offset, low_threshold, high_threshold, final_profit) {
		//console.log('running compileGlobalAverages with', hrs_in_period, offset, low_threshold, high_threshold, final_profit)

		var period_key 	= 'period_' + hrs_in_period;
		var offset_key	= 'offset_' + offset;
		var high_key 	= 'high_' + high_threshold;
		var low_key 	= 'low_' + low_threshold;


		if (typeof this.global_averages[period_key] === 'undefined') {
			this.global_averages[period_key] = []
		}
		if (typeof this.global_averages[offset_key] === 'undefined') {
			this.global_averages[offset_key] = []
		}
		if (typeof this.global_averages[high_key] === 'undefined') {
			this.global_averages[high_key] = []
		}
		if (typeof this.global_averages[low_key] === 'undefined') {
			this.global_averages[low_key] = []
		}

		this.global_averages[period_key].push(final_profit)
		this.global_averages[offset_key].push(final_profit)
		this.global_averages[high_key].push(final_profit)
		this.global_averages[low_key].push(final_profit)
	},

	


	printGraphData: function(price_data) {
		this.browser_output = '';
		for (a=0; a < price_data.length; a++) {
			this.browser_output += '"' + price_data[a].datetime + '",' + price_data[a].value_sell + ',' + price_data[a].value_buy + '<br />';
		}
	}





}