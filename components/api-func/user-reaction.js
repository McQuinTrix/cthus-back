var Post = require('../../models/posts'),
    mongoose = require('mongoose');

module.exports = function(request,response,error){
    /* if(error){
        response.status(400).json({
            isSuccess: false,
            data: error
        })
        return;
    } */
    try{
        var userId = request.params.userId,
            body = request.body,
            PostSchema = new Post(),
            postIdArr = [];

        if(body.ids && Array.isArray(body.ids)){
            body.ids.forEach(function(element) {
                postIdArr.push(
                    element
                );
            });
        }else{
            response.status(400).json({
                isSuccess: false,
                data: {}
            });
            return;
        }

        Post.findMany(postIdArr,function(err,data){
            if(err){
                response.status(400).json({
                    isSuccess: false,
                    data: err
                });
                return;
            }else{
                response.status(200).json({
                    isSuccess: true,
                    data: data
                })
                return;
            }
            
        })

    }catch(error){
        console.error(error)
        response.status(400).json({
            isSuccess: false,
            data: error
        });
        return;
    }
}