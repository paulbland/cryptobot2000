var CronJob             = require('cron').CronJob;
var priceBot            = require('./bots/price-bot.js')
//var coinbasePriceBot    = require('./bots/coinbase-price-bot.js')
var liveBot             = require('./bots/live-bot.js')
var timezone            = 'America/New_York';

new CronJob('*/5 * * * *', function()      { priceBot.run() }, null, true, timezone);               // Every 5 min starting at hh:00:00
//new CronJob('1-59/10 * * * *', function()   { coinbasePriceBot.run()}, null, true, timezone);     // Every 10 min starting at :01

new CronJob('1-59/5 * * * *', function()    { liveBot.run('15_day_bot') }, null, true, timezone);   // Every 5 min starting at hh:01:00
new CronJob('30 1-59/5 * * * *', function() { liveBot.run('30_day_bot') }, null, true, timezone);   // Every 5 min starting at hh:01:30
new CronJob('2-59/5 * * * *', function()    { liveBot.run('45_day_bot') }, null, true, timezone);   // Every 5 min starting at hh:02:00
new CronJob('30 2-59/5 * * * *', function() { liveBot.run('60_day_bot') }, null, true, timezone);   // Every 5 min starting at hh:02:30
new CronJob('3-59/5 * * * *', function()    { liveBot.run('75_day_bot') }, null, true, timezone);   // Every 5 min starting at hh:03:00
new CronJob('30 3-59/5 * * * *', function() { liveBot.run('90_day_bot') }, null, true, timezone);   // Every 5 min starting at hh:03:30
