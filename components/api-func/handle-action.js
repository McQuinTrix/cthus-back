var actionEnum = require('../../enum/actions-enum');

module.exports = function(request,response,error){
    try{
        var action = request.params.type,
            body = request.body;
        
            response.send({
                isSuccess: true
            })
    }catch(error){
        response.send({
            error:error,
            isSuccess: false
        });
    }
};