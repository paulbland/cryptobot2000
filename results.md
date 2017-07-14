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

=========================


  result testing jul 13

  best single value: (forward)
  period_9_offset_12
  low 0.15
  high 0.17


=====



TEST FORWARD
3/6/9/12/15/18
0/3/6/9/12/15/18

evertyhing over $200 (for offset/period)
average value of table:
    period_3_offset_12: 217.88057131729866
    period_3_offset_15: 234.88101764344228
    period_3_offset_18: 268.7368830971073
    period_6_offset_9: 202.14099018810282
    period_6_offset_12: 261.39052689005933
    period_6_offset_15: 260.7026054519383
    period_9_offset_9: 240.9802428876629
    period_9_offset_12: 271.4037251281057
    period_12_offset_6: 220.4799577539591
    period_12_offset_9: 233.72821896886296
    period_15_offset_3: 202.88389552249404
    period_15_offset_6: 219.66456313505958

everything over $400:
  low 0.13++++, 0.15+++++++, 0.17++++
  high 0.11+, 0.13++, 0.15+++++, 0.17+++++, 0.19+


TEST BACKWARD
everything over $200
    average value of table:
    period_12_offset_6: 203
    period_15_offset_6: 209
    period_15_offset_9: 206
    period_15_offset_12: 207
    period_18_offset_3: 203
    period_18_offset_6: 230
    period_18_offset_9: 206
    period_18_offset_12: 205

low 0.09++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 0.11+++++++++++++++++++++++++++++++++ 0.13+++++++++
high 0.13++ 0.15+++++++ 0.17++++++++++++++ 0.19++++++++++++++++++++++++++++ 0.21+++++++++++++++++++++++++++++++++++++++++


BEST OF BOTH WORLDS
  period_12_offset_6:
  period_15_offset_6:
  low 0.13
  high 0.15 0.17

-----

SECOND TEST === FINE GRAIN ON THESE VALUES:
    periods 	= [10, 11, 12, 13, 14, 15, 16, 17]; 	
    offsets 	= [4, 5, 6, 7, 8]; 						
    low_values 	= [0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18];
    high_values = [0.14, 0.15, 0.16, 0.17, 0.18, 0.19];//[0.17];






remove everything under $280

period_11_offset_8: 298
period_12_offset_8: 310***
period_13_offset_7: 305***
period_13_offset_8: 326***
period_14_offset_6: 282
period_14_offset_7: 300***
period_14_offset_8: 326***
period_15_offset_6: 297
period_15_offset_7: 313***
period_16_offset_5: 283
period_16_offset_6: 293
period_17_offset_5: 288

values over $400
  low--- 0.11-0.14 (0.12-13++)
  high---14 15


reverse:


average value of table:

period_10_offset_7: 239**
period_10_offset_8: 223
period_11_offset_6: 232**
period_11_offset_7: 230**
period_12_offset_6: 227
period_12_offset_8: 222
period_13_offset_5: 220
period_13_offset_6: 225
period_14_offset_8: 221
period_15_offset_4: 220
period_15_offset_8: 228
period_16_offset_7: 232**
period_16_offset_8: 235**
period_17_offset_7: 244****
period_17_offset_8: 234**

values over $400/$500
  low---11
  high---15 16++ 17++ 18 19


COMMON
  12/8
  14/8
  low 11
  high 15




  ====getting really close:
best of both worlds here

  	periods 	= [14]; 	
			offsets 	= [8]; 			
			low_values 	= [0.11];	
			high_values = [0.15];			

======

expanding best of both worlds:

f
period_13_offset_7: 324
period_13_offset_8: 359
period_13_offset_9: 376
period_14_offset_7: 325
period_14_offset_8: 376
period_14_offset_9: 332
period_15_offset_7: 381
period_15_offset_8: 344
period_15_offset_9: 218
b
period_13_offset_7: 310
period_13_offset_8: 276
period_13_offset_9: 274
period_14_offset_7: 333
period_14_offset_8: 329
period_14_offset_9: 281
period_15_offset_7: 290
period_15_offset_8: 288
period_15_offset_9: 292
sum
period_13_offset_7: 324+310=634
period_13_offset_8: 359+276=635
period_13_offset_9: 376+274=650*
period_14_offset_7: 325+333=658*
period_14_offset_8: 376+329=705**** CONFIRMATION 14/8
period_14_offset_9: 332+281=613
period_15_offset_7: 381+290=671*
period_15_offset_8: 344+288=632
period_15_offset_9: 218+292=510


AVERAGE OF 14/8 tavbles
key: period_14_offset_8

↓high\low→	 0.1	            0.11	      0.12
0.14	       658.76           643.61      576.98
0.15         924.48           837.3       603.07
0.16	       836.37           748.47      512.78

high 0.15 confimred
this says 0.1 for low

SO BEST TODAY IS 14/8/0.10/0.15

so wait 0.11 is more consisten

*** BEST TODAY: 14-period/8-offset/0.11-low/0.15-high ****


==============================


# TESTS JULY 13 


VALUES I THOUGH WRE BEST FROM LOOKING (last night):
    14-period/8-offset/11-low/15-high

BEST GLOBAL AVG from two different tests (i forget values):
    13-period/7-offset/12-low/14-high 
    14-14.5-period/8-offset/0.12-low/0.145-15-high

best averages from MASSIVE test:
    12-period/5-offset/0.12-low/0.14-high

best single $ value from massive test (less importnat???):
    (12/10o/14l/15-16/h --- $930)

best averages from massive test -- in reverse!!!!:
    period_16, offset_6, low_0.08, high_0.17

best single $ value from reverse ($1205.44!):
    period_12, offset_5, low-0.08, 0.16-high


*** 12p/5o same as best from forward! *** ??

* question -- what period/offsets are best when i test from 12/15 (because they are consistent with boths tests!)

* next --- instead of picking just the best - pick the top 3? or something. or all in top 90% ...?