var LessonSchema = require("../schema/lesson.schema");
var CourseSchema = require("../schema/course.schema");

module.exports=async function(idUser,idLesson){
    try {
        var lessonDetail = await LessonSchema.findOne({_id:idLesson});
        try {
            var courseDetail = await CourseSchema.findOne({_id:lessonDetail.idCourse});
            if(courseDetail.idUser==idUser){
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