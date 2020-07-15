const course = require("../schema/course.schema");
var courseModel = require("../model/course.model");
const fs = require("fs");
var path = require("path");
const courses = require("../schema/course.schema");
const orders = require("../schema/order.schema");

function createCourse(data) {
  return new Promise((resolve, reject) => {
    try {
      courseModel
        .create(data)
        .then((newCourse) => {
          if (!newCourse) {
            resolve({ status: "error DB" });
          }
          resolve({ status: "success", newCourse });
        })
        .catch((err) => {
          resolve({ status: "error", err });
        });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    courseModel
      .gets()
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getbyCategory(idcategory) {
  return new Promise((resolve, reject) => {
    courseModel
      .getbyCategory(idcategory)
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getbyIduser(iduser) {
  return new Promise((resolve, reject) => {
    courseModel
      .getbyIduser(iduser)
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getbyId(id) {
  return new Promise((resolve, reject) => {
    courseModel
      .getbyId(id)
      .then((course) => {
        return resolve(course);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getfree() {
  return new Promise((resolve, reject) => {
    courseModel
      .getfree()
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function gettop() {
  return new Promise((resolve, reject) => {
    courseModel
      .gettop()
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function deleteCourse(id, iduser) {
  return new Promise((resolve, reject) => {
    try {
      courseModel.delete(id, iduser).then((result) => {
        resolve(result);
      });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

function updateCourse(data) {
  return new Promise((resolve, reject) => {
    try {
      courseModel
        .update(data)
        .then((updated) => {
          if (!updated) {
            resolve({ status: "error DB" });
          }
          resolve({ status: "success", updated });
        })
        .catch((err) => {
          resolve({ status: "error", err });
        });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

function permitCourse(id, iduser) {
  return new Promise((resolve, reject) => {
    try {
      courseModel.permit(id, iduser).then((result) => {
        resolve(result);
      });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

async function searchCourse(str){
  try{
    var courses = await course.find({$text: {$search: str}}).limit(9);
    return courses;
  }catch(err){
    throw new Error(err);
  }
}

async function rateCourse(idCourse,dataUser){
  try{
      var courseDetail = await course.findOne({_id:idCourse});
      var totalVote = courseDetail.vote.totalVote;
      var EVGVote = courseDetail.vote.EVGVote;
      var idUserVote = courseDetail.vote.idUserVote;

      
      if(idUserVote.includes(dataUser.idUser)){
        return {"status":false,"message":"user voted"};
      }

      let totalStar =EVGVote*totalVote;
      let newEVGVote = (totalStar+dataUser.numStar)/(totalVote+1);
      var test=[];
      console.log(idUserVote.push(dataUser.idUser));
      test.push("asdasd");
      await course.findOneAndUpdate(
        { "_id": idCourse},
        { 
            "$set": {
                "vote.totalVote": totalVote+1,
                "vote.EVGVote":newEVGVote
                // "vote.idUserVote":test
            },
        },
        {upsert: true},
        function(err,doc) {
          if(err){
            console.log(err);
            throw new Error(err);
          }
          return doc;
        }
    );

  }catch(error){
      throw new Error(error);
  }
}

async function getCourseByArrayId(ids){
  try{
    var tmp=0;
    let arr=[]
    for(let i=0;i<ids.length;i++){
      tmp++;
      arr.push(await course.findOne({'_id':ids[i]}).populate("idUser",["name"],"users"));
      if(tmp>4){
        break;
      }
    }
    return arr;
  }catch(error){
    throw new Error(error);
  }
}

async function checkIsBoughtThisCourse(idUser,idCourse){
  try{
    let ordered= await orders.findOne({idUser:idUser,idCourse:idCourse});
    if(ordered){
      return {"bought":true};
    }else{
      return {"bought":false};
    }
  }catch(error){
    throw new Error(error);
  }
}

module.exports = {
  createCourse: createCourse,
  deleteCourse: deleteCourse,
  updateCourse: updateCourse,
  getCourses: getCourses,
  getbyCategory: getbyCategory,
  getbyIduser: getbyIduser,
  getfree: getfree,
  gettop: gettop,
  getbyId: getbyId,
  permitCourse: permitCourse,
  searchCourse:searchCourse,
  rateCourse:rateCourse,
  getCourseByArrayId:getCourseByArrayId,
  checkIsBoughtThisCourse:checkIsBoughtThisCourse
};
