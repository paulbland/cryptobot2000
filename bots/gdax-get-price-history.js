/**
 * this script will get last x days history for all currencies
 */
var mongoose 	= require('mongoose');
var Gdax        = require('gdax');
var moment      = require('moment');


// DATABASE
mongoose.connect(process.env.MONGODB_URI_NEW, {useMongoClient: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Define a schema
var Schema = mongoose.Schema;

var PriceRecordSchema = new Schema({
    datetime	: Date,
    value_sell 	: Number,
    value_buy 	: Number,
    value_avg 	: Number
});


var publicClient;
var PriceRecordModel;

// num of days to get
var days            = 90; //26; 
var num_done        = 0;
var all_my_prices   = []
var granularity     = 600;   // granularity 300 = 5 mins. 600 = 10 mins
var delay           = 2000;



//getMyData('PriceRecordModelBTC', 'BTC')
getMyData('PriceRecordModelETH', 'ETH')
//getMyData('PriceRecordModelLTC', 'LTC')


function getMyData(modelName, currency) {

    publicClient        = new Gdax.PublicClient(currency+'-USD');
	PriceRecordModel    = mongoose.model(modelName, PriceRecordSchema);

    // FOR EACH DAY 
    for (i=days; i>0; i--) {
       setTimeout(createHandler(i), ((days - i) * delay));   
    }
}

// i not visible inside setTimeout
function createHandler(i) {
    return function() { 
        getRates(i);
    };
}


function getRates(i) {

    //console.log(`running get rates on ${i}`);

    // 144 a day

    var start   = moment().subtract(i, 'days');
    var end     = moment().subtract((i - 1), 'days').subtract(granularity, 'seconds');

    var vars = {
        'granularity'  : granularity,             
        start          : start.toISOString(),
        end            : end.toISOString()
    }

    // *** FOR FIRST DAY ONLY - TO MATCH EXISTING DATA ***
    if (i===days) {
        vars.start = '2017-06-25T20:55:38.463Z' 
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
            wrapThingsUp(all_my_prices)
        }
    });

}

function wrapThingsUp(all_my_prices) {

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
            value_avg    : this_item[4] // could average them but whats the point? if i ever chagne the values then average them
        })
    });

    PriceRecordModel.create(my_objs, function(err) {
        if (err) {
            return handleError(err);
        }
        console.log(`Saved price history from GDAX!`);
    });
}