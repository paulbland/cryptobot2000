module.exports = {
	
	// EVERYTHING FROM SIM VARs +/- 3 units (0.5 or 0.005) - update both every day!
	// ***new method:
	// max since aug 16 (since turned off crash)  +/- 1 unit 
	// precision was originally 0.005 // was 0.01
	low_values : {
		'30_days' 	: genValues(0.090, 0.150, 0.005, 3),    //done
		'45_days' 	: genValues(0.040, 0.240, 0.02, 3), 
		'60_days' 	: genValues(0.100, 0.240, 0.02, 3), 
		'75_days' 	: genValues(0.110, 0.240, 0.02, 3), 
		'90_days' 	: genValues(0.020, 0.050, 0.005, 3)  //done
	},
	high_values : {
		'30_days' 	: genValues(0.000, 0.040, 0.005, 3),    //done
		'45_days' 	: genValues(0.080, 0.340, 0.02, 3), 
		'60_days' 	: genValues(0.160, 0.420, 0.02, 3),  
		'75_days' 	: genValues(0.160, 0.380, 0.02, 3),  
		'90_days' 	: genValues(0.030, 0.100, 0.005, 3)   //done
	},
	period_offset : {
		'30_days' 	: genCombos(12, 36, 1, 1), //done
		'45_days' 	: genCombos(10, 36, 1, 1), 
		'60_days' 	: genCombos(13, 30, 1, 1), 
		'75_days' 	: genCombos(15, 32, 1, 1), 	 
		'90_days' 	: genCombos(2, 18, 1, 1)   //done
	}
}	

function genValues(min, max, inc, prec) {
	var arr = []
	for (i=min; i<=max; i+=inc, i=parseFloat(i.toFixed(prec))) {
		arr.push(i)
	}
	return arr;
}

/**
 * generates set of period/offset combos sums from buffer->(limit-buffer)
 * e.g. for 19, generates:
 *   {period: 1, offset: 18},
 *   {period: 2, offset: 17}, 
 *      ...
 *   {period: 19, offset: 0},
 */ 
function genCombos(min, max, inc, prec) {
	var sums = genValues(min, max, inc, prec);
	var res = [];
	var inc = 1; 
	var buffer = 1; // usually use 2 "period=1" is always bad..?
	sums.forEach(function(sum) {
		for (i=buffer; i<=(sum-buffer); i+=inc) {
			res.push({period: i, offset: (sum-i)})
		}
	})
	return res;
}