module.exports = {
	
	low_values : {
		'30_days' 	: genValues(0.080, 0.130, 0.005, 3), // // 0:48
		'60_days' 	: genValues(0.115, 0.130, 0.005, 3), // // 0:13   
		'90_days' 	: genValues(0.020, 0.045, 0.005, 3), // // 0:02  
		'120_days' 	: genValues(0.115, 0.135, 0.005, 3), // // 0:06 
		'180_days' 	: genValues(0.205, 0.230, 0.005, 3), // // 0:35
		'270_days' 	: genValues(0.025, 0.055, 0.005, 3), // // 0:47 
		'360_days' 	: genValues(0.135, 0.160, 0.005, 3)  // // 0:51
	},
	high_values : { 
		'30_days' 	: genValues(0.015, 0.045, 0.005, 3),  // 
		'60_days' 	: genValues(0.005, 0.050, 0.005, 3),  // 
		'90_days' 	: genValues(0.025, 0.045, 0.005, 3),  // 
		'120_days' 	: genValues(0.095, 0.110, 0.005, 3),  // 
		'180_days' 	: genValues(0.040, 0.070, 0.005, 3),  // 
		'270_days' 	: genValues(0.250, 0.270, 0.005, 3),  // 
		'360_days' 	: genValues(0.240, 0.270, 0.005, 3)   // 
	},
	period_offset : {
		'30_days' 	: genCombos(17.5, 36.5, 0.5, 1),  	// 
		'60_days' 	: genCombos(35, 39.5, 0.5, 1),  	//  
		'90_days' 	: genCombos(4, 6.5, 0.5, 1),   	// 
		'120_days' 	: genCombos(28.5, 30, 0.5, 1),  	//  
		'180_days' 	: genCombos(15, 16.5, 0.5, 1), 	//  
		'270_days' 	: genCombos(8.5, 10, 0.5, 1),		//  
		'360_days' 	: genCombos(9, 11, 0.5, 1)   	// 
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