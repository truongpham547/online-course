const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const orderController = require("../../controller/order.controller");


Router.get("/get-list-course-ordered-by-id-user/:idUser",async(req,res,next)=>{
    try{
        let orders = orderController.getListCourseOrdered(req.params.idUser);
        res.status(200).send(orders);
    }catch(error){
        res.status(500).send({"message":"Lỗi server"});
    }
});

Router.get("/get-total-revenue-by-id-course/:idCourse", async (req,res,next)=>{
    try{
        let total = await orderController.getTotalRevenue(req.params.idCourse);
        res.status(200).send(total);
    }catch(err){
        console.log(err);
        res.status(500).send({"message":"Lỗi server"});
    }
});

Router.post("/test-pay", async (req,res,next)=>{
    try{
        let total = await orderController.createOrder({
            idCourse:"5ea0f7c99126c60278262fb2",
            idUser:"5ea19eab5d359b2b3855b64a",
            amount:20000
        });
        res.status(200).send(total);
    }catch(err){
        console.log(err);
        res.status(500).send({"message":"Lỗi server"});
    }
});

module.exports = Router;
