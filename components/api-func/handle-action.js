var actionEnum = require('../../enum/actions-enum');

module.exports = function(request,response,error){
    try{
        var type = request.params.type;
        switch (type){
            case actionEnum.like:
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