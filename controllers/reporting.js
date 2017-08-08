module.exports  = {

    browser_output  	: '',
    chart_data      	: '',
    average_chart_data  : [],
    summary_output  	: '',

    debug: function(str) {
        this.browser_output += str;
    },

    resetOutput: function() {
        this.browser_output 	= '';
        this.chart_data 		= '';
        this.average_chart_data = [];
        this.summary_output 	= '';
    },

    printCurrentPosition: function (current_coin_price_buy, latest_sell_price, total_coins_owned, total_spent, total_sold, 
        total_sell_transactions, total_buy_transactions, max_coins_ever_owned, max_value_ever_owned, money_in_bank) {

		this.debug('<strong> &gt;&gt; CURRENT POSITION</strong><br />');
		this.debug('&gt;&gt; total coins owned right now: ' + total_coins_owned + '<br/>');
		this.debug('&gt;&gt; current coin sell price: $' + latest_sell_price.toFixed(2) + '<br/>');
		this.debug('&gt;&gt; total coins owned value (as sell price) = $' + (total_coins_owned * latest_sell_price).toFixed(2) + '<br />');
		this.debug('&gt;&gt; total money invested spent = $' + total_spent.toFixed(2) + '<br />');
		this.debug('&gt;&gt; total sold = $' + total_sold.toFixed(2) + '<br />');
		this.debug('&gt;&gt; total position (current value of coins  (total sold-total spent): $');
		// theres a function in tools but doenst work here?
		this.debug(((total_coins_owned * latest_sell_price) + total_sold - total_spent).toFixed(2) + '<br />');
		this.debug('&gt;&gt; total sell transactions ' + total_sell_transactions + '<br />');
		this.debug('&gt;&gt; total buy transactions ' + total_buy_transactions + '<br />');
		this.debug('&gt;&gt; max coins ever owned ' + max_coins_ever_owned + '<br />');
		this.debug('&gt;&gt; max value ever owned $' + max_value_ever_owned.toFixed(2) + '<br />');
		this.debug('&gt;&gt; money in bank $' + money_in_bank.toFixed(2) + '<br /><br />');
	},

    printLoopDebug: function(i, values_per_period, price_data, hrs_in_period, this_index, offset, values_in_offset) {
		this.debug('<strong><u>Period ' + Math.floor((i + values_per_period) / values_per_period) + ' of ');
		this.debug((price_data.length / values_per_period).toFixed(2));
		this.debug(' (in ' + hrs_in_period + ' hr periods)</u></strong> ');
		this.debug('(increment ' + ((i % values_per_period) + 1) + ' of ' + values_per_period + ') ');
		this.debug('analyzing slice: ' + i + ' --> ' + (i + values_per_period) + '<br />');
		this.debug('this_index: ' + this_index + '<br />');
		this.debug('offset: ' + offset + '<br />');
		this.debug('values_in_offset: ' + values_in_offset + '<br />');
	},

    updateChartData: function(current_date, latest_buy_price, buy, latest_sell_price, sell, avg_for_period) {
		// ARRAY AS TEXT
		this.chart_data += '["' + current_date + '",';
		this.chart_data += latest_buy_price + ',';
		this.chart_data += (buy) ? '"buy",' : 'null,';
		this.chart_data += latest_sell_price + ',';
		this.chart_data += (sell) ? '"sell",' : 'null,';
		this.chart_data += avg_for_period;
		this.chart_data += '],'
	},

    updateSummaryData: function(final_profit, max_value_ever_owned, invest_profit_ratio, profit_percentage) {
        this.summary_output += '<strong>final profit: $' + final_profit.toFixed(2) + '</strong> ';
		this.summary_output += '(<strong>max ever value: $' + max_value_ever_owned.toFixed(2) + '</strong>) ';
		this.summary_output += 'percentage earnt: ' + profit_percentage.toFixed(2) + '%<br /><br />';
	},
	
	printMaxResultTable: function(max_results, max_results_avg, days) {
		this.debug(`<br /><strong>max 10 results and averages:</strong><br />
			<table class="max">
				<tr>
					<th>rank</th>
					<th>period</th>
					<th>offset</th>
					<th>(sum)</th>
					<th>low</th>
					<th>high</th>
					<th>value</th>
					<th>profit</th>
				</tr>`)
		
		for (i=0; i<max_results.length; i++) {
			var link = this.createLink(max_results[i].period, max_results[i].offset, max_results[i].low, max_results[i].high, 'ETH', days)
			this.debug(`
				<tr>
					<th>${(i+1)}</th>
					<td>${max_results[i].period}</td>
					<td>${max_results[i].offset}</td>
					<td>(${(max_results[i].period+max_results[i].offset)})</td>
					<td>${max_results[i].low.toFixed(3)}</td>
					<td>${max_results[i].high.toFixed(3)}</td>
					<td><a href="${link}" target="_blank" style="color:rgb(0,${(192-(i*10))},0)"><strong>$${max_results[i].value.toFixed(2)}</strong></td>
					<td>${max_results[i].profit.toFixed(2)}%</td>
				</tr>
			`);
			// print avg for rows 5, 10 and 20 only
			if ((i+1)===5 || (i+1)===10 || (i+1)===20) {
				this.addAverageRow(max_results_avg[i], days);
			}
		}
		this.debug(`</table>`);
	},

	addAverageRow: function(avg_item, days) {
		var avg_link = this.createLink(avg_item.period, avg_item.offset, avg_item.low, avg_item.high, 'ETH', days)
		this.debug(`
			<tr>
				<th>top ${i+1} avg:</th>
				<th>${avg_item.period}</th>
				<th>${avg_item.offset}</th>
				<th>${avg_item.period + avg_item.offset}</th>
				<th>${avg_item.low.toFixed(3)}</th>
				<th>${avg_item.high.toFixed(3)}</th>
				<th></th>
				<th><a href="${avg_link}" target="_blank">link →</a></th>
			</tr>
		`);
	},

	// print the raw average data to the screen
	printGlobalAveragesList: function(table_averages, tools) {
		this.debug('<strong>average value of table:</strong><br />')
		for (item in table_averages) {
			var this_avg = tools.getArrayAverage(table_averages[item]).toFixed(0)
			this.debug(item + ': ' + this_avg + '<br />')
		}
	},

	// put average data in array format for printing charts
	compileGlobalAverageChartData: function(table_averages, tools) {
		for (item in table_averages) {

			var this_avg = tools.getArrayAverage(table_averages[item]).toFixed(0)			
			var this_key = item.substr(0, item.indexOf('_'));
			var this_val = item.substr((item.indexOf('_') + 1));

			if (typeof this.average_chart_data[this_key] === 'undefined') {
				this.average_chart_data[this_key] = '';
			}
			this.average_chart_data[this_key] += '["' +  this_val + '",' + this_avg + '],';
		}
	},

	createLink: function(period, offset, low, high, currency, days) {
		return `
			/run-simulation-single
			?hrs_in_period=${period}
			&offset=${offset}
			&low_threshold=${low}
			&high_threshold=${high}
			&currency=${currency}
			&days=${days}
		`;
	},
		
    getFinalOutput: function() {
        return this.browser_output;
    },

    getFinalChartData: function() {
        return this.chart_data;
    },

    getSummaryData: function() {
        return this.summary_output;
	},
	
	getAverageChartData: function() {
        return this.average_chart_data;
    }
}