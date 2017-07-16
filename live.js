var express 	= require('express');
var mongoose 	= require('mongoose');
var coinbase 	= require('coinbase');
var app 		= express();

var tools 		= require('./controllers/tools')
var reporting 	= require('./controllers/reporting')








// DATABASE
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// get latest live data from dd
var liveDataModelETH = require('./models/livedatamodeleth')

// prep new item to be appended to live data recrod
var newliveDataRecordETH = liveDataModelETH();


var really_buy_and_sell = false; //THIS IS IT
var initial_investment = 2000;


console.log('running live.js!')
step1();



function step1() {
	//console.log('starting step 1...');

	// GET PRICE RECORDS
	//var priceRecordModelBTC = require('./models/pricerecordmodelbtc')
	var priceRecordModelETH = require('./models/pricerecordmodeleth')
	//var priceRecordModelLTC = require('./models/pricerecordmodelltc')

	priceRecordModelETH.find({}, function(error, price_data_eth) {
		if (error) {
			res.json(error);
			console.log('error connecting to db');
			process.exit(1);
		}
		else {
			console.log('got priceRecordModelETH data');
			step2(price_data_eth);
		}
	});

}


function step2(price_data_eth) {
	//console.log('starting step 2...');
	
	// get latest 
	liveDataModelETH.findOne({}).sort('-datetime_updated').exec(function(error, live_data_eth) {
		if (error) {
			res.json(error);
			console.log('error connecting to db');
			process.exit(1);
		}
		else {
			console.log('got liveDataModelETH data');
			// if first time, created empty set
			if (!live_data_eth) {
				live_data_eth = {
					totals: {
						total_coins_owned 		: 0,
						total_coins_sold_value 	: 0,
						total_sell_transactions : 0,
						total_buy_transactions  : 0,
						total_spent             : 0,
						current_value_of_coins_owned : 0,
						current_position        : 0,
						money_in_bank 	        : initial_investment
					},
					latest_sell_price      	 	: 0, 
					latest_buy_price        	: 0,
					transaction: {
						transaction 			: ''
					}
				}
			}
			//console.log(live_data_eth);
			step3(price_data_eth, live_data_eth)
		}
	});


}



