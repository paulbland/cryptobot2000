var mongoose 			= require('mongoose');
var coinbase 			= require('coinbase');
var tools 				= require('../controllers/tools')
var reporting 			= require('../controllers/reporting')
var liveDataModels 		= require('../models/livedatamodel')
var priceRecordModels 	= require('../models/pricerecordmodel')
var simVarsModelETH 	= require('../models/simvarsmodel')

// prep new item to be appended to live data recrod
mongoose.Promise = global.Promise;
var newLiveData; // visible globally

module.exports = {

	really_buy_and_sell : false, // THIS IS IT!!!
	initial_investment  : parseFloat((2000/6).toFixed(2)),//2000, // 6 bots!
	bot_name 			: null,
	period 				: 0,
	offset 				: 0,
	low_threshold 		: 0,
	high_threshold 		: 0,
	running 			: false,

	run: function(bot_name) {
		// prevention so we cant run two bots at once. 
		if (this.running) {
			console.log(`Can't start ${bot_name}. live-bot (${this.bot_name}) already running. Exiting.`);
			return false;
		}
		this.running 	= true;
		this.bot_name 	= bot_name;
		this.dbConnect();
	},

	dbConnect: function() {
		var self    = this;
        var promise = mongoose.connect(process.env.MONGODB_URI_NEW, {
			useMongoClient: true
		});

        promise.then(function(db) {
			console.log(`live-bot (${self.bot_name}): Starting. (database: ${db.db.s.databaseName})`)
            self.getSimVars()
            /* Use `db`, for instance `db.model()` */
         });
	},
		
	getSimVars: function() {
		var self = this;

		// get latest sim vars (1 item)
		simVarsModelETH.find({}).sort('-datetime').limit(1).exec(function(error, sim_vars_eth) {
			if (error) {
				console.log(error);
				process.exit(1);
			}
			else {
				self.period 		= sim_vars_eth[0][self.bot_name].period;
				self.offset 		= sim_vars_eth[0][self.bot_name].offset;
				self.low_threshold 	= sim_vars_eth[0][self.bot_name].low;
				self.high_threshold = sim_vars_eth[0][self.bot_name].high;
				self.step1();
			}
		});
	},

	step1: function() {
		var self = this;
		priceRecordModels['ETH'].find({}, function(error, price_data_eth) {
			if (error) {
				res.json(error);
				console.log('live-bot: Error connecting to db (model: priceRecordModels)');
				process.exit(1);
			}
			else {
				//console.log('Got priceRecordModels - ETH data');
				self.step2(price_data_eth);
			}
		});
	},


	step2: function(price_data_eth) {
		var self = this;
		// get latest 
		liveDataModels['ETH'].findOne({bot_name:self.bot_name}).sort('-datetime_updated').exec(function(error, lastLiveData) {
			if (error) {
				res.json(error);
				console.log('live-bot: Error connecting to db (model: liveDataModels)');
				process.exit(1);
			}
			else {
				//console.log('Got liveDataModelETH data');
				// if first time, created empty set
				if (!lastLiveData) {
					lastLiveData = {
						totals: {
							total_coins_owned 		: 0,
							total_coins_sold_value 	: 0,
							total_sell_transactions : 0,
							total_buy_transactions  : 0,
							total_spent             : 0,
							current_value_of_coins_owned : 0,
							current_position        : 0,
							money_in_bank 	        : self.initial_investment
						},
						latest_sell_price      	 	: 0, 
						latest_buy_price        	: 0,
						transaction: {
							action : ''
						}
					}
				}
				//console.log('- lastLiveData ' + lastLiveData)
				self.step3(price_data_eth, lastLiveData)
			}
		});
	},



	step3: function(price_data, lastLiveData) {
		//console.log('starting step 3...');

		// hard code some vars for live
		var buy_sell_method		= 'avg';
		var print_full_debug 	= false;
		var interval_in_minutes = 10;
		var sell_all			= true; 
		var buy_sell_percentage	= 7.5;
		var reinvest_profit     = false;
		var buy_sell_unit		= parseFloat((this.initial_investment * (buy_sell_percentage / 100)).toFixed(2)); // calculate

		var values_per_period 	= tools.calculateValuesForGivenPeriod(this.period, interval_in_minutes)			
		var values_in_offset	= tools.calculateValuesForGivenPeriod(this.offset, interval_in_minutes)	
		var from_index 			= (price_data.length - (values_per_period + values_in_offset))		// start index, minus offset and period length
		var to_index 			= (price_data.length - values_in_offset)							// last period index (same without period length)
		var data_to_be_tested 	= price_data.slice((from_index - 1), (to_index - 1));				// get slice. take one since index starts from 0
		var this_index 			= (price_data.length - 1);											// always last value
		var latest_buy_price 	= price_data[this_index].value_buy;									// this will be the currect price we're evaluating
		var latest_sell_price 	= price_data[this_index].value_sell;								// this will be the currect price we're evaluating
		var avg_for_period 		= tools.calculateAverage(data_to_be_tested) 

		// decide buy or sell
		var sell_or_buy = tools.decideBuyOrSell(data_to_be_tested, latest_buy_price, latest_sell_price, this.low_threshold, this.high_threshold, buy_sell_method, print_full_debug, false)

		// TESTING OVERRIDE
		// sell_or_buy = 'sell'
		sell_or_buy = 'buy'

		// console.log('price_data.length: ' + price_data.length)
		// console.log('from_index: ' + from_index)
		// console.log('to_index: ' + to_index)
		// console.log('this_index: ' + this_index)
		// console.log('latest_buy_price: ' + latest_buy_price)
		// console.log('latest_sell_price: ' + latest_sell_price)
		// console.log('sell_or_buy: ' + sell_or_buy)

		// create new record 
		newLiveData 							= new liveDataModels['ETH'];
		newLiveData.datetime_updated 			= new Date;
		newLiveData.bot_name		 			= this.bot_name;
		newLiveData.latest_sell_price 			= latest_sell_price;
		newLiveData.latest_buy_price 			= latest_buy_price;
		newLiveData.avg_for_period 				= avg_for_period																// current iteration - set here only
		newLiveData.avg_plus_high_threshold 	= tools.calculateAvgPlusHighThreshold(avg_for_period, this.high_threshold); 	// current iteration - set here only
		newLiveData.avg_minus_low_threshold 	= tools.calculateAvgMinusLowThreshold(avg_for_period, this.low_threshold); 		// current iteration - set here only
		newLiveData.totals 						= lastLiveData.totals;			// object!! all totals  - carried over
		newLiveData.transaction = {
			action 								: sell_or_buy,
			transaction_notes					: '',							// transaction - reset
			number_of_coins_to_sell				: 0,							// transaction - reset // sell only
			result_of_this_sale					: 0,							// transaction - reset // sell only
			number_of_coins_to_buy				: 0,							// transaction - reset // buy only
			amount_spent_on_this_transaction 	: 0,							// transaction - reset // buy only
			api_response_err					: '',							// transaction - reset
			api_response_xfer					: ''							// transaction - reset
		}					
		newLiveData.program_vars = {											// wont change but lets record to make it easier to read logs
			low_threshold 						: this.low_threshold,
			high_threshold 						: this.high_threshold,
			buy_sell_percentage					: buy_sell_percentage,
			buy_sell_unit	 					: buy_sell_unit,
			period	 							: this.period,
			offset	 							: this.offset,
			reinvest_profit	 					: reinvest_profit
		} 		

		if (sell_or_buy === 'sell') {
			this.sellCoinAPI(this.high_threshold, sell_all, lastLiveData, buy_sell_unit, latest_sell_price)
		} else if (sell_or_buy === 'buy') {
			this.buyCoinAPI(lastLiveData, buy_sell_unit, latest_buy_price, reinvest_profit)
		} else {
			// Do nothing
			// returns 'do_nothing'
			//newLiveData.transaction.transaction_notes = 'not buying or selling';
			this.finalStepSaveAndExit()
		}

		// console.log('ORIGINAL DATA: ')
		// console.log('lastLiveData.datetime_updated: ' + lastLiveData.datetime_updated)
		// console.log('lastLiveData.total_coins_owned: ' + lastLiveData.total_coins_owned)
		// console.log('lastLiveData.total_coins_sold: ' + lastLiveData.total_coins_sold)

		// console.log('SAVING THIS MODEL');
		// console.log(ld);

	},



	sellCoinAPI: function(high_threshold, sell_all, lastLiveData, buy_sell_unit, latest_sell_price) {
		console.log(`live-bot (${this.bot_name}): SELLING COIN FROM API!`);

		if (lastLiveData.totals.total_coins_owned === 0) {
			//console.log('you don’t have any coins to sell!<br />')
			newLiveData.transaction.transaction_notes = 'You don’t have any coins to sell!';
			this.finalStepSaveAndExit()
			return;
		}

		var sell_coin_result = tools.sellCoin(high_threshold, false, sell_all, lastLiveData.totals.total_coins_owned, buy_sell_unit, latest_sell_price)

		// console.log("sell_coin_result");
		// console.log(sell_coin_result);

		newLiveData.transaction.number_of_coins_to_sell = sell_coin_result.number_of_coins_to_sell;
		newLiveData.transaction.result_of_this_sale 	= sell_coin_result.result_of_this_sale;
		newLiveData.transaction.transaction_notes 		= sell_coin_result.transaction_notes;
		
		newLiveData.totals.total_coins_owned 			= (lastLiveData.totals.total_coins_owned - sell_coin_result.number_of_coins_to_sell);
		newLiveData.totals.total_coins_sold_value 		= (lastLiveData.totals.total_coins_sold_value + sell_coin_result.result_of_this_sale);
		newLiveData.totals.money_in_bank 				= (lastLiveData.totals.money_in_bank + sell_coin_result.result_of_this_sale);
		
		if (sell_coin_result.number_of_coins_to_sell > 0) {
			newLiveData.totals.total_sell_transactions = (lastLiveData.totals.total_sell_transactions + 1);
		}

		if (this.really_buy_and_sell) {
			var self = this;

			// connect to coinbase and get my ETH account
			//console.log('connecting to api')
			var client 			= new coinbase.Client({'apiKey': process.env.COINBASE_API_KEY, 'apiSecret': process.env.COINBASE_API_SECRET});
			var myETHAccount 	= client.getAccount(process.env.ETH_ACCOUNT_ID, function(err, account) {

				var args = {
					amount			: sell_coin_result.number_of_coins_to_sell,  //"0.01",
					currency 		: "ETH",
					payment_method	: process.env.USD_ACCOUNT_ID
				};
				account.sell(args, function(err, xfer) {
					console.log(`live-bot (${self.bot_name}): Selling from API done`);

					// store response in DB
					newLiveData.transaction.api_response_err 	= JSON.stringify(err, null, " ");
					newLiveData.transaction.api_response_xfer 	= JSON.stringify(xfer, null, " ");

					self.finalStepSaveAndExit();
				});

			});
		} else {
			this.finalStepSaveAndExit();
		}
	},


	buyCoinAPI: function(lastLiveData, buy_sell_unit, latest_buy_price, total_spent, total_sold, reinvest_profit) {
		console.log(`live-bot (${this.bot_name}): BUYING COIN FROM API!`);

		var buy_coin_result = tools.buyCoin(lastLiveData.totals.total_coins_owned, buy_sell_unit, latest_buy_price, false, 
				lastLiveData.totals.total_spent, lastLiveData.totals.total_coins_sold_value, lastLiveData.totals.money_in_bank, reinvest_profit)

		// console.log("buy_coin_result");
		// console.log(buy_coin_result);

		newLiveData.totals.total_coins_owned 						= (lastLiveData.totals.total_coins_owned + buy_coin_result.number_of_coins_to_buy);
		newLiveData.totals.total_spent 								= (lastLiveData.totals.total_spent + buy_coin_result.amount_spent_on_this_transaction);
		newLiveData.totals.money_in_bank 							= (lastLiveData.totals.money_in_bank - buy_coin_result.amount_spent_on_this_transaction);
		
		newLiveData.transaction.transaction_notes 					= buy_coin_result.transaction_notes;
		newLiveData.transaction.number_of_coins_to_buy 				= buy_coin_result.number_of_coins_to_buy;
		newLiveData.transaction.amount_spent_on_this_transaction	= buy_coin_result.amount_spent_on_this_transaction

		if (buy_coin_result.number_of_coins_to_buy > 0) {
			newLiveData.totals.total_buy_transactions 	= (lastLiveData.totals.total_buy_transactions + 1);
		}



		if (this.really_buy_and_sell) {
			var self = this;

			// connect to coinbase and get my ETH account
			//console.log('connecting to api')
			var client = new coinbase.Client({'apiKey': process.env.COINBASE_API_KEY, 'apiSecret': process.env.COINBASE_API_SECRET});

			// THIS FOR ETH WALLET ID ONLY
			// 		client.getAccounts({}, function(err, accounts) {
			//  	 console.log(accounts);
			// });

			// FOR THIS USE PAYMETN METHOD ONLY
			// client.getPaymentMethods({}, function(err, pms) {
			//   console.log(pms);
			// });

			// hit up the API
			var myETHAccount = client.getAccount(process.env.ETH_ACCOUNT_ID, function(err, account) {

				var args = {
					amount 			: buy_coin_result.number_of_coins_to_buy, //0.01
					currency 		: "ETH",
					payment_method 	: process.env.USD_ACCOUNT_ID
				};

				account.buy(args, function(err, xfer) {
					console.log(`live-bot (${self.bot_name}): Buying from API done`);

					// store response in DB
					newLiveData.transaction.api_response_err 	= JSON.stringify(err, null, " ");
					newLiveData.transaction.api_response_xfer 	= JSON.stringify(xfer, null, " ");

					self.finalStepSaveAndExit();
				});
			});
		} else {
			this.finalStepSaveAndExit();
		}
	},



	finalStepSaveAndExit: function() {
		var self = this;

		newLiveData.totals.current_value_of_coins_owned = (newLiveData.totals.total_coins_owned * newLiveData.latest_sell_price)
		newLiveData.totals.current_position 			= (newLiveData.totals.current_value_of_coins_owned + newLiveData.totals.total_coins_sold_value - newLiveData.totals.total_spent)

		newLiveData.save(function (err) {
			if (err) {
				console.log(err);
			}
			console.log(`live-bot (${self.bot_name}): Finished. (Saved newLiveData (ETH) record)`);
			self.running = false; //return true;
		})

	}
}
