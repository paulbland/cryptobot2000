module.exports = {


        // good range for wide testing (also used these for big spreadsheet test)
		low_values 	: [0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18],
		high_values : [0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18],

        // narrow range (just best values) for quicker testing 
        //var low_values 	= [0.13, 0.14, 0.15, 0.16, 0.17];
        //var high_values = [0.13, 0.14, 0.15, 0.16, 0.17];


		// NEW WAY
		// only run combos that add up to 24 (or whatver the sweet spot is...)
		// 21.5 - still could be fine tuned
		 period_offset_combos: [

			// compelte set for 21.5 testing...
			// {period: 1, offset: 20.5},
			// {period: 2, offset: 19.5},
			// {period: 3, offset: 18.5},
			// {period: 4, offset: 17.5},
			// {period: 5, offset: 16.5},
			// {period: 6, offset: 15.5},
			// {period: 7, offset: 14.5},
			// {period: 8, offset: 13.5},
			// {period: 9, offset: 12.5},
			// {period: 10, offset: 11.5},
			// {period: 11, offset: 10.5},
			// {period: 12, offset: 9.5},
			// {period: 13, offset: 8.5},
			// {period: 14, offset: 7.5},
			// {period: 15, offset: 6.5},
			// {period: 16, offset: 5.5},
			// {period: 17, offset: 4.5},
			// {period: 18, offset: 3.5},
			// {period: 19, offset: 2.5},
			// {period: 20, offset: 1.5},
			// {period: 21, offset: 0.5}



			// test to see sum graph (though could expand this to big test. i like the 5/50 split thing)
			// relly wanna expand this - but it will take forever. over night?
			// 19
			// {period: 5.5, offset: 13.5},
			// {period: 6.5, offset: 12.5},
			// {period: 7.5, offset: 11.5},
			// {period: 8.5, offset: 10.5},
			// {period: 9.5, offset: 9.5},
			// {period: 10.5, offset: 8.5},
			// {period: 11.5, offset: 7.5},
			// {period: 12.5, offset: 6.5},
			// {period: 13.5, offset: 5.5},
			// // 20
			// {period: 6, offset: 14},
			// {period: 7, offset: 13},
			// {period: 8, offset: 12},
			// {period: 9, offset: 11},
			// {period: 10, offset: 10},
			// {period: 11, offset: 9},
			// {period: 12, offset: 8},
			// {period: 13, offset: 7},
			// {period: 14, offset: 6},
			// // 21
			// {period: 6.5, offset: 14.5},
			// {period: 7.5, offset: 13.5},
			// {period: 8.5, offset: 12.5},
			// {period: 9.5, offset: 11.5},
			// {period: 10.5, offset: 10.5},
			// {period: 11.5, offset: 9.5},
			// {period: 12.5, offset: 8.5},
			// {period: 13.5, offset: 7.5},
			// {period: 14.5, offset: 6.5},
			// // 22	
			{period: 0.5, offset: 21.5},
			{period: 1, offset: 21},
			{period: 1.5, offset: 20.5},
			{period: 2, offset: 20},
			{period: 2.5, offset: 19.5},
			{period: 3, offset: 19},
			{period: 3.5, offset: 18.5},
			{period: 4, offset: 18},
			{period: 4.5, offset: 17.5},
			{period: 5, offset: 17},
			{period: 5.5, offset: 16.5},
			{period: 6, offset: 16},
			{period: 6.5, offset: 15.5},
			{period: 7, offset: 15},
			{period: 7.5, offset: 14.5},
			{period: 8, offset: 14},
			{period: 8.5, offset: 13.5},
			{period: 9, offset: 13},
			{period: 9.5, offset: 12.5},
			{period: 10, offset: 12},
			{period: 10.5, offset: 11.5},
			{period: 11, offset: 11},
			{period: 11.5, offset: 10.5},
			{period: 12, offset: 10},
			{period: 12.5, offset: 9.5},
			{period: 13, offset: 9},
			{period: 13.5, offset: 8.5},
			{period: 14, offset: 8},
			{period: 14.5, offset: 7.5},
			{period: 15, offset: 7},
			{period: 15.5, offset: 6.5},
			{period: 16, offset: 6},
			{period: 16.5, offset: 5.5},
			{period: 17, offset: 5},
			{period: 17.5, offset: 4.5},
			{period: 18, offset: 4},
			{period: 18.5, offset: 3.5},
			{period: 19, offset: 3},
			{period: 19.5, offset: 2.5},
			{period: 20, offset: 2},
			{period: 20.5, offset: 1.5},
			{period: 21, offset: 1},
			{period: 21.5, offset: 0.5},
			{period: 22, offset: 0}
			
			// // 23
			// {period: 7.5, offset: 15.5},
			// {period: 8.5, offset: 14.5},
			// {period: 9.5, offset: 13.5},
			// {period: 10.5, offset: 12.5},
			// {period: 11.5, offset: 11.5},
			// {period: 12.5, offset: 10.5},
			// {period: 13.5, offset: 9.5},
			// {period: 14.5, offset: 8.5},
			// {period: 15.5, offset: 7.5}



			// remember i can do 21+(5/6) ---
           // {period: 8, offset: 13+(5/6)}
         ]
}