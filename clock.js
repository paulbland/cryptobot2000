var CronJob         = require('cron').CronJob;
//var gdaxPriceBot    = require('./bots/gdax-price-bot.js')

// every 10 mins
//new CronJob('*/10 * * * *', function() {
new CronJob('*/5 * * * * *', function() {
    console.log('works here');
  //gdaxPriceBot.run()
}, null, true, 'America/New_York');


