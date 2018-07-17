var actionEnum = require('../../enum/actions-enum'),
    Action = require('../../models/actions');

module.exports = function(request,response,error){
    try{
        var type = request.params.type,
            actionId = request.params.postId;
        switch (type){
            case actionEnum.like:
                if(actionId){
                    Action.findOne({ _id: actionId })
                            .then(function (doc) {
                                if (doc) {
                                    console.log(doc);
                                } else {
                                    console.log("no data exist for this id");
                                }
                            });
                }

                break;
            case actionEnum.dislike:
                break;
            default:
                response.send({
                    error:"Unknown Action",
                    isSuccess: false
                });
                break;
        }
    }catch(error){
        response.send({
            error:error,
            isSuccess: false
        });
    }
};