function step3(price_data, live_data_eth) {
	//console.log('starting step 3...');

	// hard code vars for live
	var low_threshold 		= 0.14;
	var high_threshold 		= 0.145;
	var buy_sell_method		= 'avg';
	var print_full_debug 	= false;
	var period 				= 8 // formerlly hrs_in_period
	var offset 				= 14;
	var interval_in_minutes = 10;
	var sell_all			= true; 
	var buy_sell_percentage	= 7.5;
	//var buy_limit			= 2000;
	//var buy_sell_unit		= (buy_limit * (buy_sell_percentage / 100)); // calculate
	var buy_sell_unit		= (live_data_eth.totals.money_in_bank * (buy_sell_percentage / 100)); // calculate

	var values_per_period 	= tools.calculateValuesForGivenPeriod(period, interval_in_minutes)			
	var values_in_offset	= tools.calculateValuesForGivenPeriod(offset, interval_in_minutes)	
	var from_index 			= (price_data.length - (values_per_period + values_in_offset))		// start index, minus offset and period length
	var to_index 			= (price_data.length - values_in_offset)							// last period index (same without period length)
	var data_to_be_tested 	= price_data.slice((from_index - 1), (to_index - 1));				// get slice. take one since index starts from 0
	var this_index 			= (price_data.length - 1);				// alwasys last value
	var latest_buy_price 	= price_data[this_index].value_buy;		// this will be the currect price we're evaluating
	var latest_sell_price 	= price_data[this_index].value_sell;	// this will be the currect price we're evaluating

	// override for testing
	// latest_sell_price = 225;
	// latest_buy_price = 145;

	// decide buy or sell
	var sell_or_buy = tools.decideBuyOrSell(data_to_be_tested, latest_buy_price, latest_sell_price, low_threshold, high_threshold, buy_sell_method, print_full_debug)

	// TESTING OVERRIDE
	// sell_or_buy = 'sell'
	// sell_or_buy = 'buy'

	// console.log('price_data.length: ' + price_data.length)
	// console.log('from_index: ' + from_index)
	// console.log('to_index: ' + to_index)
	// console.log('this_index: ' + this_index)
	// console.log('latest_buy_price: ' + latest_buy_price)
	// console.log('latest_sell_price: ' + latest_sell_price)
	// console.log('sell_or_buy: ' + sell_or_buy)

	// create new record 
	newliveDataRecordETH.datetime_updated 				= new Date;
	newliveDataRecordETH.latest_sell_price 				= latest_sell_price;
	newliveDataRecordETH.latest_buy_price 				= latest_buy_price;
	newliveDataRecordETH.transaction.transaction	 	= sell_or_buy;

	// set fields that may not be updated to most recent value
	newliveDataRecordETH.totals.total_coins_owned 				= live_data_eth.totals.total_coins_owned;			// total - carried over
	newliveDataRecordETH.totals.total_coins_sold_value 			= live_data_eth.totals.total_coins_sold_value;		// total - carried over
	newliveDataRecordETH.totals.total_sell_transactions 		= live_data_eth.totals.total_sell_transactions;		// total - carried over
	newliveDataRecordETH.totals.total_buy_transactions 			= live_data_eth.totals.total_buy_transactions;		// total - carried over
	newliveDataRecordETH.totals.total_spent						= live_data_eth.totals.total_spent;					// total - carried over
	newliveDataRecordETH.totals.current_value_of_coins_owned	= live_data_eth.totals.current_value_of_coins_owned;// total - carried over
	newliveDataRecordETH.totals.current_position				= live_data_eth.totals.current_position;			// total - carried over
	newliveDataRecordETH.totals.money_in_bank					= live_data_eth.totals.money_in_bank;				// total - carried over

	newliveDataRecordETH.transaction.transaction_notes			= '';										// transaction - reset
	newliveDataRecordETH.transaction.number_of_coins_to_sell	= 0;										// transaction - reset // sell only
	newliveDataRecordETH.transaction.result_of_this_sale		= 0;										// transaction - reset // sell only
	newliveDataRecordETH.transaction.number_of_coins_to_buy		= 0;										// transaction - reset // buy only
	newliveDataRecordETH.transaction.amount_spent_on_this_transaction = 0;									// transaction - reset // buy only
	newliveDataRecordETH.transaction.api_response_err			= '';										// transaction - reset
	newliveDataRecordETH.transaction.api_response_xfer			= '';										// transaction - reset
	
	var avg_for_period 								= tools.calculateAverage(data_to_be_tested) 
	newliveDataRecordETH.avg_for_period 			= avg_for_period														// current iteration - set here only
	newliveDataRecordETH.avg_plus_high_threshold 	= tools.calculateAvgPlusHighThreshold(avg_for_period, high_threshold); 	// current iteration - set here only
	newliveDataRecordETH.avg_minus_low_threshold 	= tools.calculateAvgMinusLowThreshold(avg_for_period, low_threshold); 	// current iteration - set here only

	// wont change but lets record to make it easier to read logs
	newliveDataRecordETH.program_vars = {
		low_threshold 		: low_threshold,
		high_threshold 		: high_threshold,
		buy_sell_percentage	: buy_sell_percentage,
		buy_sell_unit	 	: buy_sell_unit,
		period	 			: period,
		offset	 			: offset
	} 		

	if (sell_or_buy === 'sell') {
		sellCoinAPI(high_threshold, sell_all, live_data_eth, buy_sell_unit, latest_sell_price)
	} else if (sell_or_buy === 'buy') {
		buyCoinAPI(live_data_eth, buy_sell_unit, latest_buy_price)
	} else {
		// Do nothing
		// returns 'do_nothing'
		//newliveDataRecordETH.transaction.transaction_notes = 'not buying or selling';
		finalStepSaveAndExit()
	}

	// console.log('ORIGINAL DATA: ')
	// console.log('live_data_eth.datetime_updated: ' + live_data_eth.datetime_updated)
	// console.log('live_data_eth.total_coins_owned: ' + live_data_eth.total_coins_owned)
	// console.log('live_data_eth.total_coins_sold: ' + live_data_eth.total_coins_sold)

	// console.log('SAVING THIS MODEL');
	// console.log(newliveDataRecordETH);

}



function sellCoinAPI(high_threshold, sell_all, live_data_eth, buy_sell_unit, latest_sell_price) {
	console.log('SELLING COIN FROM API!');

	if (live_data_eth.totals.total_coins_owned === 0) {
		//console.log('you don’t have any coins to sell!<br />')
		newliveDataRecordETH.transaction.transaction_notes = 'You don’t have any coins to sell!';
		finalStepSaveAndExit()
		return;
	}

	var sell_coin_result = tools.sellCoin(high_threshold, false, sell_all, live_data_eth.totals.total_coins_owned, buy_sell_unit, latest_sell_price)

	// console.log("sell_coin_result");
	// console.log(sell_coin_result);

	newliveDataRecordETH.transaction.number_of_coins_to_sell = sell_coin_result.number_of_coins_to_sell;
	newliveDataRecordETH.transaction.result_of_this_sale 	= sell_coin_result.result_of_this_sale;
	newliveDataRecordETH.transaction.transaction_notes 		= sell_coin_result.transaction_notes;
	
	newliveDataRecordETH.totals.total_coins_owned 			= (live_data_eth.totals.total_coins_owned - sell_coin_result.number_of_coins_to_sell);
	newliveDataRecordETH.totals.total_coins_sold_value 		= (live_data_eth.totals.total_coins_sold_value + sell_coin_result.result_of_this_sale);
	newliveDataRecordETH.totals.money_in_bank 				= (live_data_eth.totals.money_in_bank + sell_coin_result.result_of_this_sale);
	
	if (sell_coin_result.number_of_coins_to_sell > 0) {
		newliveDataRecordETH.totals.total_sell_transactions = (live_data_eth.totals.total_sell_transactions + 1);
	}


	if (really_buy_and_sell) {

		// connect to coinbase and get my ETH account
		console.log('connecting to api')
		var client 			= new coinbase.Client({'apiKey': process.env.COINBASE_API_KEY, 'apiSecret': process.env.COINBASE_API_SECRET});
		var myETHAccount 	= client.getAccount(process.env.ETH_ACCOUNT_ID, function(err, account) {

			//console.log(account);

			var args = {
				"amount"	: sell_coin_result.number_of_coins_to_sell,  //"0.001",
				"currency" 	: "ETH"
			};
			account.sell(args, function(err, xfer) {
				//console.log('selling done');

				// store response in DB
				newliveDataRecordETH.transaction.api_response_err 	= err;
				newliveDataRecordETH.transaction.api_response_xfer 	= xfer;

				finalStepSaveAndExit();
			});

		});
	} else {
		finalStepSaveAndExit();
	}





	

}


