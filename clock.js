var CronJob             = require('cron').CronJob;
var priceBot            = require('./bots/price-bot.js')
var liveBot             = require('./bots/live-bot.js')
var config 		        = require('./config/config')

new CronJob('*/5 * * * *', function()       { priceBot.run() }, null, true, config.timezone);               // Every 5 min starting at hh:00:00

// new CronJob('1-59/5 * * * *', function()    { liveBot.run('30_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:01:00
// new CronJob('30 1-59/5 * * * *', function() { liveBot.run('60_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:01:30
// new CronJob('2-59/5 * * * *', function()    { liveBot.run('90_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:02:00
// new CronJob('30 2-59/5 * * * *', function() { liveBot.run('180_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:02:30
// new CronJob('3-59/5 * * * *', function()    { liveBot.run('270_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:03:00
// new CronJob('30 3-59/5 * * * *', function() { liveBot.run('360_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:03:30
