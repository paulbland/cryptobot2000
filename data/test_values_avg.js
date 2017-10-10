module.exports = {
	
	// EVERYTHING FROM SIM VARs +/- 3 units (0.5 or 0.005) - update both every day!
	// ***new method:
	// max since aug 16 (since turned off crash)  +/- 1 unit 
	low_values : {
		'30_days' 	: genValues(0.050, 0.180, 0.01, 3),  // was 0.005
		'45_days' 	: genValues(0.040, 0.190, 0.01, 3),  //   "
		'60_days' 	: genValues(0.120, 0.190, 0.01, 3), 
		'75_days' 	: genValues(0.130, 0.190, 0.01, 3), 
		'90_days' 	: genValues(0.120, 0.200, 0.01, 3)  
	},
	high_values : {
		'30_days' 	: genValues(0.090, 0.290, 0.01, 3),  // was 0.005 
		'45_days' 	: genValues(0.090, 0.290, 0.01, 3),  //   "
		'60_days' 	: genValues(0.180, 0.300, 0.01, 3),  
		'75_days' 	: genValues(0.180, 0.270, 0.01, 3),  
		'90_days' 	: genValues(0.180, 0.270, 0.01, 3)   
	},
	period_offset : {
		'30_days' 	: genCombos(17, 25, 1, 1), // was 0.5
		'45_days' 	: genCombos(12, 26, 1, 1), //   "
		'60_days' 	: genCombos(14, 22, 1, 1), 
		'75_days' 	: genCombos(15, 21, 1, 1), 	 
		'90_days' 	: genCombos(8, 20, 1, 1)   
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