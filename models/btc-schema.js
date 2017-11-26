/**
 * Created by harshalcarpenter on 11/25/17.
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var BTCSchema = new Schema({
    value: Number,
    date: Number
});

module.exports = mongoose.model('BTC', BTCSchema);