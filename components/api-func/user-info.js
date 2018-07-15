var Account = require('../../models/account');

//--- Delete User Info
function deleteUserInfo(res,req){
    Account.remove({
        email: req.body.email
    }, function (err,bear) {
        if(err){
            res.send({err:err, isSuccess: false})
        }
        res.json({message: 'Value Deleted', isSuccess: true})
    })
}

//--- Get User Info
function getUserInfo(res,req) {
    var id = req.req.params.id,
        response = res.res,
        json;

    Account.findById(id, function (err,data) {
        if(err){
            response.send({err:err, isSuccess: false})
        }
        json = data._doc;
        
        //Delete important stuff
        delete json.password;
        delete json.pin;
        delete json.__v;

        response.json({
            message: 'User Information Retrieved',
            isSuccess: true,
            result:data._doc
        });
    });
}

module.exports = {
    getUserInfo: getUserInfo,
    deleteUserInfo: deleteUserInfo
}