module.exports = {
	
	// 			period	offset	(sum)	low		high	value
	// 15 --- 	1		25		(26)	0.130	0.000	$198.86 
	// 30 --- 	1		25		(26)	0.130	0.000	$197.97
	// 45 --- 	1		25		(26)	0.130	0.000	$314.08
	// 60 --- 	1		25		(26)	0.130	0.030	$389.79
	// 75 --- 	10		24		(34)	0.130 	0.010	$481.75
	// 90 --- 	3		37		(40)	0.120	0.000	$615.75
	// 105---	5		35		(40)	0.120	0.000	$880.57
	// 120---	5		35		(40)	0.120	0.000	$978.89	
	// 135---	5		35		(40)	0.120	0.000	$978.89	
	// 150---	1		37		(38)	0.180	0.240	$1141.05	
	// 165---	6		38		(44)	0.160	0.000	$1184.95
	// 180---	6		38		(44)	0.160	0.000	$1184.95

	low_values : {
		'15_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'30_days' 	: genValues(0.000, 0.250, 0.025, 3),   
		'45_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'60_days' 	: genValues(0.000, 0.250, 0.025, 3),
		'75_days' 	: genValues(0.000, 0.250, 0.025, 3),
		'90_days' 	: genValues(0.000, 0.250, 0.025, 3),
		'105_days' 	: genValues(0.000, 0.250, 0.025, 3),
		'120_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'135_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'150_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'165_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'180_days' 	: genValues(0.000, 0.250, 0.025, 3), 
	},
	high_values : { 
		'15_days' 	: genValues(0.000, 0.250, 0.025, 3),
		'30_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'45_days' 	: genValues(0.000, 0.250, 0.025, 3),
		'60_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'75_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'90_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'105_days' 	: genValues(0.000, 0.250, 0.025, 3),
		'120_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'135_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'150_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'165_days' 	: genValues(0.000, 0.250, 0.025, 3), 
		'180_days' 	: genValues(0.000, 0.250, 0.025, 3), 
	},
	period_offset : {
		'15_days' 	: genCombos(12, 72, 2, 1), 
		'30_days' 	: genCombos(12, 72, 2, 1), 
		'45_days' 	: genCombos(12, 72, 2, 1),  
		'60_days' 	: genCombos(12, 72, 2, 1), 
		'75_days' 	: genCombos(12, 72, 2, 1), 
		'90_days' 	: genCombos(12, 72, 2, 1), 
		'105_days' 	: genCombos(12, 72, 2, 1), 
		'120_days' 	: genCombos(12, 72, 2, 1), 
		'135_days' 	: genCombos(12, 72, 2, 1), 
		'150_days' 	: genCombos(12, 72, 2, 1), 
		'165_days' 	: genCombos(12, 72, 2, 1), 
		'180_days' 	: genCombos(12, 72, 2, 1),   
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