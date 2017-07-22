/**
 * this script will get last x days history for all currencies
 */
var mongoose 	= require('mongoose');
var Gdax        = require('gdax');
var moment      = require('moment');

// DATABASE
mongoose.connect(process.env.MONGODB_URI_NEW, {useMongoClient: true});
mongoose.Promise = global.Promise;

var publicClient
var PriceRecordModels = require('../models/pricerecordmodel') 

// num of days to get
var days            = 90;
var num_done        = 0;
var all_my_prices   = []
var granularity     = 600;   // granularity 300 = 5 mins. 600 = 10 mins
var delay           = 2000;


getMyData('LTC') //BTC ETH LTC


function getMyData(currency) {

    publicClient = new Gdax.PublicClient(currency+'-USD');
    
    // FOR EACH DAY 
    for (i=days; i>0; i--) {
       setTimeout(createHandler(i, currency), ((days - i) * delay));   
    }
}


// i not visible inside setTimeout
function createHandler(i, currency) {
    return function() { 
        getRates(i, currency);
    };
}


function getRates(i, currency) {

    //console.log(`running get rates on ${i}`);
    // 144 a day

    var start   = moment().subtract(i, 'days');
    var end     = moment().subtract((i - 1), 'days').subtract(granularity, 'seconds');

    var vars = {
        'granularity'  : granularity,             
        start          : start.toISOString(),
        end            : end.toISOString()
    }

    // HIT API AND PUSH DATA
    publicClient.getProductHistoricRates(vars, function(err, response, data) {

        if (err) {
            return handleError(err);
        }

        console.log(`got ${data.length} items for ${i}`)
        // console.log(`first value for ${i}:`);
        // console.log(moment(data[(data.length - 1)][0] * 1000).toISOString())        
        // console.log(`last value for ${i}:`);
        // console.log(moment(data[0][0] * 1000).toISOString())
        // console.log('---')

        data.forEach(function(item) {
             all_my_prices.push(item)
        })

        num_done++;       
        
        if (num_done === days) {
            wrapThingsUp(all_my_prices, currency)
        }
    });

}

function wrapThingsUp(all_my_prices, currency) {

    var my_objs = []

    // SORT ALL NEW VALUES ASC
    all_my_prices.sort(function(a, b) {
        return a[0] - b[0];
    })

    // FOR EACH PRICE, PUT IN OBJECT
    all_my_prices.forEach(function(this_item) {
        // format:  [ time, low, high, open, close, volume ]
        my_objs.push({
            datetime     : moment(this_item[0] * 1000).toISOString(),
            value_buy    : this_item[4], // using close for both
            value_sell   : this_item[4], // using close for both
            value_avg    : this_item[4] // could average them but whats the point? if i ever change the values then average them
        })
    });

   
    PriceRecordModels[currency].create(my_objs, function(err) {
        if (err) {
            return handleError(err);
        }
        console.log(`Saved price history from GDAX!`);
    });
}