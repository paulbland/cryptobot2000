/**
 * this is a once off script that adds "avg" to existing coinbase api data
 * 
 * might have to run again after i fix bot.js
 */

var mongoose 	= require('mongoose');

// DATABASE
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
mongoose.Promise = global.Promise;

var PriceRecordModels   = require('../models/pricerecordmodel') 
var currency            = 'LTC';

PriceRecordModels[currency].find({}).sort('datetime').exec(function(error, price_data) {
    if (error) {
        res.json(error);
    }
    else {
        dealWithThem(price_data)
    }
});

function dealWithThem(price_data) {
    price_data.forEach(function(item) {
        PriceRecordModels[currency].findById(item.id, function (err, myDocument) {
            myDocument.value_avg = ((myDocument.value_buy +  myDocument.value_sell) / 2)
            myDocument.save()
        });
    });
}