module.exports = {

	// super wide jsut for some fun - dont usually need - looks amazing in browser
	// low_values 	: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20, 0.21, 0.22, 0.23, 0.24, 0.25],
	// high_values : [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20, 0.21, 0.22, 0.23, 0.24, 0.25],

	// TEST A - WIDE
	low_values 	: [0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18],
	high_values : [0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18],


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
		return [
			// {period: 7, offset: 13.5},
		 	// {period: 7, offset: 14},
			 {period: 9, offset: 12},    //<--- best value is in here! $1355
			// {period: 6, offset: 13},
			// {period: 8, offset: 11.5},
			// {period: 9, offset: 11.5},
			// {period: 4, offset: 17}
		];
		
		var res = [];
		var set = [18.5, 19, 19.5, 20, 20.5, 21, 21.5]	// [19, 19.5, 20, 20.5, 21], [19, 20, 21], [21]
		var inc = 1; 									// 3, 2, 1, 0.5, 0.75
		set.forEach(function(sum) {
			for (i=inc; i<=sum; i+=inc) {
				res.push({period: i, offset: (sum-i)})
			}
		})
		return res;
	}
}