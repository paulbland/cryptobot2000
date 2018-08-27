var CronJob             = require('cron').CronJob;
var priceBot            = require('./bots/price-bot.js')
var liveBot             = require('./bots/live-bot.js')
var config 		        = require('./config/config')
//var simBot              = require('./sim-bot.js')

// for reference:
//  */15 * * * * --- every 15 mins

// new CronJob('0 0 * * *', function() { simBot.run() }, null, true, config.timezone); // 12am everyday

new CronJob('0 * * * *', function() { priceBot.run() }, null, true, config.timezone); // every hour at hh:00

// 5 so it doesnt run at exact same time as price bot (running on 00)
new CronJob('1-59/5 * * * *', function() { liveBot.run('30_day_bot') }, null, true, config.timezone); // every 5 min at hh:01:00
new CronJob('30 1-59/5 * * * *', function() { liveBot.run('60_day_bot') }, null, true, config.timezone); // every 5 min at hh:01:30
new CronJob('2-59/5 * * * *', function() { liveBot.run('90_day_bot') }, null, true, config.timezone); // every 5 min at hh:02:00
new CronJob('30 2-59/5 * * * *', function() { liveBot.run('120_day_bot') }, null, true, config.timezone); // every 5 min at hh:02:30
new CronJob('3-59/5 * * * *', function() { liveBot.run('150_day_bot') }, null, true, config.timezone); // every 5 min at hh:03:00
new CronJob('30 3-59/5 * * * *', function() { liveBot.run('180_day_bot') }, null, true, config.timezone); // every 5 min at hh:03:30
