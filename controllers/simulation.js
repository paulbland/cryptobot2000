var tools 		= require('./tools')
var reporting 	= require('./reporting')

var moment 		= require('moment-timezone');
var numeral 	= require('numeral');

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

	// these are for full sim (rusn over entire thing)
	all_results 			: [],				// all data to print max at end
	browser_output 			: '',
	chart_data 				: '',
	average_chart_data		: [],
	summary_output			: '',
	currency 				: null,

	// output options
	print_full_debug		: null,
	print_basic_debug 		: null,
	print_chart_data		: false,
	print_table_data		: false,		// full list of tables
	print_average_data		: false,		// list and 4 charts - default not showing
	print_average_lists		: false,

	// algorthim differences that arent looped
	buy_sell_method			: 'avg',		// 'avg' or 'peak'
	buy_sell_percentage 	: 7.5,
	initial_investment		: 2000,
	buy_sell_unit 			: 0,			// calculated
	money_in_bank 			: 0,			// calculated	
	sell_all				: true,			// false means sell just one unit
	simulate_crash 			: false, 
	crash_effect 			: 0,			// 0, 0.25, 0.5...
	reinvest_profit 		: false,
	start_date				: null, 		// must be set in sim from days value
	days 					: 0,			// passed in. converted to start date in sim

	// timing metrics
	timing_section_a 		: 0,
	timing_section_b 		: 0,

	printSummary: function(price_data) {
		var days_in_records = ((price_data.length / 24 / 60) * this.interval_in_minutes);
		reporting.debug(`
			<strong>Analyzing ${price_data.length} values (${days_in_records.toFixed(2)} days)</strong><br />
			- sell_all: ${this.sell_all}<br />
			- buy_sell_method: '${this.buy_sell_method}'<br />
			- buy_sell_percentage: ${this.buy_sell_percentage}%<br />
			- simulate_crash:  ${this.simulate_crash}<br />
			- reinvest_profit:  ${this.reinvest_profit}<br />
			- initial_investment: $${this.initial_investment}<br />
			- days: ${this.days}<br />
			- start_date: ${this.start_date.format()}<br /><br />
		`);
	},


	setStartDate: function(days, price_data) {
		this.days 		= days;								// save here so i can pass to sim single
		this.start_date = moment().subtract(days, 'days')	// Set start date from days param
		var start_date	= this.start_date;

		// truncate data based on a start time
		price_data = price_data.filter(function (item) {
			return item.datetime > start_date;
		})
		return price_data;
	},


	runFullSimulation: function(price_data, currency, days) {
		reporting.resetOutput(); 

		this.table_data 			= {};
		this.table_averages 		= {};
		this.print_basic_debug 		= false; 
		this.print_full_debug 		= false; 
		this.print_table_data 		= false;  	// usually true - hiding all data tables
		this.print_average_data 	= true;		// lists and 4 average charts
		this.print_average_lists	= false; 	// usually true. just hising for now
		this.currency 				= currency;

		price_data = this.setStartDate(days, price_data)

		if (this.buy_sell_method === 'avg') {
			var test_values = require(__dirname + '/../data/test_values_avg');
		} else if (this.buy_sell_method === 'peak') {
			var test_values = require(__dirname + '/../data/test_values_peak');
		} else {
			return; 
		}

		// TIMING DATA
		var total_tests			= (test_values.period_offset_combos.length * test_values.low_values.length * test_values.high_values.length);
		var total_loops			= (total_tests *  price_data.length)
		var start 				= new Date();
		var time_per_loop 		= 0.0016874719; //ms
		var expected_time		= moment().startOf('day').millisecond(time_per_loop * total_loops).format('H:mm:ss')

		console.log(`Running ${numeral(total_tests).format('0.0a')} tests (${numeral(total_loops).format('0a')} loops). Should be about ${expected_time}.`)

		for (x=0; x < test_values.period_offset_combos.length; x++) {
			for (y=0; y < test_values.low_values.length; y++) {
				for (z=0; z < test_values.high_values.length; z++) {		
					this.processDataSet(test_values.period_offset_combos[x].period, test_values.period_offset_combos[x].offset, 
							test_values.low_values[y], test_values.high_values[z], price_data)
				}
			}
		}

		var execution_time = ((new Date() - start))
		console.log('Took ' + moment().startOf('day').millisecond(execution_time).format('H:mm:ss') + '. (about ' + (execution_time / total_loops).toFixed(10) + ' ms each)')

		// console.log('timing metric a: ' + moment().startOf('day').seconds(this.timing_section_a).format('H:mm:ss') + ' as percentage ' + ((this.timing_section_a/execution_time)*100).toFixed(2) + '%');
		// console.log('timing metric b: ' + moment().startOf('day').seconds(this.timing_section_b).format('H:mm:ss') + ' as percentage ' + ((this.timing_section_b/execution_time)*100).toFixed(2) + '%');
		// console.log('timing metric c: ' + moment().startOf('day').seconds(tools.timing_section_c).format('H:mm:ss') + ' as percentage ' + ((tools.timing_section_c/execution_time)*100).toFixed(2) + '%');
		// console.log('timing metric d: ' + moment().startOf('day').seconds(tools.timing_section_d).format('H:mm:ss') + ' as percentage ' + ((tools.timing_section_d/execution_time)*100).toFixed(2) + '%');
		// console.log('timing metric e: ' + moment().startOf('day').seconds(tools.timing_section_e).format('H:mm:ss') + ' as percentage ' + ((tools.timing_section_e/execution_time)*100).toFixed(2) + '%');
						
		// print summary 
		this.printSummary(price_data); 

		// all averages, max results and average of max results
		if (this.print_average_lists) {
			reporting.printAveragesList(this.table_averages, tools);
		}

		reporting.compileAverageChartData(this.table_averages, tools);
		reporting.printMaxResultTable(this.all_results, this.days);

		this.browser_output 	= reporting.getFinalOutput()
		this.average_chart_data = reporting.getAverageChartData()
	},

	


	runSingleSimulation: function(hrs_in_period, offset, low_threshold, high_threshold, price_data, days) {
		reporting.resetOutput();
		
		this.table_data 		= {};
		this.print_basic_debug 	= true;
		this.print_full_debug 	= true; //usually true for single sim
		this.print_chart_data	= true;

		price_data = this.setStartDate(days, price_data)

		this.printSummary(price_data);
		this.processDataSet(hrs_in_period, offset, low_threshold, high_threshold, price_data)

		this.browser_output 	= reporting.getFinalOutput()
		this.chart_data 		= reporting.getFinalChartData()
		this.summary_output		= reporting.getSummaryData()
		this.average_chart_data = reporting.getAverageChartData()
	},


	/**
	 * essentially a single simulation
	 * 
	 */
	processDataSet: function(hrs_in_period, offset, low_threshold, high_threshold, price_data) {

		if (this.print_basic_debug) {
			this.printLoopSummary(hrs_in_period, offset, low_threshold, high_threshold)
		}

		// these vars are relative to the current single simulation, and will be reset for each run
		this.total_coins_owned 			= 0;
		this.total_spent				= 0;
		this.total_sold					= 0;
		this.total_sell_transactions	= 0;
		this.total_buy_transactions		= 0;
		this.max_coins_ever_owned 		= 0;
		this.max_value_ever_owned 		= 0;

		this.money_in_bank 				= this.initial_investment;															// new - always start with initl investment
		this.buy_sell_unit 				= (this.initial_investment * (this.buy_sell_percentage / 100)); 					// set buy/sell unit to a percentage of init investment
		// also option to set to money in bank ...

		var values_per_period 			= tools.calculateValuesForGivenPeriod(hrs_in_period, this.interval_in_minutes)		//((hrs_in_period * 60) / interval_in_minutes); 	
		var values_in_offset			= tools.calculateValuesForGivenPeriod(offset, this.interval_in_minutes)				//((offset * 60) / this.interval_in_minutes);
		var total_iterations 			= (price_data.length - values_per_period - values_in_offset)

		// NEW - ADD VALUES BEFORE LOOP TO FINAL GRAPH
		if (this.print_chart_data) {
			for (i=0; i<=(values_per_period + values_in_offset); i++) {
				reporting.updateChartData(price_data[i].datetime, price_data[i].value_buy, "", price_data[i].value_sell, "", 0);
			}
		}

		//var start_a = new Date();

		tools.sum = 0;
		tools.sum_last = 0;

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

			//var start_b = new Date();

			// run the decide algorithm on just this part
			var sell_or_buy = tools.decideBuyOrSell(data_to_be_tested, latest_buy_price, latest_sell_price, low_threshold, high_threshold, 
					this.buy_sell_method, this.print_full_debug)

			//this.timing_section_b += ((new Date() - start_b))

			if (sell_or_buy === 'sell') {
				this.sellCoinSim(latest_sell_price, high_threshold)
			} else if (sell_or_buy === 'buy') {
				this.buyCoinSim(latest_buy_price, high_threshold, latest_sell_price)
			} else {
				// Do nothing
				// return 'do_nothing'
				if (this.print_full_debug) {
					reporting.debug('Neither higher nor lower -> do nothing<br />');
				}
			}

			if (this.print_full_debug) {
				reporting.printCurrentPosition(latest_buy_price, latest_sell_price, this.total_coins_owned, this.total_spent, this.total_sold, 
					this.total_sell_transactions, this.total_buy_transactions, this.max_coins_ever_owned, this.max_value_ever_owned, this.money_in_bank);
			}

			// update chart data for each iteration of 10 mins
			if (this.print_chart_data) {
				var sell = (sell_or_buy === 'sell') ? true : false;
				var buy = (sell_or_buy === 'buy') ? true : false;
				reporting.updateChartData(current_date, latest_buy_price, buy, latest_sell_price, sell, tools.calculateAverage(data_to_be_tested));
			}
		}

		//this.timing_section_a += ((new Date() - start_a))

		// calculate final profit now set has been process
		var final_sell_price 	= price_data[(price_data.length - 1)].value_sell;
		
		// simulates crash to a set amount
		if (this.simulate_crash) {
			final_sell_price *= this.crash_effect;
		}

		var final_profit 		= ((this.total_coins_owned * final_sell_price) + this.total_sold - this.total_spent)
		var invest_profit_ratio	= (this.max_value_ever_owned / final_profit).toFixed(2)
		var profit_percentage	= ((final_profit / this.max_value_ever_owned) * 100).toFixed(2)

		// put all results in array - to print max values later
		// similar to what happens in compileTableData.... kinda.. that could read from this?
		this.all_results.push({
			value 	: final_profit,
			period 	: hrs_in_period,
			offset 	: offset,
			low 	: low_threshold,
			high	: high_threshold,
			profit 	: profit_percentage
		})

		if (this.print_basic_debug) {
			reporting.updateSummaryData(final_profit, this.max_value_ever_owned, invest_profit_ratio, profit_percentage)
		}

		if (this.print_table_data) {
			this.compileTableData(hrs_in_period, offset, low_threshold, high_threshold, final_profit, invest_profit_ratio, profit_percentage);
		}
		
		if (this.print_average_data) {
			this.compileAverageData(hrs_in_period, offset, low_threshold, high_threshold, final_profit);
		}
	}, 




	buyCoinSim: function(current_coin_price_buy, high_threshold, latest_sell_price) {

		if (this.print_full_debug) {
			reporting.debug('latest price is lower than -' + high_threshold + '% --- buy!<br />');
		}

		var buy_coin_result = tools.buyCoin(this.total_coins_owned, this.buy_sell_unit, current_coin_price_buy, this.print_full_debug, latest_sell_price, 
				this.total_spent, this.total_sold, this.money_in_bank, this.reinvest_profit)
		
		if (buy_coin_result.number_of_coins_to_buy === 0) {
			return;
		}

		// update sim values
		this.total_coins_owned 			+= buy_coin_result.number_of_coins_to_buy;
		this.total_spent 				+= buy_coin_result.amount_spent_on_this_transaction;
		this.money_in_bank 				-= buy_coin_result.amount_spent_on_this_transaction;

		//console.log('here', this.total_coins_owned, this.total_spent, this.money_in_bank )
		
		// if statement uneccessary since it returns earlier if 0 coins
		// but just to be sure!
		if (buy_coin_result.number_of_coins_to_buy > 0) {
			this.total_buy_transactions++;
		}

		// update total owned (set before transaction - need to be updated)
		var value_of_coins_owned_after_transaction = (this.total_coins_owned * latest_sell_price)

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



	 sellCoinSim: function(latest_sell_price, high_threshold) {

		if (this.print_full_debug) {
			reporting.debug('latest price is higher than +' + high_threshold + '% --- sell!<br />');
		}

		if (this.total_coins_owned === 0) {
			if (this.print_full_debug) {
				reporting.debug('you don’t have any coins to sell!<br />')
			}
			return;
		}

		var sell_coin_result = tools.sellCoin(high_threshold, this.print_full_debug, this.sell_all, this.total_coins_owned, this.buy_sell_unit, latest_sell_price)

		this.total_coins_owned 	-= sell_coin_result.number_of_coins_to_sell;
		this.total_sold			+= sell_coin_result.result_of_this_sale;
		this.money_in_bank 		+= sell_coin_result.result_of_this_sale;

		this.total_sell_transactions++;
	},



 



	printLoopSummary: function(hrs_in_period, offset, low_threshold, high_threshold) {
		reporting.debug('<strong>Loop variables:</strong><br />');
		reporting.debug('- hrs_in_period: ' + hrs_in_period + '<br />');
		reporting.debug('- offset: ' + offset + '<br />');
		reporting.debug('- low_threshold: ' + low_threshold + '<br />');
		reporting.debug('- high_threshold: ' + high_threshold + '<br /><br />');
	},



	compileTableData: function(period, offset, low_threshold, high_threshold, final_profit, invest_profit_ratio, profit_percentage) {

		var array_key 	= `period-offset_${period}-${offset}`;
		var row_key 	= `row_${high_threshold}`;
		var cell_link 	= `
			/run-simulation-single
			?hrs_in_period=${period}
			&offset=${offset}
			&low_threshold=${low_threshold}
			&high_threshold=${high_threshold}
			&currency=${this.currency}
			&days=${this.days}
		`;

		if (typeof this.table_data[array_key] === 'undefined') {
			this.table_data[array_key] = {
				header_row 	: ['<th>↓high\\low→</th>']
			}
		}

		// adds for every loop. this prevents that. not elegant...
		if (this.table_data[array_key].header_row[(this.table_data[array_key].header_row.length - 1)] !== '<th>'+low_threshold+'</th>') {
			this.table_data[array_key].header_row.push('<th>'+low_threshold+'</th>')
		}

		// add value
		if (typeof this.table_data[array_key][row_key] === 'undefined') {
			this.table_data[array_key][row_key] = ['<th>'+high_threshold+'</th>']
		}

		// set color value from 0-255 based on value of final profit
		var max 		= 2000;
		var min  		= -2000;
		var rgb_color 	= 0;
		var cell_color 	= '';
		var cell_str 	= '';
		var max_rgb_value = 128; // half 256

		if (final_profit > 0) {

			rgb_color 	= Math.floor(final_profit * (max_rgb_value / max));
			rgb_color 	= (rgb_color > max_rgb_value) ? max_rgb_value : rgb_color;
			cell_color 	= 'rgb(0,'+rgb_color+',0)';

		} else if (final_profit < 0) {

			rgb_color 	= Math.floor(final_profit * (max_rgb_value / min));
			rgb_color 	= (rgb_color > max_rgb_value) ? max_rgb_value : rgb_color;
			cell_color 	= 'rgb('+rgb_color+',0,0)';

		} else if (final_profit === 0) {
			cell_color = '#ccc';
		}

		cell_str += `
			<td style="background-color:${cell_color}">
				<a href="${cell_link}" target="_blank">$${final_profit.toFixed(2)}</a><br />
				<span>($${this.max_value_ever_owned.toFixed(2)}\/${profit_percentage}%)</span>
			</td>
		`;

		this.table_data[array_key][row_key].push(cell_str)

		// table format for reference
		// this.table_data['x_y'] = {
		// 		"header_row" : ['', 0.05, 0.4, 0.7],
		// 		"row_0.05" : [34,234,454]
		//		"row_0.06" : [34,234,454]
	},



	compileAverageData: function(period, offset, low_threshold, high_threshold, final_profit) {

		var array_key 	= `period-offset_${period}-${offset}`;

		if (typeof this.table_averages[array_key] === 'undefined') {
			this.table_averages[array_key] = [];
			this.table_averages['sum_' + (period + offset)] = [];
		}

		// create array of final profit values (print average later)
		this.table_averages[array_key].push(final_profit)
		this.table_averages['sum_' + (period + offset)].push(final_profit)

		// compile averages for low and high
		var high_key 	= 'high_' + high_threshold;
		var low_key 	= 'low_' + low_threshold;

		if (typeof this.table_averages[high_key] === 'undefined') {
			this.table_averages[high_key] = []
		}
		if (typeof this.table_averages[low_key] === 'undefined') {
			this.table_averages[low_key] = []
		}
		
		this.table_averages[high_key].push(final_profit)
		this.table_averages[low_key].push(final_profit)

	},


}