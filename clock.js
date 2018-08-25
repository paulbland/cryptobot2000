var CronJob             = require('cron').CronJob;
var priceBot            = require('./bots/price-bot.js')
var liveBot             = require('./bots/live-bot.js')
var config 		        = require('./config/config')

new CronJob('0 * * * *', function() { priceBot.run() }, null, true, config.timezone); // every hour at hh:00
// */15 * * * * --- every 15 mins

new CronJob('1 * * * *', function() { liveBot.run('30_day_bot') }, null, true, config.timezone); // every hour at hh:01
new CronJob('2 * * * *', function() { liveBot.run('60_day_bot') }, null, true, config.timezone); // every hour at hh:02
new CronJob('3 * * * *', function() { liveBot.run('90_day_bot') }, null, true, config.timezone); // every hour at hh:03
new CronJob('4 * * * *', function() { liveBot.run('120_day_bot') }, null, true, config.timezone); // every hour at hh:04
new CronJob('5 * * * *', function() { liveBot.run('150_day_bot') }, null, true, config.timezone); // every hour at hh:05
new CronJob('6 * * * *', function() { liveBot.run('180_day_bot') }, null, true, config.timezone); // every hour at hh:06

// '1-59/15 * * * *'    // Every 15 min starting at hh:01:00