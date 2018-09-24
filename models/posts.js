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

Post.statics.findMany = function(postArr,callback){
    return this.find({
        '_id': { $in: postArr}
    }, callback);
}

module.exports = mongoose.model('Post', Post);



/**
 * Data Expected by Post Arr
 * postArr: [
        mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
        mongoose.Types.ObjectId('4ed3f117a844e0471100000d'), 
        mongoose.Types.ObjectId('4ed3f18132f50c491100000e')
    ]
 */