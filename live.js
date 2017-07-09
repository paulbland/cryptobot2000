var express 	= require('express');
var mongoose 	= require('mongoose');
var coinbase 	= require('coinbase');
var app 		= express();

var tools 		= require('./controllers/tools')
var reporting 	= require('./controllers/reporting')








// DATABASE
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// get latest live data from dd
var liveDataModelETH = require('./models/livedatamodeleth')

// prep new item to be appended to live data recrod
var newliveDataRecordETH = liveDataModelETH();


console.log('running live.js!')
step1();



function step1() {
	console.log('starting step 1...');

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
	console.log('starting step 2...');
	
	// get latest 
	liveDataModelETH.findOne({}).sort('-datetime_updated').exec(function(error, live_data_eth) {
		if (error) {
			res.json(error);
			console.log('error connecting to db');
			process.exit(1);
		}
		else {
			console.log('got liveDataModelETH data');
			console.log(live_data_eth);
			step3(price_data_eth, live_data_eth)
		}
	});


}



function step3(price_data, live_data_eth) {
	console.log('starting step 3...');

	// hard code vars for live
	var low_threshold 		= 0.16;
	var high_threshold 		= 0.17;
	var buy_sell_method		= 'avg';
	var print_full_debug 	= false;
	var hrs_in_period 		= 12
	var offset 				= 6;
	var interval_in_minutes = 10;

	var values_per_period 	= tools.calculateValuesForGivenPeriod(hrs_in_period, interval_in_minutes)			
	var values_in_offset	= tools.calculateValuesForGivenPeriod(offset, interval_in_minutes)	
	var from_index 			= (price_data.length - (values_per_period + values_in_offset))		// start index, minus offset and period length
	var to_index 			= (price_data.length - values_in_offset)							// last period index (same without period length)
	var data_to_be_tested 	= price_data.slice((from_index - 1), (to_index - 1));				// get slice. take one since index starts from 0
	var this_index 			= (price_data.length - 1);				// alwasys last value
	var latest_buy_price 	= price_data[this_index].value_buy;		// this will be the currect price we're evaluating
	var latest_sell_price 	= price_data[this_index].value_sell;	// this will be the currect price we're evaluating

	// decide buy or sell
	var sell_or_buy = tools.decideBuyOrSell(data_to_be_tested, latest_buy_price, latest_sell_price, low_threshold, high_threshold, buy_sell_method, print_full_debug)

	console.log('price_data.length: ' + price_data.length)
	console.log('from_index: ' + from_index)
	console.log('to_index: ' + to_index)
	console.log('this_index: ' + this_index)
	console.log('latest_buy_price: ' + latest_buy_price)
	console.log('latest_sell_price: ' + latest_sell_price)
	console.log('sell_or_buy: ' + sell_or_buy)


	if (sell_or_buy === 'sell') {
		sellCoinAPI()
	} else if (sell_or_buy === 'buy') {
		buyCoinAPI()
	} else {
		// Do nothing
		// returns 'do_nothing'
		console.log('not buying or selling today');
	}

	console.log('ORIGINAL DATA: ')
	console.log('live_data_eth.datetime_updated: ' + live_data_eth.datetime_updated)
	console.log('live_data_eth.total_coins_owned: ' + live_data_eth.total_coins_owned)
	console.log('live_data_eth.total_coins_sold: ' + live_data_eth.total_coins_sold)



	// create new record and save


	newliveDataRecordETH.datetime_updated 	= new Date;
	newliveDataRecordETH.total_coins_owned 	= 888;
	newliveDataRecordETH.total_coins_sold 	= 999;
	newliveDataRecordETH.latest_sell_price 	= latest_sell_price;
	newliveDataRecordETH.latest_buy_price 	= latest_buy_price;
	newliveDataRecordETH.transaction	 	= sell_or_buy;

	

	newliveDataRecordETH.save(function (err) {
		if (err) return handleError(err);
			console.log('saved liveDataModelETH');
			process.exit();
	})


}



function sellCoinAPI() {
	console.log('SELLING COING FROM API!');
}


function buyCoinAPI() {
	console.log('BUYING COING FROM API!');
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