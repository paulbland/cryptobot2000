/**
 * this script will get last 90 days history for all currencies
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
    value_buy 	: Number
});


//getMyData('PriceRecordModelBTC', 'BTC')
getMyData('PriceRecordModelETH', 'ETH')
//getMyData('PriceRecordModelLTC', 'LTC')

var publicClient;
var PriceRecordModel

function getMyData(modelName, currency) {

    publicClient        = new Gdax.PublicClient(currency+'-USD');
	PriceRecordModel    = mongoose.model(modelName, PriceRecordSchema);

    // num of days to get
    var days            = 8; //90
    var num_done        = 0;
    var all_my_prices   = []

    // FOR EACH DAY 
    for (i=days; i>0; i--) {

        var start   = moment().subtract(i, 'days');
        var end     = moment().subtract((i - 1), 'days');

        var vars = {
            'granularity'  : 300,              // granularity = 5 mins
            start          : start.toISOString(),
            end            : end.toISOString()
        }

        // HIT API AND PUSH DATA
        publicClient.getProductHistoricRates(vars, function(err, response, data) {

            if (err) {
                return handleError(err);
            }

            data.forEach(function(item) {
                 all_my_prices.push(item)
            })
            num_done++;       
            
            if (num_done === days) {
                wrapThingsUp(all_my_prices)
            }
        });
    }
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
            value_buy    : this_item[1],
            value_sell   : this_item[2],
        })
    });

    PriceRecordModel.create(my_objs, function(err) {
        if (err) {
            return handleError(err);
        }
        console.log(`Saved price history from GDAX!`);
    });
}