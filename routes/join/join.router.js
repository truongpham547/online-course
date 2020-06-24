const Router = require("express").Router();
// const verifyToken = require("../../middleware/verifyToken");
const joinController = require("../../controller/join.controller");
const orderController = require("../../controller/order.controller");

Router.post("/create-join", async function(req, res, next) {

    try{
        var orderDetail = await orderController.getOrderByIdUserAndIdCourse(req.idUser,req.idCourse);
    }catch(err){
        console.log(err);
        return res.status(500).send({message:"Lỗi Server"}); 
    }

    if(courseDetail.price!=0){
        if(orderDetail==null){
            return res.status(500).send({message:"Bạn chưa thanh toán khóa học"});
        }
    }

    let userData = req.body;
    joinController.joinCourse(userData).then(result => {
        if(result.status){
            return res.status(200).send(result.data);
        }else{
            return res.status(500).send({message:result.message});
        }
    }).catch (error=>{
        console.log(error)
        return res.status(500).send({message:"Lỗi Server"});
    });
    
});

Router.get("/get-courses-joined-by-user/:id",function(req, res, next) {
    let id = req.params.id;
    joinController.getCoursesJoinedByIdUser(id).then(result => {
        return res.status(200).send(result);
    }).catch (error=>{
        console.log(error)
        return res.status(500).send({message:"Lỗi Server"});
    });
});

Router.put("/update-progress-lesson-of-course/:idUser/:idCourse/:idLesson",function(req,res,next){
    joinController.updateProgressLesson(req.params.idUser,req.params.idCourse,req.params.idLesson,req.body).then(data=>{
        res.status(200).send(data);
    }).catch(err=>{
        console.log(err);
        res.status(500).send({message:"Lỗi Server"});
    });
});

Router.get("/get-total-student-join-course/:idCourse",async function(req,res,next){
    try{
        let total = await joinController.getTotalStudentJoinCourse(req.params.idCourse);
        res.status(200).send(total);
    }catch(err){
        console.log(err);
        res.status(500).send({message:"Lỗi Server"});
    }
});

Router.get("/get-progress-course-join-by-idUser-and-idCourse/:idUser/:idCourse",async function (req, res, next) {
    try{
      var joinDetail = await joinController.getCourseProgressJoinByIdUser(req.params.idCourse,req.params.idUser);
      res.status(200).send(joinDetail);
    }catch(err){
      res.status(500).send({"message":"Lỗi server"});
    } 
});

Router.get("/get-summary-join-this-year",async function (req, res, next) {
    try{
        var joinDetail = await joinController.getTotalJoinCourseGroupByMonth();
        res.status(200).send(joinDetail);
    }catch(err){
        console.log(err);
        res.status(500).send({"message":"Lỗi server"});
    } 
});

Router.get("/get-list-lesson-completed/:idUser/:idCourse",async (req,res,next)=>{
    try{
        var listCompleted = await joinController.getListLessonCompleted(req.params.idUser,req.params.idCourse);
        res.status(200).send(listCompleted);
    }catch(err){
        console.log(err);
        res.status(500).send({"message":"Lỗi server"});
    } 
});

module.exports=Router;