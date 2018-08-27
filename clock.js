var CronJob             = require('cron').CronJob;
var priceBot            = require('./bots/price-bot.js')
var liveBot             = require('./bots/live-bot.js')
var config 		        = require('./config/config')
//var simBot              = require('./sim-bot.js')

const used = process.memoryUsage().heapUsed / 1024 / 1024;
self.debug(`CLOCK: script uses approximately ${Math.round(used * 100) / 100} MB`);

// for reference:
//  */15 * * * * --- every 15 mins

// new CronJob('0 0 * * *', function() { simBot.run() }, null, true, config.timezone); // 12am everyday

new CronJob('0 * * * *', function() { priceBot.run() }, null, true, config.timezone); // every hour at hh:00

// every minute!
new CronJob('5 * * * * *', function() { liveBot.run('30_day_bot') }, null, true, config.timezone); // every 5 min at hh:01:00
new CronJob('15 * * * * *', function() { liveBot.run('60_day_bot') }, null, true, config.timezone); // every 5 min at hh:01:30
new CronJob('25 * * * * *', function() { liveBot.run('90_day_bot') }, null, true, config.timezone); // every 5 min at hh:02:00
new CronJob('35 * * * * *', function() { liveBot.run('120_day_bot') }, null, true, config.timezone); // every 5 min at hh:02:30
new CronJob('45 * * * * *', function() { liveBot.run('150_day_bot') }, null, true, config.timezone); // every 5 min at hh:03:00
new CronJob('55 * * * *', function() { liveBot.run('180_day_bot') }, null, true, config.timezone); // every 5 min at hh:03:30

// new CronJob('1-59/5 * * * *', function() { liveBot.run('30_day_bot') }, null, true, config.timezone); // every 5 min at hh:01:00
// new CronJob('30 1-59/5 * * * *', function() { liveBot.run('60_day_bot') }, null, true, config.timezone); // every 5 min at hh:01:30
// new CronJob('2-59/5 * * * *', function() { liveBot.run('90_day_bot') }, null, true, config.timezone); // every 5 min at hh:02:00
// new CronJob('30 2-59/5 * * * *', function() { liveBot.run('120_day_bot') }, null, true, config.timezone); // every 5 min at hh:02:30
// new CronJob('3-59/5 * * * *', function() { liveBot.run('150_day_bot') }, null, true, config.timezone); // every 5 min at hh:03:00
// new CronJob('30 3-59/5 * * * *', function() { liveBot.run('180_day_bot') }, null, true, config.timezone); // every 5 min at hh:03:30

