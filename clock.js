var CronJob             = require('cron').CronJob;
var gdaxPriceBot        = require('./bots/gdax-price-bot.js')
var coinbasePriceBot    = require('./bots/coinbase-price-bot.js')
var liveBot             = require('./bots/live-bot.js')
var timezone            = 'America/New_York';

new CronJob('*/5 * * * *', function()      { gdaxPriceBot.run() }, null, true, timezone);          // Every 10 min starting at :00
//new CronJob('1-59/10 * * * *', function()   { coinbasePriceBot.run()}, null, true, timezone);       // Every 10 min starting at :01

new CronJob('0 1-59/5 * * * *', function()   { liveBot.run('15_day_bot') }, null, true, timezone);   // Every 10 min starting at :02
new CronJob('30 1-59/5 * * * *', function()   { liveBot.run('30_day_bot') }, null, true, timezone);   // Every 10 min starting at :03
new CronJob('0 2-59/5 * * * *', function()   { liveBot.run('45_day_bot') }, null, true, timezone);   // Every 10 min starting at :04
new CronJob('30 2-59/5 * * * *', function()   { liveBot.run('60_day_bot') }, null, true, timezone);   // Every 10 min starting at :05
new CronJob('0 3-59/5 * * * *', function()   { liveBot.run('75_day_bot') }, null, true, timezone);   // Every 10 min starting at :06
new CronJob('30 3-59/5 * * * *', function()   { liveBot.run('90_day_bot') }, null, true, timezone);   // Every 10 min starting at :07
