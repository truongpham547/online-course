var CourseSchema = require("../schema/course.schema");

module.exports=async function(idUser,idCourse){
    try {
        var courseDetail = await CourseSchema.findOne({_id:idCourse});
        if(courseDetail.idUser==idUser){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        throw new Error(error);
    }
}