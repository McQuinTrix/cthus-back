var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var Post = new Schema({
    type: String,
    commentObj: Object,
    reactions: Object,
    created: String,
    lastUpdated: String,
    parentId:String,
    _id: String
}, { _id: false });
//reactions: {userId:{lastUpdated:"", reactionType:""}}
//commentObj: {userId:"",value:""}

module.exports = mongoose.model('Post', Post);