function buyCoinAPI(live_data_eth, buy_sell_unit, latest_buy_price, total_spent, total_sold) {
	console.log('BUYING COIN FROM API!');

	var buy_coin_result = tools.buyCoin(live_data_eth.totals.total_coins_owned, buy_sell_unit, latest_buy_price, false, 
			live_data_eth.totals.total_spent, live_data_eth.totals.total_coins_sold_value, live_data_eth.totals.money_in_bank)

	// console.log("buy_coin_result");
	// console.log(buy_coin_result);

	newliveDataRecordETH.totals.total_coins_owned 			= (live_data_eth.totals.total_coins_owned + buy_coin_result.number_of_coins_to_buy);
	newliveDataRecordETH.totals.total_spent 				= (live_data_eth.totals.total_spent + buy_coin_result.amount_spent_on_this_transaction);
	newliveDataRecordETH.totals.money_in_bank 				= (live_data_eth.totals.money_in_bank - buy_coin_result.amount_spent_on_this_transaction);
	
	newliveDataRecordETH.transaction.transaction_notes 					= buy_coin_result.transaction_notes;
	newliveDataRecordETH.transaction.number_of_coins_to_buy 			= buy_coin_result.number_of_coins_to_buy;
	newliveDataRecordETH.transaction.amount_spent_on_this_transaction 	= buy_coin_result.amount_spent_on_this_transaction

	if (buy_coin_result.number_of_coins_to_buy > 0) {
		newliveDataRecordETH.totals.total_buy_transactions 	= (live_data_eth.totals.total_buy_transactions + 1);
	}



	if (really_buy_and_sell) {

		// connect to coinbase and get my ETH account
		console.log('connecting to api')
		var client 			= new coinbase.Client({'apiKey': process.env.COINBASE_API_KEY, 'apiSecret': process.env.COINBASE_API_SECRET});
		var myETHAccount 	= client.getAccount(process.env.ETH_ACCOUNT_ID, function(err, account) {

			//console.log(account);

			var args = {
				"amount"	: sell_coin_result.number_of_coins_to_buy,  //"0.001",
				"currency" 	: "ETH"
			};
			account.buy(args, function(err, xfer) {
				//console.log('selling done');
				
				// store response in DB
				newliveDataRecordETH.transaction.api_response_err 	= err;
				newliveDataRecordETH.transaction.api_response_xfer 	= xfer;

				finalStepSaveAndExit();
			});

		});
	} else {
		finalStepSaveAndExit();
	}




}



function finalStepSaveAndExit() {

	newliveDataRecordETH.totals.current_value_of_coins_owned 	= (newliveDataRecordETH.totals.total_coins_owned * newliveDataRecordETH.latest_sell_price)
	newliveDataRecordETH.totals.current_position 				= (newliveDataRecordETH.totals.current_value_of_coins_owned + newliveDataRecordETH.totals.total_coins_sold_value - newliveDataRecordETH.totals.total_spent)

	newliveDataRecordETH.save(function (err) {
		if (err) {
			console.log(err);
		}
		console.log('saved new liveDataModelETH');
		//process.exit();
	})

}









/*
set heroku scheduler to run this every 10 minutes


--- 
connect to db - -DONE
get price data from DB -- DONE
get latest live info from db (btc-live-result)
decide buy or sell
do real buy or do real sell
update db with details (new record)

	-include transaciton details and totals

	live result contains: {
		-datetime updated
		-sellbuy price datetime?
		-this - sell price
		-this - buy price
		-total - num coins currently owned (start at 0)
		-total - num coins sold 
		-total - money invested
		-total - money from sales
		-total - cash reserve 
		-this-transaction {
			- action taken - (buy_sell_or_nothing)
			 - num_coins bought
			 - buy price (is above buy eh)
			 - coins sold 
			- total result of this sale}
		}

exit()




also-

- create live_result.js - that shows db entires, in reverse chronilogical


- Split simulation obj into simulation / tools / reporting


*/