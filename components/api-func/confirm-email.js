var Account = require('../../models/account');

module.exports =  function confirmEmailFunc(request,response){
    Account.findById(request.params.id, function (err,data) {
        if(err){
            response.send({err:err, isSuccess: false});
        }

        data.emailConfirm = true;

        data.save(function(error){
            if(error){
                response.send({error:error, isSuccess: false});
            }
            response.json({message: 'Value Saved', isSuccess: true})
        })
    });
}