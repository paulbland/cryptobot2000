// var gdaxPriceBot        = require('./gdax-price-bot.js')
// var coinbasePriceBot    = require('./coinbase-price-bot.js')
 var liveBot                = require('./live-bot.js')
// var simBot              = require('./sim-bot.js')

// gdaxPriceBot.run()
// coinbasePriceBot.run()

// cant run bots at same time!! all uses same object!
// this is jsut testing 0 uses clock
liveBot.run('90_day_bot');

// simBot.run()