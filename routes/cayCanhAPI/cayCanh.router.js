const Router = require("express").Router();
const commentController = require("../../controller/comment.controller");
const axios= require("axios");


Router.get("/get-recommend-cay-canh/:idProduct",async(req,res,next)=>{
    try{
        var result= await axios.get("http://127.0.0.1:8000/recommend-tree/"+req.params.idProduct);
        return res.status(200).send(result.data);
    }catch(error){
        console.log(error);
        res.status(500).send({"message":"Lỗi server"});
    }
    
});



module.exports = Router;
