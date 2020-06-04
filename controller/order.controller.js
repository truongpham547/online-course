var orderSchema = require("../schema/order.schema");
const fs=require('fs');
const path = require('path');
const mongoose = require("mongoose");

async function createOrder(reqData) {
    try {
        var order = new orderSchema();
        order.idUser= reqData.idUser;
        order.idCourse = reqData.idCourse;
        order.amount=reqData.amount;
        let newOrder = await order.save();
        return newOrder;
    } catch (error) {
        throw new Error(error);
    }
}

async function getListCourseOrdered(idUser){
    try{
        let orders =await orderSchema.find({idUser:idUser})
            .populate("idUser",["email","name","image"],"users")
            .populate("idCourse",["vote","price","discount","description","goal","image","name"],"courses");
        return orders;
    }catch(err){
        throw new Error(err);
    }
}

async function getOrderByIdUserAndIdCourse(idUser,idCourse){
    try{
        let order = await orderSchema.findOne({idUser:idUser,idCourse:idCourse});
        return order;
    }catch(err){
        throw new Error(err);
    }
}

async function getTotalRevenue(idCourse){
    try{
        let total = await orderSchema.aggregate([
            {
                $match:{
                    "idCourse":mongoose.Types.ObjectId(idCourse)
                }
            },
            {
                $group:{
                    _id:null,
                    "Total":{
                        $sum:"$amount"
                    }
                }
            }
        ]);
        return total;
    }catch(err){
        throw new Error(err);
    }
}



module.exports = {
    createOrder:createOrder,
    getListCourseOrdered:getListCourseOrdered,
    getOrderByIdUserAndIdCourse:getOrderByIdUserAndIdCourse,
    getTotalRevenue:getTotalRevenue
}
