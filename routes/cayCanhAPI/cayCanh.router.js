const Router = require("express").Router();
const commentController = require("../../controller/comment.controller");



Router.get("/get-recommend/:idProduct",async(req,res,next)=>{
    try{
        var comments =await commentController.getParentComment(req.params.idCourse,req.params.idLesson,req.params.skip,req.params.limit);
        return res.status(200).send(comments);
    }catch(error){
        console.log(error);
        res.status(500).send({"message":"Lỗi server"});
    }
    
});



module.exports = Router;
