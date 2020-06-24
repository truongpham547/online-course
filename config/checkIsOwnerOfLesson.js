var LessonSchema = require("../schema/lesson.schema");
var CourseSchema = require("../schema/course.schema");

module.exports=async function(user,idLesson){
    if(!user){
        return false;
    }
    try {
        var lessonDetail = await LessonSchema.findOne({_id:idLesson});
        try {
            var courseDetail = await CourseSchema.findOne({_id:lessonDetail.idCourse});
            if(courseDetail.idUser==user.id || user.role=='admin'){
                console.log("true in check own lesson");
                return true;
            }else{
                return false;
            }
        } catch (error) {
            throw new Error(error);
        }
    } catch (error) {
        throw new Error(error);
    }
    
}