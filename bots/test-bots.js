// var gdaxPriceBot        = require('./gdax-price-bot.js')
// var coinbasePriceBot    = require('./coinbase-price-bot.js')
 var liveBot                = require('./live-bot.js')
// var simBot              = require('./sim-bot.js')

// gdaxPriceBot.run()
// coinbasePriceBot.run()

// cant run bots at same time!! all uses same object!

liveBot.run('1_day_bot')
liveBot.run('2_day_bot')
lliveBot.run('3_day_bot')



// simBot.run()