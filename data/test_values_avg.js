module.exports = {
	
	// EVERYTHING FROM SIM VARs +/- 3 units (0.5 or 0.005) - update both every day!
	// ***new method:
	// max since aug 16 (since turned off crash)  +/- 1 unit 
	// precision was originally 0.005 / 0.5
	low_values : {
		'30_days' 	: genValues(0.085, 0.135, 0.005, 3), // // 0:48
		'60_days' 	: genValues(0.115, 0.125, 0.005, 3), // // 0:13   
		'90_days' 	: genValues(0.025, 0.045, 0.005, 3), // // 0:02  
		'120_days' 	: genValues(0.120, 0.130, 0.005, 3), // // 0:06 
		'180_days' 	: genValues(0.195, 0.230, 0.005, 3), // // 0:35
		'270_days' 	: genValues(0.025, 0.050, 0.005, 3), // // 0:47 
		'360_days' 	: genValues(0.120, 0.155, 0.005, 3)  // // 0:51
	},
	high_values : { 
		'30_days' 	: genValues(0.010, 0.045, 0.005, 3),  // 
		'60_days' 	: genValues(0.000, 0.045, 0.005, 3),  // 
		'90_days' 	: genValues(0.025, 0.050, 0.005, 3),  // 
		'120_days' 	: genValues(0.095, 0.105, 0.005, 3),  // 
		'180_days' 	: genValues(0.020, 0.080, 0.005, 3),  // 
		'270_days' 	: genValues(0.205, 0.275, 0.005, 3),  // 
		'360_days' 	: genValues(0.220, 0.305, 0.005, 3)   // 
	},
	period_offset : {
		'30_days' 	: genCombos(17.5, 36.5, 0.5, 1),  	// 
		'60_days' 	: genCombos(35.5, 40.5, 0.5, 1),  	//  
		'90_days' 	: genCombos(4.5, 8.5, 0.5, 1),   	// 
		'120_days' 	: genCombos(24.5, 30.5, 0.5, 1),  	//  
		'180_days' 	: genCombos(14.5, 17.5, 0.5, 1), 	//  
		'270_days' 	: genCombos(8.5, 13.5, 0.5, 1),		//  
		'360_days' 	: genCombos(7.5, 10.5, 0.5, 1)   	// 
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