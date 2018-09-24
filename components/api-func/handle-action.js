var actionEnum = require('../../enum/actions-enum'),
    Post = require('../../models/posts'),
    moment = require('moment');

module.exports = function(request,response,error){
    //body expects:
    /*
        {
            postId: "",
            postType: "",
            parentId: "",//Optional
            userId: ""
        }
     */
    try{
        var action = request.params.type,
            body = request.body,
            postId = body.postId,
            PostSchema = new Post();

        Post.find({_id:postId}, function(err,data){
            console.log(data);

            if(data.length < 1){
                PostSchema.type = body.type;
                PostSchema.created = moment().valueOf();
                PostSchema.lastUpdated = moment().valueOf();
                PostSchema.parentId = body.parentId || '';
                PostSchema.reactions = {};
                PostSchema.reactions[body.userId] = {
                    lastUpdated: moment().valueOf(),
                    reactionType: action
                };
                PostSchema._id = postId;
                PostSchema.save(function (postError,insertedData) {
                    console.log(insertedData);
                    if(err){
                        response.send({err:err, isSuccess: false})
                    }
                    response.json({
                        isSuccess: true
                    });
                });
            }else{
                
                data[0]._doc.reactions[body.userId] = {
                    lastUpdated: moment().valueOf(),
                    reactionType: action
                };
                let dataSchema = new Post(data[0]);
                dataSchema._id = postId;
                dataSchema.save(function(err){
                    if(err){
                        response.send({err:err, isSuccess: false})
                    }
                    response.json({
                        isSuccess: true
                    });
                })
            }
        });
    }catch(error){
        response.send({
            error:error,
            isSuccess: false
        });
    }
};

//id = mongoose.Types.ObjectId().toString();