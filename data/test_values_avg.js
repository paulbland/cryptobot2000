module.exports = {
	
	// genValues(0.000, 0.250, 0.010, 3),
	low_values : {
		'15_days' 	: genValues(0.010, 0.100, 0.005, 3), 
		'30_days' 	: genValues(0.010, 0.100, 0.005, 3), 
		'45_days' 	: genValues(0.010, 0.100, 0.005, 3), 
		'60_days' 	: genValues(0.110, 0.130, 0.005, 3), 
		'75_days' 	: genValues(0.110, 0.130, 0.005, 3), 
		'90_days' 	: genValues(0.100, 0.120, 0.005, 3), 
		'120_days' 	: genValues(0.050, 0.150, 0.010, 3), 
		'180_days' 	: genValues(0.010, 0.050, 0.005, 3), 
		'270_days' 	: genValues(0.010, 0.050, 0.005, 3),   
		'360_days' 	: genValues(0.000, 0.040, 0.005, 3)  
	},
	high_values : { 
		'15_days' 	: genValues(0.010, 0.050, 0.005, 3),  
		'30_days' 	: genValues(0.010, 0.050, 0.005, 3),  
		'45_days' 	: genValues(0.010, 0.050, 0.005, 3),  
		'60_days' 	: genValues(0.010, 0.040, 0.005, 3),  
		'75_days' 	: genValues(0.010, 0.040, 0.005, 3),  
		'90_days' 	: genValues(0.025, 0.050, 0.005, 3),  
		'120_days' 	: genValues(0.050, 0.120, 0.010, 3),  
		'180_days' 	: genValues(0.000, 0.050, 0.010, 3),   
		'270_days' 	: genValues(0.140, 0.170, 0.005, 3),   
		'360_days' 	: genValues(0.180, 0.250, 0.010, 3)  
	},
	// genCombos(2, 24, 1, 1),
	period_offset : {
		'15_days' 	: genCombos(2, 20, 1, 1),  	
		'30_days' 	: genCombos(2, 20, 1, 1),  	
		'45_days' 	: genCombos(2, 20, 1, 1),  	
		'60_days' 	: genCombos(38, 42, 0.5, 1),  	
		'75_days' 	: genCombos(38, 42, 0.5, 1),  	
		'90_days' 	: genCombos(32, 38, 0.5, 1),   	
		'120_days' 	: genCombos(16, 24, 1, 1),  	 
		'180_days' 	: genCombos(2, 8, 0.5, 1),   
		'270_days' 	: genCombos(2, 8, 0.5, 1),	  
		'360_days' 	: genCombos(2, 6, 0.5, 1)    
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