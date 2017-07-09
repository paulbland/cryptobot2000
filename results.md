// a fave
//http://localhost:5000/run-simulation-single?hrs_in_period=6&offset=12&low_threshold=0.11&high_threshold=0.13&currency=LTC

// GOOD/BAD

// ==ETH== (7/5) (300/5000/avg/sellall=true/nocrash)
//
//	off \ per |		6		12		24		48		72
// ------------------------------------------------------
// 		0	  |		✔		✔ 		✔ 		✘ 		✘
//		6	  |		✔ 		✔✔		✔ 		✘ 		✘
//		12	  | 	✔✔		✔		✔ 		✘ 		✘
//		24    |		✔		✔✔		✘		✘		✘
//		48	  |		✘		✘		✘		✘		✘✘

// ==BTC== (7/5) (300/5000/avg/sellall=true/nocrash)
//
//	off \ per |		6		12		24		48		72
// -----------------------------------------------------
// 		0	  |		✘		~		 		 		
//		6	  |		~		~		~		 		 		
//		12	  | 	~		~		~ 		 		
//		24    |		~		~		✘				
//		48	  |		~	

// ==LTC== (7/5) (300/5000/avg/sellall=true/nocrash)
//
//	off \ per |		6		12		24		48		72
// -----------------------------------------------------
// 		0	  |		✔		✔✔		✔		~		✔
//		6	  |		✔✔		✔✔		✔		✔ 		 		
//		12	  | 	✔✔		✔✔		✔✔ 		✔		
//		24    |		✔✔		✔✔		✔		✔		
//		48	  |		✔		✔		✔		✔		




# AVERAGES
(no crash)
LTC/ETH , forward and reverse - raw


ETH FORWADRD

  { period_6_offset_6: 65.05774385340338,
8:41:02 PM web.1 |    period_6_offset_12: 123.37831679849297,       *
8:41:02 PM web.1 |    period_6_offset_24: 37.59813802960711,
8:41:02 PM web.1 |    period_12_offset_6: 95.94141035336202,        *
8:41:02 PM web.1 |    period_12_offset_12: 34.63776502136423,
8:41:02 PM web.1 |    period_12_offset_24: 97.16607771162877,       *
8:41:02 PM web.1 |    period_24_offset_6: 32.541199934413754,
8:41:02 PM web.1 |    period_24_offset_12: 78.45980280596815,
8:41:02 PM web.1 |    period_24_offset_24: -36.78963362552534 }



LTC FORWARD


8:44:29 PM web.1 |  table averages:
8:44:29 PM web.1 |  { period_6_offset_6: 74.49270464977725,
8:44:29 PM web.1 |    period_6_offset_12: 124.02541204771138,       *
8:44:29 PM web.1 |    period_6_offset_24: 91.21670909931002,        *
8:44:29 PM web.1 |    period_12_offset_6: 98.8876791638432,         *
8:44:29 PM web.1 |    period_12_offset_12: 58.48373649449537,
8:44:29 PM web.1 |    period_12_offset_24: 106.60101329138847,      *
8:44:29 PM web.1 |    period_24_offset_6: 50.01592832820996,
8:44:29 PM web.1 |    period_24_offset_12: 82.01306963320806,
8:44:29 PM web.1 |    period_24_offset_24: 50.89844467236596 }



ETH REVERSE

  {                     period_6_offset_6: 80.7756567254078,
8:50:40 PM web.1 |    period_6_offset_12: 69.14639424285106,
8:50:40 PM web.1 |    period_6_offset_24: 66.5442899493818,
8:50:40 PM web.1 |    period_12_offset_6: 80.94016090172664,
8:50:40 PM web.1 |    period_12_offset_12: 87.334613644265,
8:50:40 PM web.1 |    period_12_offset_24: 89.50158431722167,
8:50:40 PM web.1 |    period_24_offset_6: 77.95037113486866,
8:50:40 PM web.1 |    period_24_offset_12: 105.24781968988214,          *
8:50:40 PM web.1 |    period_24_offset_24: 127.35317010709359 }         *



LTC REVERE

                    period_6_offset_6: -8.215902465451675,              *
8:53:34 PM web.1 |    period_6_offset_12: -30.5858523533186,        
8:53:34 PM web.1 |    period_6_offset_24: -69.0665034131627,
8:53:34 PM web.1 |    period_12_offset_6: -14.658676451902826,          *
8:53:34 PM web.1 |    period_12_offset_12: -35.22685343761952,
8:53:34 PM web.1 |    period_12_offset_24: -60.9440852184724,
8:53:34 PM web.1 |    period_24_offset_6: -40.211831173488896,
8:53:34 PM web.1 |    period_24_offset_12: -50.10982309276386,
8:53:34 PM web.1 |    period_24_offset_24: -60.19449501496103 }


12-period/6-offset
0.11-low/0.17-high


12p/6o
14l/17h


12p/6o
16l/17h

    $267.75/267