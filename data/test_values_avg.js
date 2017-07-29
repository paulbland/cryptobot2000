module.exports = {
	
	// EVERYTHING FROM SIM VARs +/- 1 units (0.5 or 0.005) 
	low_values : {
		'15_days' 	: genValues(0.160, 0.165, 0.005, 3),
		'30_days' 	: genValues(0.135, 0.145, 0.005, 3),
		'45_days' 	: genValues(0.135, 0.165, 0.005, 3),
		'60_days' 	: genValues(0.145, 0.165, 0.005, 3),
		'75_days' 	: genValues(0.135, 0.165, 0.005, 3),
		'90_days' 	: genValues(0.070, 0.095, 0.005, 3)
	},
	high_values : {
		'15_days' 	: genValues(0.185, 0.230, 0.005, 3), 
		'30_days' 	: genValues(0.180, 0.200, 0.005, 3), 
		'45_days' 	: genValues(0.170, 0.200, 0.005, 3), 
		'60_days' 	: genValues(0.180, 0.200, 0.005, 3), 
		'75_days' 	: genValues(0.165, 0.205, 0.005, 3), 
		'90_days' 	: genValues(0.165, 0.235, 0.005, 3)
	},
	period_offset : {
		'15_days' 	: genCombos(14.5, 17, 0.5, 1),
		'30_days' 	: genCombos(16, 19, 0.5, 1),
		'45_days' 	: genCombos(17, 19, 0.5, 1), 
		'60_days' 	: genCombos(17, 18.5, 0.5, 1), 
		'75_days' 	: genCombos(12.5, 20, 0.5, 1),
		'90_days' 	: genCombos(12.5, 14.5, 0.5, 1)
	}
}	

function genValues(min, max, inc, prec) {
	var arr = []
	for (i=min; i<=max; i+=inc) {
		i = parseFloat(i.toFixed(prec))
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