module.exports = {

	// super wide jsut for some fun - dont usually need - looks amazing in browser
	// low_values 	: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20, 0.21, 0.22, 0.23, 0.24, 0.25],
	// high_values : [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20, 0.21, 0.22, 0.23, 0.24, 0.25],

	//[0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20, 0.21, 0.22, 0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.30, 0.31, 0.32, 0.33, 0.34, 0.35, 0.36, 0.37, 0.38, 0.39, 0.40, 0.41, 0.42, 0.43, 0.44, 0.45],

	// TEST A - WIDE
	low_values 	: [0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20],
	high_values : [0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20],


	/**
	 * TEST A - FIND BEST SUM
	 * 
	 * this genereates full set of period/offset combos sums from 1->limit (e.g. 1/19, 2/8, 3/17 .... 20/0)
	 * 
	 * e.g.
	 * 19:
	 *   {period: 1, offset: 18},
	 *   {period: 2, offset: 17}, 
	 *   {period: 3, offset: 16},
	 *   {period: 4, offset: 15},
	 *   ...
	 */ 

	/**
	 * for test b= set array to just one, then change inc to 0.5
	 * 
	 * eg
	 *   {period: 0.5, offset: 20.5},
	 *   {period: 1, offset: 20},
	 *   {period: 1.5, offset: 19.5},
	 *   {period: 2, offset: 19},
	 *   {period: 2.5, offset: 18.5},
	 * ......
	 */
	period_offset_combos: function() {
		//return [
			// {period: 7, offset: 13.5},
		 	// {period: 7, offset: 14},
			// {period: 9, offset: 12},    
			// {period: 6, offset: 13},
			// {period: 8, offset: 11.5},
			// {period: 9, offset: 11.5},
			// {period: 4, offset: 17} 
		//];
	

		// full sum test
		//[1,2,3,4,5,6,7,8,9,10,11,12,13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];

		var res = [];
		var set = [14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22]	// add halves for more precise  *this can be smalelr - lets run test and see best values!
		var inc = 1; 																					// make smaller for more fine grained tests (3, 2, 1, 0.5, 0.75...)
		var buffer = 4;
		set.forEach(function(sum) {
			for (i=buffer; i<=(sum-buffer); i+=inc) {
				res.push({period: i, offset: (sum-i)})
			}
		})
		return res;
	}
}