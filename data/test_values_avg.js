module.exports = {
	
	// WIDE (~16 mins for 30 days)
	// low_values 			: genValues(0.125, 0.210, 0.005, 3),
	// high_values 			: genValues(0.100, 0.220, 0.005, 3), 
	// period_offset_combos	: genCombos(15, 24, 0.5, 1),

	// EVERYTHING FROM JUST TOP 20 (FROM TESTS ABOVE) (+ 1 unit (0.5 or 0.005) either side)
	low_values 				: genValues(0.120, 0.175, 0.005, 3),
	high_values 			: genValues(0.160, 0.235, 0.005, 3), 
	period_offset_combos	: genCombos(15.5, 20, 0.5, 1)

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