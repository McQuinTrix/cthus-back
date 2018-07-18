var actionEnum = require('../../enum/actions-enum');

module.exports = function(request,response,error){
    try{

    }catch(error){
        response.send({
            error:error,
            isSuccess: false
        });
    }
};