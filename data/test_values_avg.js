module.exports = {

	// currently --- 
	// lowest and highest values (plus inc) for all values
	// and 4 hr / 1.5% incremeents

	low_values : {
		'30_days' 	: genValues(0.025, 0.375, 0.015, 3),
		'60_days' 	: genValues(0.025, 0.375, 0.015, 3),
		'90_days' 	: genValues(0.025, 0.375, 0.015, 3),
		'120_days' 	: genValues(0.025, 0.375, 0.015, 3),
		'150_days' 	: genValues(0.025, 0.375, 0.015, 3),
		'180_days' 	: genValues(0.025, 0.375, 0.015, 3),
	},
	high_values : { 
		'30_days' 	: genValues(0.000, 0.225, 0.015, 3),
		'60_days' 	: genValues(0.000, 0.225, 0.015, 3),
		'90_days' 	: genValues(0.000, 0.225, 0.015, 3),
		'120_days' 	: genValues(0.000, 0.225, 0.015, 3),
		'150_days' 	: genValues(0.000, 0.225, 0.015, 3),
		'180_days' 	: genValues(0.000, 0.225, 0.015, 3),
	},
	period_offset : {
		'30_days' 	: genCombos(30, 286, 4, 1),
		'60_days' 	: genCombos(30, 286, 4, 1),
		'90_days' 	: genCombos(30, 286, 4, 1),
		'120_days' 	: genCombos(30, 286, 4, 1),
		'150_days' 	: genCombos(30, 286, 4, 1),
		'180_days' 	: genCombos(30, 286, 4, 1),
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
	var inc = 4;  //  maybe better at 4?
	var buffer = 2; // usually use 2 "period=1" is always bad..?
	sums.forEach(function(sum) {
		for (i=buffer; i<=(sum-buffer); i+=inc) {
			res.push({period: i, offset: (sum-i)})
		}
	})
	return res;
}