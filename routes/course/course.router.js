const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const CourseController = require("../../controller/course.controller");
var multer = require("multer");
var axios = require("axios");
const courseController = require("../../controller/course.controller");
const checkIsOwnerOfCourse = require("../../config/checkIsOwnerOfCourse");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/course_image");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

Router.post("/create", verifyToken, upload.single("image"), function (
  req,
  res,
  next
) {
  try {
    let courseData = req.body;
    let image;
    if (req.file == undefined) {
      return res.status(200).send({ status: "fail" });
    } else {
      image = req.file.filename;
    }
    courseData.iduser = req.user.id;
    courseData.image = image;
    CourseController.createCourse(courseData).then((result) => {
      return res.status(200).send(result);
    });
  } catch (error) {
    return res.status(500).send({ status: "error" });
  }
});

Router.get("/get-all", function (req, res, next) {
  CourseController.getCourses()
    .then((courses) => {
      return res.status(200).send(courses);
    })
    .catch((err) => {
      return res.status(500).send({ status: "error" });
    });
});

Router.get("/getby-category/:idcategory", function (req, res, next) {
  CourseController.getbyCategory(req.params.idcategory)
    .then((courses) => {
      return res.status(200).send(courses);
    })
    .catch((err) => {
      return res.status(500).send({ status: "error" });
    });
});

Router.get("/getbyid/:id", function (req, res, next) {
  CourseController.getbyId(req.params.id)
    .then((course) => {
      return res.status(200).send(course);
    })
    .catch((err) => {
      return res.status(500).send({ status: "error" });
    });
});

Router.get("/getby-iduser/:iduser", function (req, res, next) {
  CourseController.getbyIduser(req.params.iduser)
    .then((courses) => {
      return res.status(200).send(courses);
    })
    .catch((err) => {
      return res.status(500).send({ status: "error" });
    });
});

Router.get("/get-free", function (req, res, next) {
  CourseController.getfree()
    .then((courses) => {
      return res.status(200).send(courses);
    })
    .catch((err) => {
      return res.status(500).send({ status: "error" });
    });
});

Router.get("/get-top", function (req, res, next) {
  CourseController.gettop()
    .then((courses) => {
      return res.status(200).send(courses);
    })
    .catch((err) => {
      return res.status(500).send({ status: "error" });
    });
});

Router.delete("/delete/:id", verifyToken, function (req, res, next) {

  try {
    if(checkIsOwnerOfCourse(req.user,req.params.id)){
      CourseController.deleteCourse(req.params.id, req.user.id).then((result) => {
        return res.status(200).send(result);
      });
    }

  } catch (error) {
    return res.status(500).send({ status: "error" });
  }
});

Router.get("/permitCourse/:id", verifyToken, function (req, res, next) {
  try {
    CourseController.permitCourse(req.params.id, req.user.id).then((result) => {
      return res.status(200).send(result);
    });
  } catch (error) {
    return res.status(500).send({ status: "error" });
  }
});

Router.put("/update/:id", verifyToken, upload.single("image"), function (
  req,
  res,
  next
) {
  try {
    let courseData = req.body;
    let image;
    if (req.file == undefined) {
      image = null;
    } else {
      image = req.file.filename;
    }
    courseData.id = req.params.id;
    courseData.iduser = req.user.id;
    courseData.image = image;
    CourseController.updateCourse(courseData).then((result) => {
      return res.status(200).send(result);
    });
  } catch (error) {
    return res.status(500).send({ status: "error" });
  }
});

Router.get("/search-course/:str",async function (req, res, next) {
  try{
    var courses = await CourseController.searchCourse(req.params.str);
    res.status(200).send(courses);
  }catch(err){
    res.status(500).send({"message":"Lỗi server"});
  } 
});

Router.get("/recommend-course/:idCourse",async function (req, res, next) {
  try{

    axios.get("http://localhost:8000/get-recommend/"+req.params.idCourse).then(async (result)=>{
      let data=result.data;
      let ids=result.data.result;
      // console.log(res.data);
      let newIds=[];
      for(let i=0;i<ids.length;i++){
        newIds.push(ids[i]);
        if(i>6){
          break;
        }
      }
      let courseRecommend= await courseController.getCourseByArrayId(newIds);
      res.status(200).send(courseRecommend);
    }).catch(err=>{
      console.log(err);
      res.status(200).send({"result":[]});
    });

  }catch(err){
    res.status(500).send({"message":"Lỗi server"});
  } 
});


Router.put("/rate-course/:idCourse",verifyToken,async(req,res,next)=>{
  try{
    var ordered = await CourseController.checkIsBoughtThisCourse(req.user.id,req.params.idCourse);
    if(ordered.bought){
      let result = CourseController.rateCourse(req.params.idCourse,req.body);
    }else{
      res.status(500).send({"message":"Chưa mua thì không được rate"});
    }
    return res.status(200).send(result);
  }catch(error){
    console.log(error);
    res.status(500).send({"message":"Lỗi server"});
  }
});


Router.get("/check-is-bough-this-course/:idCourse/:idUser",async function (req, res, next) {
  try{
    var ordered = await CourseController.checkIsBoughtThisCourse(req.params.idUser,req.params.idCourse);
    res.status(200).send(ordered);
  }catch(err){
    res.status(500).send({"message":"Lỗi server"});
  } 
});


module.exports = Router;
