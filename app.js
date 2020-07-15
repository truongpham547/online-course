var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var app = express();
var dotenv = require("dotenv");
var fs = require("fs");
var cors = require("cors");
var bodyParser = require("body-parser");
// var upload = require("express-fileupload");
var expressValidator = require('express-validator');
var commentController = require("./controller/comment.controller");
var axios = require("axios");

var server = require('http').createServer(app);
var io = require('socket.io')(server);


function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}


server.listen(9000, () => {
  console.log("server is running on port 9000");
});
var numUserOnline=0;
io.on('connection', (socket) => {
  addedUser=false;
  io.emit('connected',{
    "message":"one student join discuss"
  });

  socket.on('join discuss', (data) => {
    addedUser=true;
    socket.username=data.username;
    socket.idUser=data.idUser;
    socket.idCourse = data.idCourse;
    socket.image=data.image;
    socket.idLesson=data.idLesson;

    io.emit('new user join discuss', {
      username:socket.username,
      idUser:socket.idUser,
      idCourse:socket.idCourse,
      image:socket.image,
      idCourse:socket.idCourse,
      idLesson:socket.idLesson
    });
  });

  socket.on('add comment',async (data)=>{
    // console.log(data);    
    var imageName="";
    if(data.image!=""){
      const extention = data.image.substring("data:image/".length, data.image.indexOf(";base64"));
      const indexSlice = data.image.indexOf('base64') + 6;
      const imgBase64 = data.image.slice(indexSlice + 1,data.image.length-1);
      try{
        imageName=`${Date.now() + '-' + Math.round(Math.random() * 1E9)}.${extention}`;
        await fs.writeFile(`public/upload/comment_image/${imageName}`, imgBase64,'base64',(err=>{
          console.log(err);
        }));
      }catch(err){
        console.log(err);
      }
    }



    var reqData={
      idCourse:data.idCourse,
      idUser:data.idUser,
      idParent:data.idParent,
      content:data.content,
      idLesson:data.idLesson
      
    };

    var result= await axios.get("http://localhost:8000/predict-comment/"+removeAccents(data.content));
    console.log(result.data);

    if(result.data.result>0.5){
      console.log("vo van hoa");
      io.emit('notvalid',{
        message:"vo van hoa"
      });
    }else{
      try{
        var newComment= await commentController.addComment(reqData,imageName,"lesson");
      }catch(error){
        console.log(error);
      }
  
      io.emit('new comment',{
  
        idUser:{
          image:data.userImage,
          name:data.username
        },
        image:imageName,
        idCourse:data.idCourse,
        idLesson:data.idLesson,
        idParent:data.idParent=="null"?null:data.idParent,
        content: data.content,
        created_at:newComment.created_at,
        _id:newComment._id
      });
    }


  })
});


dotenv.config();
app.use(
  cors({ credentials: true, origin: true, exposedHeaders: ["auth-token"] })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use(upload());

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", indexRouter);



//connect mongodb

const { URL_DB_LOCAL, URL_DB_SERVER } = process.env;

mongoose.connect(
  `${URL_DB_LOCAL}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log("connect fail");
      console.log(err);
    } else {
      console.log("connected to mongodb");
    }
  }
);


module.exports = app;
