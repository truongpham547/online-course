const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const rateDetailController = require("../../controller/rateDetail.controller");
var multer  = require('multer');
const { check, validationResult,body } = require('express-validator');
var joinController = require("../../controller/join.controller");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload/rate')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix+'-'+file.originalname )
    }
})

var upload = multer({ storage: storage });


let validateRate=[
    body('image').custom((value, { req }) => {
      if(req.file == undefined){
        return true;
      }else{
        var mimetype=req.file.mimetype;
        var type=mimetype.split("/")[1];
        if(type!="jpeg" && type!="png" && type!="jpg"){
          fs.unlink(path.join(__dirname, '../../public/upload/category/')+req.file.filename,(err)=>{
            console.log(err);
          });
          throw new Error('Các định dạng file yêu cầu là JPEG, PNG, JPG');
        }
        return true;
      }
    })
];

Router.post("/create-rate",[upload.single('image'),validateRate], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    if(! await joinController.checkIsCompleteCourse(req.body.idCourse,req.body.idUser)){
      return res.status(500).send({"message":"Bạn chưa hoàn thành hơn 80% khóa học"});
    }

    var fileName="";
    console.log(req.file);
    if(req.file==undefined){
        fileName="";
    }else{
        fileName=req.file.filename;
    }

    try {
        let rate = await rateDetailController.createRate(req.body,fileName);
        res.status(200).send(rate);
    } catch (err) {
        console.log('err',err);
      res.status(500).send(err);
    }
});

Router.get("/get-rate-by-user/:idUser", async (req, res) => {
    try {
        let rates = await rateDetailController.getRateByIdUser(req.params.idUser);
        res.status(200).send(rates);
    } catch (err) {
        console.log('err',err);
      res.status(500).send(err);
    }
});

Router.get("/get-rate-by-course/:idCourse", async (req, res) => {
    try {
        let rates = await rateDetailController.getRateByIdCourse(req.params.idCourse);
        res.status(200).send(rates);
    } catch (err) {
        console.log('err',err);
      res.status(500).send(err);
    }
});



module.exports = Router;
