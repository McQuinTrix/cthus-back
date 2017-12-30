/**
 * Created by harshalcarpenter on 12/29/17.
 */
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var PortfolioSchema = new Schema({
    value: String,
    date: String,
    type: String,
    userID: String
});

PortfolioSchema.statics.findByUser = function(userId, callback) {
    return this.find({ userId: new RegExp(userId, 'i') }, callback);
};

module.exports = mongoose.model('PSchema', PortfolioSchema);

//BTC-Val
//ETH-Val