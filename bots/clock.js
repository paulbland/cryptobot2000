var CronJob             = require('cron').CronJob;
var gdaxPriceBot        = require('./gdax-price-bot.js')
var coinbasePriceBot    = require('./coinbase-price-bot.js')
var liveBot             = require('./live-bot.js')

// Every 10 min (starting at :00)
new CronJob('*/10 * * * *', function() {
    gdaxPriceBot.run()
}, null, true, 'America/New_York');

// Every 10 min (starting at :05)
new CronJob('5-59/10 * * * *', function() {
    coinbasePriceBot.run()
}, null, true, 'America/New_York');

// Every 10 min (starting at :02)
new CronJob('2-59/10 * * * *', function() {
    liveBot.run()
}, null, true, 'America/New_York');
