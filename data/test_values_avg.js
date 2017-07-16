module.exports = {

	// range for wide testing 
	// low_values 	: [0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20],
	// high_values : [0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.20],


	// range for narrow testing 
	low_values 	: [0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17],
	high_values : [0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15],



	period_offset_combos: [

		/**
		 * TEST A - FIND BEST SUM
		 * (checking 19-23)
		 */ 
		// // 19 
		// {period: 1, offset: 18},
		// {period: 2, offset: 17},
		// {period: 3, offset: 16},
		// {period: 4, offset: 15},
		// {period: 5, offset: 14},
		// {period: 6, offset: 13},
		// {period: 7, offset: 12},
		// {period: 8, offset: 11},
		// {period: 9, offset: 10},
		// {period: 10, offset: 9},
		// {period: 11, offset: 8},
		// {period: 12, offset: 7},
		// {period: 13, offset: 6},
		// {period: 14, offset: 5},
		// {period: 15, offset: 4},
		// {period: 16, offset: 3},
		// {period: 17, offset: 2},
		// {period: 18, offset: 1},
		// {period: 19, offset: 0},
		// // 20 
		// {period: 1, offset: 19},
		// {period: 2, offset: 18},
		// {period: 3, offset: 17},
		// {period: 4, offset: 16},
		// {period: 5, offset: 15},
		// {period: 6, offset: 14},
		// {period: 7, offset: 13},
		// {period: 8, offset: 12},
		// {period: 9, offset: 11},
		// {period: 10, offset: 10},
		// {period: 11, offset: 9},
		// {period: 12, offset: 8},
		// {period: 13, offset: 7},
		// {period: 14, offset: 6},
		// {period: 15, offset: 5},
		// {period: 16, offset: 4},
		// {period: 17, offset: 3},
		// {period: 18, offset: 2},
		// {period: 19, offset: 1},
		// {period: 20, offset: 0},
		// // 21  
		{period: 1, offset: 20},
		{period: 2, offset: 19},
		{period: 3, offset: 18},
		{period: 4, offset: 17},
		{period: 5, offset: 16},
		{period: 6, offset: 15},
		{period: 7, offset: 14},
		{period: 8, offset: 13},
		{period: 9, offset: 12},
		{period: 10, offset: 11},
		{period: 11, offset: 10},
		{period: 12, offset: 9},
		{period: 13, offset: 8},
		{period: 14, offset: 7},
		{period: 15, offset: 6},
		{period: 16, offset: 5},
		{period: 17, offset: 4},
		{period: 18, offset: 3},
		{period: 19, offset: 2},
		{period: 20, offset: 1},
		{period: 21, offset: 0},
		// // 22
		// {period: 1, offset: 21},
		// {period: 2, offset: 20},
		// {period: 3, offset: 19},
		// {period: 4, offset: 18},
		// {period: 5, offset: 17},
		// {period: 6, offset: 16},
		// {period: 7, offset: 15},
		// {period: 8, offset: 14},
		// {period: 9, offset: 13},
		// {period: 10, offset: 12},
		// {period: 11, offset: 11},
		// {period: 12, offset: 10},
		// {period: 13, offset: 9},
		// {period: 14, offset: 8},
		// {period: 15, offset: 7},
		// {period: 16, offset: 6},
		// {period: 17, offset: 5},
		// {period: 18, offset: 4},
		// {period: 19, offset: 3},
		// {period: 20, offset: 2},
		// {period: 21, offset: 1},
		// {period: 22, offset: 0},
		// // 23
		// {period: 1, offset: 22},
		// {period: 2, offset: 21},
		// {period: 3, offset: 20},
		// {period: 4, offset: 19},
		// {period: 5, offset: 18},
		// {period: 6, offset: 17},
		// {period: 7, offset: 16},
		// {period: 8, offset: 15},
		// {period: 9, offset: 14},
		// {period: 10, offset: 13},
		// {period: 11, offset: 12},
		// {period: 12, offset: 11},
		// {period: 13, offset: 10},
		// {period: 14, offset: 9},
		// {period: 15, offset: 8},
		// {period: 16, offset: 7},
		// {period: 17, offset: 6},
		// {period: 18, offset: 5},
		// {period: 19, offset: 4},
		// {period: 20, offset: 3},
		// {period: 21, offset: 2},
		// {period: 22, offset: 1},
		// {period: 23, offset: 0},
 





		// ***remember i can do 21+(5/6) --- eg:
		// {period: 8, offset: 13+(5/6)}

		

		/**
		 * TEST B - FULL TEST FOR INDIVIDUAL SUM
		 * (in this case sum = 21)
		 */ 
		// {period: 0.5, offset: 20.5},
		// {period: 1, offset: 20},
		// {period: 1.5, offset: 19.5},
		// {period: 2, offset: 19},
		// {period: 2.5, offset: 18.5},
		// {period: 3, offset: 18},
		// {period: 3.5, offset: 17.5},
		// {period: 4, offset: 17},
		// {period: 4.5, offset: 16.5},
		// {period: 5, offset: 16},
		// {period: 5.5, offset: 15.5},
		// {period: 6, offset: 15},
		// {period: 6.5, offset: 14.5},
		// {period: 7, offset: 14},
		// {period: 7.5, offset: 13.5},
		// {period: 8, offset: 13},
		// {period: 8.5, offset: 12.5},
		// {period: 9, offset: 12},
		// {period: 9.5, offset: 11.5},
		// {period: 10, offset: 11},
		// {period: 10.5, offset: 10.5},
		// {period: 11, offset: 10},
		// {period: 11.5, offset: 9.5},
		// {period: 12, offset: 9},
		// {period: 12.5, offset: 8.5},
		// {period: 13, offset: 8},
		// {period: 13.5, offset: 7.5},
		// {period: 14, offset: 7},
		// {period: 14.5, offset: 6.5},
		// {period: 15, offset: 6},
		// {period: 15.5, offset: 5.5},
		// {period: 16, offset: 5},
		// {period: 16.5, offset: 4.5},
		// {period: 17, offset: 4},
		// {period: 17.5, offset: 3.5},
		// {period: 18, offset: 3},
		// {period: 18.5, offset: 2.5},
		// {period: 19, offset: 2},
		// {period: 19.5, offset: 1.5},
		// {period: 20, offset: 1},
		// {period: 20.5, offset: 0.5},
		// {period: 21, offset: 0},
	












		/**
		 *  WIDER SET FOR UNIVERSAL TESTS
		 */ 
		// // 16
		// {period: 6, offset: 10},
		// {period: 8, offset: 8},
		// {period: 10, offset: 6},
		// // 18
		// {period: 7, offset: 11},
		// {period: 9, offset: 9},
		// {period: 11, offset: 7},
		// // 20
		// {period: 8, offset: 12},
		// {period: 10, offset: 10},
		// {period: 12, offset: 8},
		// // 22
		// {period: 9, offset: 13},
		// {period: 11, offset: 11},
		// {period: 13, offset: 9},
		// // 24
		// {period: 10, offset: 14},
		// {period: 12, offset: 12},
		// {period: 14, offset: 10},
	]
}