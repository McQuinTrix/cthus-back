/**
 * Created by harshalcarpenter on 11/26/17.
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var Account = new Schema({
    email: String,
    password: String,
    pin: String,
    fname: String,
    lname: String,
    date: Number,
    lastUpdate: Number
});

Account.statics.findByEmail = function(email, callback) {
    return this.find({ email: new RegExp(email, 'i') }, callback);
};

module.exports = mongoose.model('Account', Account);