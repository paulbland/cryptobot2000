module.exports = {
	
	// EVERYTHING FROM SIM VARs +/- 2 units (0.5 or 0.005) 
	low_values : {
		'15_days' 	: genValues(0.105, 0.140, 0.005, 3), 
		'30_days' 	: genValues(0.145, 0.175, 0.005, 3), 
		'45_days' 	: genValues(0.155, 0.180, 0.005, 3), 
		'60_days' 	: genValues(0.150, 0.195, 0.005, 3), 
		'75_days' 	: genValues(0.120, 0.150, 0.005, 3),
		'90_days' 	: genValues(0.075, 0.110, 0.005, 3)
	},
	high_values : {
		'15_days' 	: genValues(0.125, 0.165, 0.005, 3), 
		'30_days' 	: genValues(0.170, 0.205, 0.005, 3),  
		'45_days' 	: genValues(0.175, 0.205, 0.005, 3),  
		'60_days' 	: genValues(0.170, 0.205, 0.005, 3), 
		'75_days' 	: genValues(0.165, 0.215, 0.005, 3), 
		'90_days' 	: genValues(0.160, 0.210, 0.005, 3)
	},
	period_offset : {
		'15_days' 	: genCombos(19, 24, 0.5, 1), 
		'30_days' 	: genCombos(16, 20, 0.5, 1), 
		'45_days' 	: genCombos(17, 20, 0.5, 1),  
		'60_days' 	: genCombos(16.5, 19, 0.5, 1),  
		'75_days' 	: genCombos(8.5, 14, 0.5, 1),
		'90_days' 	: genCombos(9.5, 14.5, 0.5, 1)
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