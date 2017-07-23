module.exports = {
	
	// COINBASE
	// low_values 			: genValues(0.125, 0.160, 0.005, 3),
	// high_values 			: genValues(0.160, 0.210, 0.005, 3),
	// period_offset_combos : genCombos(16, 21.5, 0.5, 1),

	// COINBASE / CRASH 
	// low_values 			: genValues(0.140, 0.200, 0.005, 3),
	// high_values 			: genValues(0.140, 0.200, 0.005, 3),
	// period_offset_combos : genCombos(16, 24, 0.5, 1),
	
	// GDAX
	// low_values 			: genValues(0.135, 0.170, 0.005, 3),
	// high_values 			: genValues(0.170, 0.220, 0.005, 3), 
	// period_offset_combos	: genCombos(15, 21, 0.5, 1),

	// GDAX / CRASH
	// low_values 			: genValues(0.140, 0.210, 0.005, 3),
	// high_values 			: genValues(0.100, 0.210, 0.005, 3), 
	// period_offset_combos	: genCombos(18, 23, 0.5, 1),

	// EVERYTHING FROM 4 ABOVE!! (18 mins) 
	// Running 156.2k tests (673m loops). Should be about 0:18:55.
	low_values 				: genValues(0.125, 0.210, 0.005, 3),
	high_values 			: genValues(0.100, 0.220, 0.005, 3), 
	period_offset_combos	: genCombos(15, 24, 0.5, 1)

	// then maybe -- everything that gets in to top ten?? for all 4 of them (reduced set.. just to see)

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