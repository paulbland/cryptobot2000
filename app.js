var express 	= require('express');
var app 		= express();


var fs 			= require('fs');






var total_coins_owned;
var buy_sell_unit;
var total_spent;
var total_sold;
var do_i_own_coins;
var total_transactions;
var max_coins_ever_owned;
var max_value_ever_owned;


app.get('/', function(req, res) {
	var result = testLoop();
	res.send(result);
})


app.get('/create', function(req, res) {
	createRandomData();
})

app.listen(process.env.PORT, function() { 
	console.log('running on port: ' + process.env.PORT)
})






function testLoop() {


	var result = '';

	var btc_data 			= require('./btc_data')	// 30 days of data (144*30 = 4320)
	var values_per_day 		= 144;					// there are 144 10-min incremetns in a day
	

	 total_coins_owned 	= 0;
	 buy_sell_unit 		= 100;
	 total_spent		= 0;
	 total_sold			= 0;
	 total_transactions	 = 0;
	 max_coins_ever_owned = 0;
	 max_value_ever_owned = 0;


	for (i=0; i<=(btc_data.length - values_per_day); i++) {
		
		// define start and end indexes for main array
		result += '<strong><u>Day ' + Math.floor((i+values_per_day)/values_per_day) + ' of ' + (btc_data.length/values_per_day) + '</u></strong> ';
		result += '(increment ' + ((i % values_per_day)+1) + ' of ' + values_per_day + ') ';
		result += 'testing slice: ' + i + ' --> ' + (i+values_per_day) + '<br />';

		// get 24 hrs worth of data (As a slice of 144 values)
		var data_to_be_tested = btc_data.slice(i, (i+values_per_day));

		// run the decide algorithm on just this part
		result += decideBuyOrSell(data_to_be_tested)
	}

	return result;


}	



function decideBuyOrSell(data_to_be_tested) {

	var result = '';
	var avg_24_hrs		= 0;
	var latest_buy_price	= 0;	// this will be the currect price we're evaluating
	var latest_sell_price	= 0;	// this will be the currect price we're evaluating

	var high_threshold  = 0.08;	// as a %
	var low_threshold 	= 0.08;	// as a %


	// print length to browser to make sure correct
	//result += 'length is: ' + data_to_be_tested.length + '<br>';

	// calculate avg
	var sum = 0;
	for (j=0; j<data_to_be_tested.length; j++) {
		sum += data_to_be_tested[j].value_buy;
	}
	avg_24_hrs = (sum/data_to_be_tested.length).toFixed(2);

	// print avg result to browser
	result += 'average price for last 24 hrs is: $' + avg_24_hrs + '<br>';

	//get latest price
	latest_buy_price = data_to_be_tested[data_to_be_tested.length-1].value_buy;
	latest_sell_price = data_to_be_tested[data_to_be_tested.length-1].value_sell;

	// print latest to browser
	result += 'latest buy price: $' + latest_buy_price.toFixed(2) + '<br>';
	result += 'latest sell price: $' + latest_sell_price.toFixed(2) + '<br>';


	var avg_plus_high_threshold = (avg_24_hrs * (1 + high_threshold)).toFixed(2);
	var avg_minus_low_threshold = (avg_24_hrs * (1 - low_threshold)).toFixed(2);

	result += '(avg price plus high threshold is ' + avg_plus_high_threshold + ')<br />';
	result += '(avg price minus low threshold is ' + avg_minus_low_threshold + ')<br />';

	
	if (latest_sell_price > avg_plus_high_threshold) {
		// check if price is higher than 24 hr avg + threshold
		result += 'latest price is higher than +' + high_threshold + '% --- sell!<br />';

		result +=  sellCoin(latest_sell_price)

	} else if (latest_buy_price < avg_minus_low_threshold) {

		// check if price is lwoer than 24 hr avg + threshold
		result += 'latest price is lower than -' + high_threshold + '% --- buy!<br />';

		result +=  buyCoin(latest_buy_price)

	} else {
		result += 'Neither higher nor lower -> do nothing<br />';
	}

	result += printCurrentPosition(latest_buy_price, latest_sell_price);

	return result;

}





function buyCoin(current_coin_price_buy) {

	//if (total_coins_owned > 0) return false;

	var result 					= '';
	var number_of_coins_to_buy 	= (buy_sell_unit/current_coin_price_buy)

	total_coins_owned 			+= number_of_coins_to_buy;
	total_spent 				+= buy_sell_unit;
	do_i_own_coins 				= true;
	total_transactions++;

	max_coins_ever_owned = (total_coins_owned > max_coins_ever_owned) ? total_coins_owned : max_coins_ever_owned;

	var value_of_coins_owned_right_now = (total_coins_owned * current_coin_price_buy)
	max_value_ever_owned = (value_of_coins_owned_right_now > max_value_ever_owned) ? value_of_coins_owned_right_now : max_value_ever_owned;

	result += '<span style="color:green">TRANSACTION: BUYING $' +  buy_sell_unit + ': ' + number_of_coins_to_buy + 'BTC  valued at $' + current_coin_price_buy + '</span><br />';

	return result;
} 


function sellCoin(current_coin_price_sell) {

	if (total_coins_owned === 0) {
		return 'dont have any coins to sell! returning<br/>';
	}

	// SELL EVERYTHING

	var result 				= '';
	var result_of_this_sale = (current_coin_price_sell*total_coins_owned)
	total_sold 				+= result_of_this_sale;
	total_transactions++;


	result += '<span style="color:red">TRANSACTION: SELL ALL COINS: ' +  total_coins_owned + ' BTC valued at $' + current_coin_price_sell + ' = $' + result_of_this_sale + '</span><br />';

	total_coins_owned 	= 0;
	do_i_own_coins 		= false;

	return result;
}




function printCurrentPosition(current_coin_price_buy, current_coin_price_sell) {

	var result = '<strong> &gt;&gt; CURRENT POSITION</strong><br />';

	result += '&gt; total bitcoins owned right now: ' + total_coins_owned + '<br/>';
	result += '&gt; current bitcoin sell price: $' + current_coin_price_sell.toFixed(2) + '<br/>';
	result += '&gt; total coins owned value (as sell price) = $' + (total_coins_owned * current_coin_price_sell).toFixed(2) + '<br />';
	result += '&gt; total money invested spent = $' + total_spent + '<br />';
	result += '&gt; total sold   = $' + total_sold.toFixed(2) + '<br />';
	result += '&gt; total position (coins+total sold-investments): $' + ((total_coins_owned * current_coin_price_sell) + total_sold - total_spent).toFixed(2) + '<br />';
	result += '&gt; total transaction ' + total_transactions + '<br />';
	result += '&gt; max coins ever owned ' + max_coins_ever_owned + '<br />';
	result += '&gt; max value ever owned $' + max_value_ever_owned.toFixed(2) + '<br /><br />';

	return result;

}







function createRandomData() {

	var buy_price;
	var sell_price;

	var difference = 0.02; // %

	var result = 'module.exports = [';

	for (i=0; i<(144*30); i++) {

		buy_price 	= (2300 + (Math.random() * 600)).toFixed(6);
		sell_price 	= (buy_price * (1 - difference)).toFixed(6);

		result += '{datetime: "xxx", value_buy : ' + buy_price + ', value_sell : ' + sell_price + '}';

		if (i != ((144*90)-1)) {
			result += ',\n';
		}

	}

	result += ']';


	fs.writeFile("btc_data.js", result, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	}); 


}