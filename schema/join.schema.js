const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const users = require("./user.schema");
const courses = require("./course.schema")

const joinSchema =new Schema({
    idUser:{
        type:Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    idCourse:{
        type:Schema.Types.ObjectId,
        ref:'courses',
        required:true
    },
    percentCompleted:{
        type:Number,
        default:0
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
});

const joins = mongoose.model("joins",joinSchema);
module.exports=joins;