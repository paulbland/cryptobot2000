module.exports = {
	
	low_values : {
		'30_days' 	: genValues(0.075, 0.90, 0.005, 3), 
		'60_days' 	: genValues(0.115, 0.125, 0.005, 3), 
		'90_days' 	: genValues(0.020, 0.050, 0.005, 3),
		'120_days' 	: genValues(0.120, 0.140, 0.005, 3), 
		'180_days' 	: genValues(0.205, 0.230, 0.005, 3), 
		'270_days' 	: genValues(0.040, 0.050, 0.005, 3), 
		'360_days' 	: genValues(0.130, 0.140, 0.005, 3)  
	},
	high_values : { 
		'30_days' 	: genValues(0.010, 0.030, 0.005, 3),  
		'60_days' 	: genValues(0.000, 0.040, 0.005, 3),  
		'90_days' 	: genValues(0.025, 0.050, 0.005, 3),  
		'120_days' 	: genValues(0.105, 0.120, 0.005, 3),  
		'180_days' 	: genValues(0.040, 0.070, 0.005, 3),   
		'270_days' 	: genValues(0.240, 0.270, 0.005, 3),   
		'360_days' 	: genValues(0.240, 0.280, 0.005, 3)  
	},
	period_offset : {
		'30_days' 	: genCombos(24.5, 35.5, 0.5, 1),  	
		'60_days' 	: genCombos(37.5, 40, 0.5, 1),  	
		'90_days' 	: genCombos(3, 6.5, 0.5, 1),   	
		'120_days' 	: genCombos(27.5, 30, 0.5, 1),  	 
		'180_days' 	: genCombos(15, 16.5, 0.5, 1),   
		'270_days' 	: genCombos(9, 10.5, 0.5, 1),	  
		'360_days' 	: genCombos(9, 11.5, 0.5, 1)    
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