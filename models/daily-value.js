/**
 * Created by harshalcarpenter on 12/29/17.
 */

// This is where Crypto value will be stored hourly..
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var DailySchema = new Schema({
    value: String,
    date: String,
    type: String
});

DailySchema.statics.findByType = function(type, callback) {
    return this.find({ type: new RegExp(type, 'i') }, callback).sort({date:-1}).limit(192);
};

module.exports = mongoose.model('DailySchema', DailySchema);

//BTC
//ETH