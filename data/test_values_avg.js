module.exports = {
	
	// ORIG
	//low_values 	: [0.125, 0.130, 0.135, 0.140, 0.145, 0.150, 0.155, 0.160, 0.165],
	//high_values : [0.160, 0.165, 0.170, 0.175, 0.180, 0.185, 0.190, 0.195, 0.200, 0.205, 0.210],

	// GDAX
	low_values 	: [0.135, 0.140, 0.145, 0.150, 0.155, 0.160, 0.165, 0.170, 0.175],
	high_values : [0.175, 0.180, 0.185, 0.190, 0.195, 0.200, 0.205, 0.210, 0.215, 0.220],

	period_offset_combos: function() {
		//return [{period: 2, offset: 15.5}];

		// ORIG
		//var sums = [16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21]						
		// GDAX
		var sums = [14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21]	
			
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
}


/**
 * generates set of period/offset combos sums from buffer->(limit-buffer)
 * e.g. for 19, generates:
 *   {period: 1, offset: 18},
 *   {period: 2, offset: 17}, 
 *      ...
 *   {period: 19, offset: 0},
 */ 


	// LOW/HIGH - WIDE
// [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20, 0.21, 0.22, 0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.30, 0.31, 0.32, 0.33, 0.34, 0.35, 0.36, 0.37, 0.38, 0.39, 0.40, 0.41, 0.42, 0.43, 0.44, 0.45],
// SUM - WIDE
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];
