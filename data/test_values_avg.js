module.exports = {
	
	// ORIG (COINBASE)
	// low_values 					: genValues(0.125, 0.165, 0.005, 3),
	// high_values 				: genValues(0.160, 0.210, 0.005, 3),
	// period_offset_combos 		: genCombos(16, 21, 0.5, 1),
	
	// GDAX
	low_values 					: genValues(0.135, 0.175, 0.005, 3),
	high_values 				: genValues(0.175, 0.220, 0.005, 3), 
	period_offset_combos 		: genCombos(14, 21, 0.5, 1) 
}

//**still maybe not getting all values in loo?? test this */



function genValues(min, max, inc, prec) {
	var arr = []
	for (i=min; i<=max; i+=inc) {
		// getting weird things in push AND in loop rules. need to do this to i
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
	//return [{period: 2, offset: 15.5}]
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