module.exports = {
	
	// EVERYTHING FROM SIM VARs +/- 3 units (0.5 or 0.005) - update both every day!
	// ***new method:
	// max since aug 16 (last 10 days) --- +/- 1 unit (since turned off crash)
	low_values : {
		'30_days' 	: genValues(0.105, 0.145, 0.005, 3), // done
		'45_days' 	: genValues(0.150, 0.175, 0.005, 3), // done
		'60_days' 	: genValues(0.155, 0.175, 0.005, 3), // done
		'75_days' 	: genValues(0.155, 0.185, 0.005, 3), // done
		'90_days' 	: genValues(0.135, 0.200, 0.005, 3)  // done
	},
	high_values : {
		'30_days' 	: genValues(0.155, 0.270, 0.005, 3),  // done
		'45_days' 	: genValues(0.205, 0.230, 0.005, 3),  // done
		'60_days' 	: genValues(0.180, 0.230, 0.005, 3),  // done
		'75_days' 	: genValues(0.195, 0.230, 0.005, 3),  // done
		'90_days' 	: genValues(0.185, 0.225, 0.005, 3)   // done
	},
	period_offset : {
		'30_days' 	: genCombos(17.5, 22.5, 0.5, 1), // done
		'45_days' 	: genCombos(16.5, 19.5, 0.5, 1), // done
		'60_days' 	: genCombos(16.5, 19.5, 0.5, 1), // done
		'75_days' 	: genCombos(16.5, 19, 0.5, 1), 	 // done
		'90_days' 	: genCombos(9, 20, 0.5, 1)  // done
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