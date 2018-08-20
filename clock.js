var CronJob             = require('cron').CronJob;
var priceBot            = require('./bots/price-bot.js')
var liveBot             = require('./bots/live-bot.js')
var config 		        = require('./config/config')

// new CronJob('*/15 * * * *', function()            { priceBot.run() }, null, true, config.timezone);              // Every 15 min starting at hh:00:00

// new CronJob('1-59/15 * * * *', function()         { liveBot.run('15_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:01:00
// new CronJob('20 1-59/15 * * * *', function()      { liveBot.run('30_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:01:20
// new CronJob('40 1-59/15 * * * *', function()      { liveBot.run('45_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:01:40

// new CronJob('2-59/15 * * * *', function()         { liveBot.run('60_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:02:00
// new CronJob('20 2-59/15 * * * *', function()      { liveBot.run('75_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:02:20
// new CronJob('40 2-59/15 * * * *', function()      { liveBot.run('90_day_bot') }, null, true, config.timezone);   // Every 5 min starting at hh:02:40

// new CronJob('3-59/15 * * * *', function()         { liveBot.run('105_day_bot') }, null, true, config.timezone);  // Every 5 min starting at hh:03:00
// new CronJob('20 3-59/15 * * * *', function()      { liveBot.run('120_day_bot') }, null, true, config.timezone);  // Every 5 min starting at hh:03:20
// new CronJob('40 3-59/15 * * * *', function()      { liveBot.run('135_day_bot') }, null, true, config.timezone);  // Every 5 min starting at hh:03:40

// new CronJob('4-59/15 * * * *', function()         { liveBot.run('150_day_bot') }, null, true, config.timezone);  // Every 5 min starting at hh:04:00
// new CronJob('20 4-59/15 * * * *', function()      { liveBot.run('165_day_bot') }, null, true, config.timezone);  // Every 5 min starting at hh:04:20
// new CronJob('40 4-59/15 * * * *', function()      { liveBot.run('180_day_bot') }, null, true, config.timezone);  // Every 5 min starting at hh:04:40
