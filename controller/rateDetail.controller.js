const rateDetailSchema= require("../schema/rateDetail.schema");
const courseSchema = require("../schema/course.schema");
const courses = require("../schema/course.schema");

async function createRate(dataUser,image){

    var courseDetail = await courseSchema.findOne({_id:dataUser.idCourse});
    var totalVote = courseDetail.vote.totalVote;
    var EVGVote = courseDetail.vote.EVGVote;

    
    let totalStar =EVGVote*totalVote;
 



    var isRated= await rateDetailSchema.findOne({idUser:dataUser.idUser,idCourse:dataUser.idCourse}).sort({create_at:-1});
    // console.log(isRated);
    if(isRated){
        try {
            var newEVGVote = (totalStar+dataUser.numStar-isRated.numStar)/(totalVote);
            console.log(totalStar,dataUser.numStar,isRated.numStar,totalVote,newEVGVote);
            try {
                await courseSchema.findOneAndUpdate(
                    {_id:dataUser.idCourse},
                    {
                        "vote.totalVote": totalVote,
                        "vote.EVGVote":newEVGVote
                    },
                    {new: true},
                    function(err,doc) {
                      if(err){
                        console.log(err);
                        throw new Error(err);
                      }
                    //   return doc;
                  });
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
            // await rateDetailSchema.findOneAndUpdate({idUser:dataUser.idUser,idCourse:dataUser.idCourse},{numStar:dataUser.numStar});
        } catch (error) {
            throw new Error(error);
        }
    }else{
        try {
            var newEVGVote = (totalStar+dataUser.numStar)/(totalVote+1);
            try {
                await courseSchema.findOneAndUpdate(
                    {_id:dataUser.idCourse},
                    {
                        "vote.totalVote": totalVote+1,
                        "vote.EVGVote":newEVGVote
                    },
                    {new: true},
                    function(err,doc) {
                      if(err){
                        console.log(err);
                        throw new Error(err);
                      }
                    //   return doc;
                  });
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }

        } catch (error) {
            throw new Error(error);
        }

    }
    var rate = new rateDetailSchema();
    rate.idUser=dataUser.idUser;
    rate.numStar = dataUser.numStar;
    rate.idCourse = dataUser.idCourse;
    rate.content = dataUser.content;
    rate.image=image;
    let newRate = await rate.save();
    return newRate;
} 




async function getRateByIdUser(idUser){
    try {
        let rates = await rateDetailSchema.find({idUser:idUser}).sort({create_at:-1});
        return rates;
    } catch (error) {
        throw new Error(error);
    }
} 

async function getRateByIdCourse(idCourse){
    try {
        let rates = await rateDetailSchema.find({idCourse:idCourse}).sort({create_at:-1})
                    .populate("idUser",["name","image"],"users")
        ;
        return rates;
    } catch (error) {
        throw new Error(error);
    }
} 



module.exports={
    createRate:createRate,
    getRateByIdUser:getRateByIdUser,
    getRateByIdCourse:getRateByIdCourse
}