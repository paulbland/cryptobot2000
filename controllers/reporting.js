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

    printCurrentPosition: function (current_coin_price_buy, current_coin_price_sell, total_coins_owned, total_spent, total_sold, 
        total_sell_transactions, total_buy_transactions, max_coins_ever_owned, max_value_ever_owned, money_in_bank) {

		this.debug('<strong> &gt;&gt; CURRENT POSITION</strong><br />');
		this.debug('&gt;&gt; total coins owned right now: ' + total_coins_owned + '<br/>');
		this.debug('&gt;&gt; current coin sell price: $' + current_coin_price_sell.toFixed(2) + '<br/>');
		this.debug('&gt;&gt; total coins owned value (as sell price) = $' + (total_coins_owned * current_coin_price_sell).toFixed(2) + '<br />');
		this.debug('&gt;&gt; total money invested spent = $' + total_spent.toFixed(2) + '<br />');
		this.debug('&gt;&gt; total sold = $' + total_sold.toFixed(2) + '<br />');
		this.debug('&gt;&gt; total position (coins+total sold-investments): $');
		this.debug(((total_coins_owned * current_coin_price_sell) + total_sold - total_spent).toFixed(2) + '<br />');
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
		this.average_chart_data[this_key] += '["' +  this_val + '",' + value + '],';
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