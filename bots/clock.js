var CronJob         = require('cron').CronJob;
var gdaxPriceBot    = require('./gdax-price-bot.js')

// every 10 mins
//new CronJob('*/10 * * * *', function() {
new CronJob('*/5 * * * * *', function() {
    gdaxPriceBot.run()
}, null, true, 'America/New_York');
