module.exports = {
	
	// all +/- 3 units from last sim vars

	// genValues(0.000, 0.250, 0.010, 3),
	low_values : {
		'15_days' 	: genValues(0.000, 0.035, 0.005, 3), 
		'30_days' 	: genValues(0.045, 0.090, 0.005, 3), 
		'45_days' 	: genValues(0.075, 0.115, 0.005, 3),  
		'60_days' 	: genValues(0.115, 0.145, 0.010, 3),          
		'75_days' 	: genValues(0.075, 0.135, 0.005, 3), 
		'90_days' 	: genValues(0.105, 0.135, 0.005, 3),      
		'105_days' 	: genValues(0.060, 0.110, 0.010, 3),
		'120_days' 	: genValues(0.070, 0.115, 0.005, 3), 
		'135_days' 	: genValues(0.040, 0.100, 0.005, 3),
		'150_days' 	: genValues(0.070, 0.105, 0.005, 3),   
		'165_days' 	: genValues(0.005, 0.080, 0.005, 3),
		'180_days' 	: genValues(0.000, 0.040, 0.005, 3),
		// '270_days' 	: genValues(0.000, 0.025, 0.005, 3),   
		// '360_days' 	: genValues(0.010, 0.035, 0.005, 3)  
	},
	high_values : { 
		'15_days' 	: genValues(0.000, 0.020, 0.005, 3),  
		'30_days' 	: genValues(0.000, 0.020, 0.005, 3),  
		'45_days' 	: genValues(0.030, 0.070, 0.005, 3),  
		'60_days' 	: genValues(0.000, 0.025, 0.010, 3),  
		'75_days' 	: genValues(0.000, 0.020, 0.005, 3),  
		'90_days' 	: genValues(0.000, 0.020, 0.005, 3),  
		'105_days' 	: genValues(0.015, 0.055, 0.010, 3), 
		'120_days' 	: genValues(0.055, 0.105, 0.005, 3),  
		'135_days' 	: genValues(0.060, 0.105, 0.005, 3),  
		'150_days' 	: genValues(0.055, 0.090, 0.005, 3),  
		'165_days' 	: genValues(0.000, 0.055, 0.005, 3),  
		'180_days' 	: genValues(0.000, 0.020, 0.005, 3),   
		// '270_days' 	: genValues(0.130, 0.160, 0.005, 3),   
		// '360_days' 	: genValues(0.165, 0.225, 0.005, 3)  
	},
	// genCombos(2, 24, 1, 1),
	period_offset : {
		'15_days' 	: genCombos(1, 8.5, 0.5, 1),
		'30_days' 	: genCombos(1, 5, 0.5, 1),
		'45_days' 	: genCombos(16.5, 24, 0.5, 1),
		'60_days' 	: genCombos(31.5, 36.5, 1, 1),
		'75_days' 	: genCombos(36, 41, 0.5, 1),
		'90_days' 	: genCombos(37, 42, 0.5, 1),
		'105_days' 	: genCombos(18.5, 26.5, 1, 1),
		'120_days' 	: genCombos(13, 22, 0.5, 1),
		'135_days' 	: genCombos(9.5, 18.5, 1, 1),
		'150_days' 	: genCombos(7.5, 11.5, 1, 1),
		'165_days' 	: genCombos(0.5, 8, 0.5, 1),
		'180_days' 	: genCombos(0.5, 4.5, 0.5, 1),
		// '270_days' 	: genCombos(3, 4.5, 0.5, 1),
		// '360_days' 	: genCombos(1.5, 3.5, 0.5, 1) 
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