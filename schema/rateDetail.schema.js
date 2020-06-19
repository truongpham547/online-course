const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user = require("./user.schema");
const category = require("./category.schema");

const rateSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: user,
    required: true,
  },
  idCourse: {
    type: Schema.Types.ObjectId,
    ref: 'course',
    required: true,
  },
  numStar:{
    type:Number,
    required:true
  },
  content:{
    type:String,
    required:true
  },
  create_at: {
    type:Date,
    required:true,
    default:Date.now()
  },
  image:{
    type:String,
    required:false,
    default:""
  }
});

const courses = mongoose.model("rate", rateSchema);
module.exports = courses;
