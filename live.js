
/*
set heroku scheduler to run this every 10 minutes


--- 
connect to db
get price data from DB
get latest live info from db (btc-live-result)
decide buy or sell
do real buy or do real sell
update db with details (new record)

	-include transaciton details and totals

	live result contains: {
		-datetime updated
		-sellbuy price datetime?
		-this - sell price
		-this - buy price
		-total - num coins currently owned (start at 0)
		-total - num coins sold 
		-total - money invested
		-total - money from sales
		-total - cash reserve 
		-this-transaction {
			- action taken - (buy_sell_or_nothing)
			 - num_coins bought
			 - buy price (is above buy eh)
			 - coins sold 
			- total result of this sale}
		}

exit()




also-

- create live_result.js - that shows db entires, in reverse chronilogical


- Split simulation obj into simulation / tools / reporting


*/