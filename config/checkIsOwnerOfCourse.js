var CourseSchema = require("../schema/course.schema");

module.exports=async function(user,idCourse){
    if(!user){
        return false;
    }
    if(user.role=="admin"){
        return true;
    }
    try {
        var courseDetail = await CourseSchema.findOne({_id:idCourse});
        if(courseDetail.idUser==user.id || user.role=="admin"){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        throw new Error(error);
    }
}