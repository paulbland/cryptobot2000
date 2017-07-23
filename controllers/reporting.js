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
		this.summary_output += 'percentage earnt: ' + profit_percentage + '%<br /><br />';
	},
	
	updateAverageChartData: function(key, value) {
		// array as text
		var this_key = key.substr(0, key.indexOf('_'));
		var this_val = key.substr((key.indexOf('_') + 1));

		if (typeof this.average_chart_data[this_key] === 'undefined') {
			this.average_chart_data[this_key] = '';
		}

		// reverting to original - treat it as string to get exact value of chart...
		
		// period offset combo gets a string. others get a num
		//if (this_key === 'period-offset') {	
			//just get period value for chart
			//this_val = this_val.substring(0, this_val.indexOf("-"))
			//this.average_chart_data[this_key] += '[' +  this_val + ',' + value + '],';

			// reverting to original
			this.average_chart_data[this_key] += '["' +  this_val + '",' + value + '],';
		//} else {
		//	this.average_chart_data[this_key] += '[' +  this_val + ',' + value + '],';
		//}
	},


	printMaxResults: function(all_results) {

		this.debug('<br /><strong>max 10 results and averages:</strong><br />')

		all_results.sort(function(a, b) {
    		return parseFloat(b.value) - parseFloat(a.value);
		});

		var limit = 20;

		// for really short tests if im doing fewer than 20 combos, need this
		if (limit > all_results.length) {
			limit = all_results.length
		}

		var sums = {
			period 	: 0,
			offset 	: 0,
			low 	: 0,
			high 	: 0
		};

		this.debug(`
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
			</tr>
		`)
		
		for (i=0; i<limit; i++) {

			var link = `
				/run-simulation-single
				?hrs_in_period=${all_results[i].period}
				&offset=${all_results[i].offset}
				&low_threshold=${all_results[i].low}
				&high_threshold=${all_results[i].high}
				&currency=ETH
			`;

			this.debug(`
				<tr>
					<th>${(i+1)}</th>
					<td>${all_results[i].period}</td>
					<td>${all_results[i].offset}</td>
					<td>(${(all_results[i].period+all_results[i].offset)})</td>
					<td>${all_results[i].low}</td>
					<td>${all_results[i].high}</td>
					<td><a href="${link}" target="_blank" style="color:rgb(0,${(192-(i*5))},0)"><strong>$${all_results[i].value.toFixed(2)}</strong></td>
					<td>${all_results[i].profit}%</td>
				</tr>
			`);

			// create sums for each value to calcualte averages
			sums.period += all_results[i].period;
			sums.offset += all_results[i].offset;
			sums.low 	+= all_results[i].low;
			sums.high	+= all_results[i].high;

			if ((i+1)===5 || (i+1)===10 || (i+1)===20) {
				this.addAverages(sums, (i+1))
			}
		}

		this.debug(`</table>`)
	},


	addAverages: function(sums, total) {

		// calculate averages
		// round offset and period to nearest 0.5 cos thats all i can handle at this point
		var avgs = {
			period 	: this.roundToPoint5(sums.period / total),  
			offset 	: this.roundToPoint5(sums.offset / total),
			low 	: (sums.low / total).toFixed(3),
			high 	: (sums.high / total).toFixed(3)
		};

		// create avg link
		var avg_link = `
			/run-simulation-single
			?hrs_in_period=${avgs.period}
			&offset=${avgs.offset}
			&low_threshold=${avgs.low}
			&high_threshold=${avgs.high}
			&currency=ETH
		`;

		// add averages
		this.debug(`
			<tr>
				<th>top ${i+1} avg:</th>
				<th>${avgs.period}</th>
				<th>${avgs.offset}</th>
				<th>${avgs.period + avgs.offset}</th>
				<th>${avgs.low}</th>
				<th>${avgs.high}</th>
				<th></th>
				<th><a href="${avg_link}" target="_blank">link →</a></th>
			</tr>
		`);
	},


	printAverages: function(table_averages, tools) {

		// print table averages
		this.debug('<strong>average value of table:</strong><br />')
		for (item in table_averages) {
			var this_avg = tools.getArrayAverage(table_averages[item]).toFixed(0)
			this.debug(item + ': ' + this_avg + '<br />')
			this.updateAverageChartData(item, this_avg)
		}


		// // print global averages
		// this.debug('<br /><strong>global averages:</strong><br />')
		// for (x in global_averages) {
		// 	var this_avg = tools.getArrayAverage(global_averages[x]).toFixed(0)
		// 	this.debug(x + ': ' + this_avg + '<br />')
		// 	this.updateAverageChartData(x, this_avg)
		// }

	},
		
	roundToPoint5: function(num) {
  		return (Math.round(num * 2) / 2);
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