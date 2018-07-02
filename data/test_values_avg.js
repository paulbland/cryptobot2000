module.exports = {
	
	// EVERYTHING FROM SIM VARs +/- 3 units (0.5 or 0.005) - update both every day!
	// ***new method:
	// max since aug 16 (since turned off crash)  +/- 1 unit 
	// precision was originally 0.005 / 0.5
	low_values : {
		'30_days' 	: genValues(0.090, 0.150, 0.005, 3), // done					// 0:32  x2
		'60_days' 	: genValues(0.000, 0.120, 0.020, 3), // done (best = 110)		// 0:23  x2
		'90_days' 	: genValues(0.020, 0.050, 0.005, 3), // done					// 0:26 x2
		'180_days' 	: genValues(0.150, 0.250, 0.025, 3), // done (best = 225)		// 0:29 x2
		'270_days' 	: genValues(0.000, 0.090, 0.015, 3), // done (best = 0)			// 0:28 x2 
		'360_days' 	: genValues(0.050, 0.150, 0.025, 3)  // done (best = 150)		// 0:27 x2
	},
	high_values : {
		'30_days' 	: genValues(0.005, 0.040, 0.005, 3),  // done
		'60_days' 	: genValues(0.000, 0.050, 0.010, 3),  // done (best = 40) 
		'90_days' 	: genValues(0.030, 0.100, 0.005, 3),  // done
		'180_days' 	: genValues(0.000, 0.125, 0.025, 3),  // done (best = 50)
		'270_days' 	: genValues(0.150, 0.285, 0.015, 3),  // done (best = 200)
		'360_days' 	: genValues(0.200, 0.300, 0.025, 3)   // done (best = 250)
	},
	period_offset : {
		'30_days' 	: genCombos(12, 36, 0.5, 1),  // done
		'60_days' 	: genCombos(28, 42, 0.5, 1),  // done (best = 36) 
		'90_days' 	: genCombos(2, 18, 0.5, 1),   // done
		'180_days' 	: genCombos(14, 28, 0.5, 1), 	// done (best = 16)
		'270_days' 	: genCombos(6, 14, 0.5, 1),	// done (best = 14)
		'360_days' 	: genCombos(8, 20, 0.5, 1)   	// done (best = 8)
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