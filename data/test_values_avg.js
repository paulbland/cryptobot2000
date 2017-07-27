module.exports = {
	
	// EVERYTHING FROM SIM VARs +/- 1 units (0.5 or 0.005) 
	// this is currently 40.3k/174m (5 min for 30 days)
	low_values 				: genValues(0.100, 0.175, 0.005, 3),
	high_values 			: genValues(0.170, 0.225, 0.005, 3), 
	period_offset_combos	: genCombos(14, 20.5, 0.5, 1)
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