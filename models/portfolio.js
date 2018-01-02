/**
 * Created by harshalcarpenter on 12/29/17.
 */

// This is where user's portfolio is stored.
// all entries are saved, none deleted, if updated save it
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var PortfolioSchema = new Schema({
    value: String,
    date: String,
    type: String,
    userId: String
});

PortfolioSchema.statics.findByUser = function(userId, callback) {
    return this.find({ userId: userId }, callback);
};

module.exports = mongoose.model('PSchema', PortfolioSchema);

//BTC-Val
//ETH-Val