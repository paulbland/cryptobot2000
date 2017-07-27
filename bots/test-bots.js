// var gdaxPriceBot        = require('./gdax-price-bot.js')
// var coinbasePriceBot    = require('./coinbase-price-bot.js')
 var liveBot                = require('./live-bot.js')
// var simBot              = require('./sim-bot.js')

// gdaxPriceBot.run()
// coinbasePriceBot.run()

// cant run bots at same time!! all uses same object!
// this is jsut testing 0 uses clock
setTimeout(function() { liveBot.run('1_day_bot'); }, 0);
setTimeout(function() { liveBot.run('2_day_bot'); }, 1000);
setTimeout(function() { liveBot.run('3_day_bot'); }, 2000);


// simBot.run()