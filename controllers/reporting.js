module.exports  = {

    browser_output : '',

    debug: function(str) {
        this.browser_output += str;
    },

    getFinalOutput : function() {
        return this.browser_output;
    },

    reset: function() {
        this.browser_output = '';
    },

    printCurrentPosition: function (current_coin_price_buy, current_coin_price_sell, total_coins_owned, total_spent, total_sold, 
        total_sell_transactions, total_buy_transactions, max_coins_ever_owned, max_value_ever_owned) {
            
		this.debug('<strong> &gt;&gt; CURRENT POSITION</strong><br />');
		this.debug('&gt;&gt; total coins owned right now: ' + total_coins_owned + '<br/>');
		this.debug('&gt;&gt; current coin sell price: $' + current_coin_price_sell.toFixed(2) + '<br/>');
		this.debug('&gt;&gt; total coins owned value (as sell price) = $' + (total_coins_owned * current_coin_price_sell).toFixed(2) + '<br />');
		this.debug('&gt;&gt; total money invested spent = $' + total_spent + '<br />');
		this.debug('&gt;&gt; total sold = $' + total_sold.toFixed(2) + '<br />');
		this.debug('&gt;&gt; total position (coins+total sold-investments): $');
		this.debug(((total_coins_owned * current_coin_price_sell) + total_sold - total_spent).toFixed(2) + '<br />');
		this.debug('&gt;&gt; total sell transactions ' + total_sell_transactions + '<br />');
		this.debug('&gt;&gt; total buy transactions ' + total_buy_transactions + '<br />');
		this.debug('&gt;&gt; max coins ever owned ' + max_coins_ever_owned + '<br />');
		this.debug('&gt;&gt; max value ever owned $' + max_value_ever_owned.toFixed(2) + '<br /><br />');
	}
}