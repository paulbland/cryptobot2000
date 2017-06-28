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
	}

}