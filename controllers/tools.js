module.exports  = {

	createRandomData: function() {

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
	},



	calculateAverage: function(data_to_be_tested) {
		var sum = 0;

		for (j=0; j < data_to_be_tested.length; j++) {
			sum += ((data_to_be_tested[j].value_buy + data_to_be_tested[j].value_sell) / 2);
		}
		return (sum/data_to_be_tested.length).toFixed(2); // orig was 24 hrs 'avg_for_24_hrs'
	},



	// return highest sell price
	// *****IT IS USING BUY PRICE! which should it be?
	calculateHigh: function(data_to_be_tested) {
		var highest = 0

		for (j=0; j < data_to_be_tested.length; j++) {
			highest = (data_to_be_tested[j].value_buy > highest) ? data_to_be_tested[j].value_buy : highest;
		}

		return highest;
	}, 


	calculateLow: function(data_to_be_tested) {
		// return lowest buy price

		var lowest = data_to_be_tested[0].value_sell;

		for (j=0; j < data_to_be_tested.length; j++) {
			lowest = (data_to_be_tested[j].value_sell < lowest) ? data_to_be_tested[j].value_sell : lowest;
		}

		return lowest;
	}

}