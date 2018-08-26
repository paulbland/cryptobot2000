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
new CronJob('5 * * * * *', function() { liveBot.run('30_day_bot') }, null, true, config.timezone); // every min at hh:mm:05
new CronJob('15 * * * * *', function() { liveBot.run('60_day_bot') }, null, true, config.timezone); // every min at hh:mm:15
new CronJob('25 * * * * *', function() { liveBot.run('90_day_bot') }, null, true, config.timezone); // every min at hh:mm:25
new CronJob('35 * * * * *', function() { liveBot.run('120_day_bot') }, null, true, config.timezone); // every min at hh:mm:35
new CronJob('45 * * * * *', function() { liveBot.run('150_day_bot') }, null, true, config.timezone); // every min at hh:mm:45
new CronJob('55 * * * * *', function() { liveBot.run('180_day_bot') }, null, true, config.timezone); // every min at hh:mm:55
