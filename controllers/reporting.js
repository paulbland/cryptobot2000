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
		//this.summary_output += 'invested:profit ratio: ' + invest_profit_ratio + ' ';
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

		var show_top = 10;

		var sums = {
			period 	: 0,
			offset 	: 0,
			low 	: 0,
			high 	: 0
		};

		this.debug('<table class="max">')
		this.debug('<tr><th>rank</th><th>period</th><th>offset</th><th>low</th><th>high</th><th>value</th></tr>')
		
		for (i=0; i<show_top; i++) {
			this.debug('<tr>')
			this.debug('<th>'+(i+1)+'</th>')
			this.debug('<td>'+all_results[i].period+'</td>')
			this.debug('<td>'+all_results[i].offset+'</td>')
			this.debug('<td>'+all_results[i].low+'</td>')
			this.debug('<td>'+all_results[i].high+'</td>')
			this.debug('<td><span style="color:rgb(0,'+(192-(i*10))+',0)"><strong>$' + all_results[i].value.toFixed(2) + '</strong></span></td>')
			this.debug('</tr>')

			// create sums for each value to calcualte averages
			sums.period += all_results[i].period;
			sums.offset += all_results[i].offset;
			sums.low 	+= all_results[i].low;
			sums.high	+= all_results[i].high;
		}

		// calculate averages
		var avgs = {
			period 	: (sums.period / show_top),
			offset 	: (sums.offset / show_top),
			low 	: (sums.low / show_top).toFixed(4),
			high 	: (sums.high / show_top).toFixed(4)
		};

		// create avg link
		var avg_link = "http://localhost:5000/run-simulation-single?hrs_in_period="+avgs.period+"&offset="+avgs.offset+"&low_threshold="+avgs.low+"&high_threshold="+avgs.high+"&currency=ETH";

		// add averages
		this.debug('<tr>')
		this.debug('<th>averages:</th>')
		this.debug('<th>'+avgs.period+'</th>')
		this.debug('<th>'+avgs.offset+'</th>')
		this.debug('<th>'+avgs.low+'</th>')
		this.debug('<th>'+avgs.high+'</th>')
		this.debug('<th><a href="'+avg_link+'" target="_blank">link →</a></th>')
		this.debug('</tr>')

		this.debug('</table>')
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