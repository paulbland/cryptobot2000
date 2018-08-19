module.exports = {
	
	// 			period	offset	(sum)	low		high	value
	// 15 --- 	1		25		(26)	0.130	0.000	$198.86		- running 
	// 30 --- 	1		25		(26)	0.130	0.000	$197.97
	// 45 --- 	1		25		(26)	0.130	0.000	$314.08
	// 60 --- 	1		25		(26)	0.130	0.030	$389.79
	// 75 --- 	10		24		(34)	0.130 	0.010	$481.75
	// 90 --- 	3		37		(40)	0.120	0.000	$615.75
	// 105---	5		35		(40)	0.120	0.000	$880.57
	// 120---	5		35		(40)	0.120	0.000	$978.89	
	// 135---	2		10		(12)	0.060	0.080	$1016.07
	// 150---	1		37		(38)	0.180	0.240	$1141.05	
	// 165---	6		38		(44)	0.160	0.000	$1184.95
	// 180---	6		38		(44)	0.160	0.000	$1184.95

	// all +/- 3 units from last sim vars1

	// 15->105
	// genValues(0.000, 0.250, 0.010, 3), 
	// 120-> 
	// genValues(0.000, 0.250, 0.020, 3), 
	low_values : {
		'15_days' 	: genValues(0.000, 0.250, 0.010, 3),  // genValues(0.115, 0.145, 0.005, 3), 
		'30_days' 	: genValues(0.115, 0.145, 0.005, 3), 
		'45_days' 	: genValues(0.115, 0.145, 0.005, 3), 
		'60_days' 	: genValues(0.115, 0.145, 0.005, 3), 
		'75_days' 	: genValues(0.115, 0.145, 0.005, 3), 
		'90_days' 	: genValues(0.105, 0.135, 0.005, 3), 
		'105_days' 	: genValues(0.105, 0.135, 0.005, 3), 
		'120_days' 	: genValues(0.105, 0.135, 0.005, 3), 
		'135_days' 	: genValues(0.045, 0.075, 0.005, 3), 
		'150_days' 	: genValues(0.165, 0.195, 0.005, 3), 
		'165_days' 	: genValues(0.145, 0.175, 0.005, 3), 
		'180_days' 	: genValues(0.145, 0.175, 0.005, 3), 
	},
	high_values : { 
		'15_days' 	: genValues(0.000, 0.250, 0.010, 3),  // genValues(0.000, 0.015, 0.005, 3),
		'30_days' 	: genValues(0.000, 0.015, 0.005, 3), 
		'45_days' 	: genValues(0.000, 0.015, 0.005, 3), 
		'60_days' 	: genValues(0.015, 0.045, 0.005, 3), 
		'75_days' 	: genValues(0.000, 0.025, 0.005, 3), 
		'90_days' 	: genValues(0.000, 0.015, 0.005, 3), 
		'105_days' 	: genValues(0.000, 0.015, 0.005, 3), 
		'120_days' 	: genValues(0.000, 0.015, 0.005, 3), 
		'135_days' 	: genValues(0.065, 0.095, 0.005, 3), 
		'150_days' 	: genValues(0.225, 0.255, 0.005, 3), 
		'165_days' 	: genValues(0.000, 0.015, 0.005, 3), 
		'180_days' 	: genValues(0.000, 0.015, 0.005, 3), 
	},
	// 15->
	// genCombos(2, 48, 2, 1), 
	period_offset : {
		'15_days' 	: genCombos(2, 48, 2, 1),  // genCombos(23, 29, 1, 1), 
		'30_days' 	: genCombos(23, 29, 1, 1), 
		'45_days' 	: genCombos(23, 29, 1, 1), 
		'60_days' 	: genCombos(23, 29, 1, 1), 
		'75_days' 	: genCombos(31, 37, 1, 1), 
		'90_days' 	: genCombos(37, 43, 1, 1), 
		'105_days' 	: genCombos(37, 43, 1, 1), 
		'120_days' 	: genCombos(37, 43, 1, 1), 
		'135_days' 	: genCombos(9, 15, 1, 1),  
		'150_days' 	: genCombos(35, 41, 1, 1), 
		'165_days' 	: genCombos(41, 47, 1, 1), 
		'180_days' 	: genCombos(41, 47, 1, 1), 
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