var express 	= require('express');
var app 		= express();


var fs 			= require('fs');






var total_coins_owned;
var buy_sell_unit;
var total_spent;
var total_sold;
var do_i_own_coins;


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
	 buy_sell_unit 		= 10;
	 total_spent		= 0;
	 total_sold			= 0;


	for (i=0; i<=(btc_data.length - values_per_day); i++) {
		
		// define start and end indexes for main array
		result += 'testing slice: ' + i + ' --> ' + (i+values_per_day) + '<br />';

		// get 24 hrs worth of data (As a slice of 144 values)
		var data_to_be_tested = btc_data.slice(i, (i+values_per_day));

		// run the decide algorithm on just this part
		result += decideBuyOrSell(data_to_be_tested)
	}



	result += 'end test total coins owned = ' + total_coins_owned + '<br />';
	result += 'end test total spent = ' + total_spent + '<br />';
	result += 'total sold (profit)  = ' + total_sold + '<br />';

	return result;


}	



function decideBuyOrSell(data_to_be_tested) {

	var result = '';
	var avg_24_hrs		= 0;
	var latest_price	= 0;	// this will be the currect price we're evaluating

	var high_threshold  = 0.08;	// 4%
	var low_threshold 	= 0.08;	// 4%


	// print length to browser to make sure correct
	//result += 'length is: ' + data_to_be_tested.length + '<br>';

	// calculate avg
	var sum = 0;
	for (j=0; j<data_to_be_tested.length; j++) {
		sum += data_to_be_tested[j].value;
	}
	avg_24_hrs = (sum/data_to_be_tested.length).toFixed(2);

	// print avg result to browser
	result += 'average price for latst 24 hrs is: $' + avg_24_hrs + '<br>';

	//get latest price
	latest_price = data_to_be_tested[data_to_be_tested.length-1].value;

	// print latest to browser
	result += 'latest price: $' + latest_price.toFixed(2) + '<br>';



	

	var avg_plus_high_threshold 	= (avg_24_hrs * (1 + high_threshold)).toFixed(2);
	var avg_minus_low_threshold = (avg_24_hrs * (1 - low_threshold)).toFixed(2);

	result += '(avg price plus high threshold is ' + avg_plus_high_threshold + ')<br />';
	result += '(avg price minus low threshold is ' + avg_minus_low_threshold + ')<br />';

	
	if (latest_price > avg_plus_high_threshold) {
		// check if price is higher than 24 hr avg + threshold
		result += 'latest price is higher than +' + high_threshold + '% --- sell!<br />';

		result +=  sellCoin(latest_price)

	} else if (latest_price < avg_minus_low_threshold) {

		// check if price is lwoer than 24 hr avg + threshold
		result += 'latest price is lower than -' + high_threshold + '% --- buy!<br />';

		result +=  buyCoin(latest_price)

	} else {
		result += 'do nothing<br />';
	}


	result += '<br>';
	return result;

}





function buyCoin(current_coin_price) {

	//if (total_coins_owned > 0) return false;

	var result = '';

	total_coins_owned += (buy_sell_unit/current_coin_price)

	total_spent += buy_sell_unit;

	result += 'total coins owned = ' + total_coins_owned + '<br />';
	result += 'total coins owned value = ' + (total_coins_owned * current_coin_price) + '<br />';

	do_i_own_coins = true;

	return result;
} 


function sellCoin(current_coin_price) {

	if (total_coins_owned === 0) return false;

	// SELL EVERYTHING

	var result = '';

	total_sold += current_coin_price*total_coins_owned;

	total_coins_owned = 0;

	

	result += 'total coins owned = ' + total_coins_owned + '<br />';
	result += 'total sold (profit)  = ' + total_sold + '<br />';

	do_i_own_coins = false;

	return result;
}










function createRandomData() {

	var result = 'module.exports = [';

	for (i=0; i<(144*90); i++) {

		result += '{datetime: "xxx", value : ' + (2300 + (Math.random() * 600)).toFixed(6) + '}';

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