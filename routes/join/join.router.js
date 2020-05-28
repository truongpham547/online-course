const Router = require("express").Router();
// const verifyToken = require("../../middleware/verifyToken");
const joinController = require("../../controller/join.controller");

Router.post("/create-join", function(req, res, next) {
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
    var cookie = req.cookies.jwt;
    console.log(cookie);
        let userData = req.body;
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

module.exports=Router;