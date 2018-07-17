
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var Actions = new Schema({
    userId: String,
    date: String,
    action: String,
    postId: String
});

Actions.statics.findByUserId = function(userId, callback) {
    return this.find({
        userId: userId
    }, callback).sort({date:-1});
};

Actions.statics.findByUserPostId = function (body,callback) {
    return this.find({
        userId: body.userId,
        postId: body.postId
    }, callback)
};

Actions.statics.findByPostId = function (postId,callback) {
    return this.find({
        postId: postId
    }, callback)
};

module.exports = mongoose.model('Account', Account);