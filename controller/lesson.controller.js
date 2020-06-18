const lessonSchema = require('../schema/lesson.schema');
const fs=require('fs');
const path= require('path');

function createLesson(docs,video,data){
    return new Promise((resolve,reject)=>{
        let lesson = new lessonSchema();
        lesson.doc=docs;
        lesson.video=video;
        lesson.idCourse=data.idCourse;
        lesson.title = data.title;
        lesson.order = data.order;
        lesson.save().then(newLesson=>{
            resolve(newLesson);
        }).catch(err=>{
            reject(err);
        })
    });
}

function getLessonByCourseId(idCourse){
    return new Promise((resolve,reject)=>{
        lessonSchema.find({idCourse:idCourse}).select('-multipleChoices.answer').sort({order:1}).then(lesson=>{
            return resolve(lesson);
        }).catch(err=>{
            return reject(err);
        })
    });
}

function deleteLesson(idLesson){
    return new Promise((resolve,reject)=>{
        lessonSchema.deleteOne({_id:idLesson}).then(deleted=>{
            return resolve(deleted);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function updateLesson(idLesson,data){
    return new Promise((resolve,reject)=>{
        let updateOption={                
            title:data.title,
            order:data.order,
            idCourse:data.idCourse
        };

        lessonSchema.findOneAndUpdate({_id:idLesson},updateOption,{new:true}).then(newLesson=>{
            return resolve(newLesson);
        }).catch(err=>{
            return reject(err);
        });
    });
}

function deleteFileOfLesson(idLesson,fileName){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {$pull: {doc: fileName}},
            {new: true},
            function(err,result){
                if(err){
                    return reject(err);
                }
                fs.unlink(path.join(__dirname, '../public/upload/lesson/')+fileName,(err)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve({"message":"Deleted"});
                    }
                });
            }
        );
    });
}

function deleteMultipleChoice(idLesson,idMultipleChoice){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOne({_id:idLesson}).then(oldDoc=>{
            for(let i=0;i<oldDoc.multipleChoices.length;i++){
                if(oldDoc.multipleChoices[i]._id==idMultipleChoice){
                    if(oldDoc.multipleChoices[i].image==undefined){
                        lessonSchema.findOneAndUpdate(
                            {_id: idLesson},
                            {$pull: {multipleChoices: {_id:idMultipleChoice}}},
                            {new: true},
                            function(err,result){
                                if(err){
                                    return reject(err);
                                }
                                return resolve(result);
                            }
                        );
                    }else{
                        fs.unlink(path.join(__dirname, '../public/upload/lesson/')+oldDoc.multipleChoices[i].image,(err)=>{
                            if(err){
                                reject(err);
                            }else{
                                lessonSchema.findOneAndUpdate(
                                    {_id: idLesson},
                                    {$pull: {multipleChoices: {_id:idMultipleChoice}}},
                                    {new: true},
                                    function(err,result){
                                        if(err){
                                            return reject(err);
                                        }
                                        return resolve(result);
                                    }
                                );
                            }
                        });
                        break;
                    }

                }
                
            }
        }).catch(err=>{
            reject(err);
        })

    })
}

function addAnMultipleChoice(idLesson,multipleChoice){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {$push: {multipleChoices: multipleChoice}},
            {new: true},
            function(err,result){
                if(err){
                    return reject(err);
                }
                return resolve(result);
            }
        );
    })
}

function addVideo(idLesson,video){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOne({_id:idLesson}).then(lesson=>{
            fs.unlink(path.join(__dirname, '../public/upload/lesson/')+lesson.video,(err)=>{
                if(err){
                    reject(err);
                }else{
                    lessonSchema.findOneAndUpdate({_id: idLesson},{
                        video:video
                    },{new: true}).then(newLesson=>{
                        resolve(newLesson);
                    }).catch(err=>{
                        reject(err);
                    });
                }
            });
        }).catch(err=>{
            reject(err);
        });
    })
}

function addDoc(idLesson,doc){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {$push: {doc: doc}},
            {new: true},
            function(err,result){
                if(err){
                    console.log(err);
                    return reject(err);
                }
                console.log(result)
                return resolve(result);
            }
        );
    })
}

function addListMultipleChoice(idLesson,multipleChoice){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {multipleChoices: multipleChoice},
            {new: true},
            function(err,result){
                if(err){
                    return reject(err);
                }
                return resolve(result);
            }
        );
    })
}

function addMoreListMultipleChoice(idLesson,multipleChoice){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {$push: {multipleChoices: multipleChoice}},
            {new: true},
            function(err,result){
                if(err){
                    return reject(err);
                }
                return resolve(result);
            }
        );
    })
}

async function getLessonById(idLesson,isOwner){
    try {
        if(isOwner){
            var result = await lessonSchema.findOne({_id: idLesson});
        }else{
            var result = await lessonSchema.findOne({_id: idLesson}).select('-multipleChoices.answer');
        }
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

function deleteImageMultipleChoice(image){
    return new Promise((resolve,reject)=>{
        fs.unlink(path.join(__dirname, '../public/upload/lesson/')+image,(err)=>{
            if(err){
                reject(err);
            }else{
                resolve({"message":"Deleted"});
            }
        });
    });
}


function addListPopupQuestion(idLesson,popupQuestion){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {popupQuestion: popupQuestion},
            {new: true},
            function(err,result){
                if(err){
                    return reject(err);
                }
                return resolve(result);
            }
        );
    })
}


function deletePopupQuestion(idLesson,idPopupQuestion){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOne({_id:idLesson}).then(oldDoc=>{
            for(let i=0;i<oldDoc.popupQuestion.length;i++){
                if(oldDoc.popupQuestion[i]._id==idPopupQuestion){
                    if(oldDoc.popupQuestion[i].image==undefined){
                        lessonSchema.findOneAndUpdate(
                            {_id: idLesson},
                            {$pull: {popupQuestion: {_id:idPopupQuestion}}},
                            {new: true},
                            function(err,result){
                                if(err){
                                    return reject(err);
                                }
                                return resolve(result);
                            }
                        );
                    }else{
                        fs.unlink(path.join(__dirname, '../public/upload/lesson/')+oldDoc.popupQuestion[i].image,(err)=>{
                            if(err){
                                reject(err);
                            }else{
                                lessonSchema.findOneAndUpdate(
                                    {_id: idLesson},
                                    {$pull: {popupQuestion: {_id:idPopupQuestion}}},
                                    {new: true},
                                    function(err,result){
                                        if(err){
                                            return reject(err);
                                        }
                                        return resolve(result);
                                    }
                                );
                            }
                        });
                        break;
                    }
                }
                
            }
        }).catch(err=>{
            reject(err);
        })

    })
}

async function getMultipleChoiceOfLesson(idLesson){
    try{
        var lesson= await lessonSchema.findOne({_id:idLesson});
        return lesson;
    }catch(error){
        throw new Error(error);
    }
    
}

async function getMultipleChoiceForTest(idLesson){
    try {
        var mul= await lessonSchema.find({_id:idLesson}).select('multipleChoices.A multipleChoices.B multipleChoices.C multipleChoices.D multipleChoices.question multipleChoices.image multipleChoices._id');
        return mul;
    } catch (error) {
        throw new Error(error);
    }
}

async function checkTest(reqData){
    try {        
        var lessonInfo= await lessonSchema.findOne({_id:reqData.idLesson});
        var userTest=reqData.test;

        var multipleChoices = lessonInfo.multipleChoices;
        console.log(multipleChoices);
        console.log(userTest);

        var resultMul = Array();
        var totalRight=0;
        var totalWrong=0;
        for(let i=0;i<userTest.length;i++){
            multipleChoices.find((mul)=>{
                if(mul._id==userTest[i]._id){
                    if(mul.answer.toLowerCase()== userTest[i].answer.toLowerCase()){
                        resultMul.push({
                            "_id":userTest[i]._id,
                            "userAnswer":userTest[i].answer,
                            "sysAnswer":mul.answer,
                            "result":true
                        });
                        totalRight+=1;
                    }else{
                        resultMul.push({
                            "_id":userTest[i]._id,
                            "userAnswer":userTest[i].answer,
                            "sysAnswer":mul.answer,
                            "result":false
                        });
                        totalWrong+=1;
                    }
                }
            });
        }
        var result={
            "multipleChoices":resultMul,
            "totalRight":totalRight,
            "totalWrong":totalWrong
        };
        return result;
        
    } catch (error) {
        throw new Error(error);
    }
}


module.exports={
    createLesson:createLesson,
    getLessonByCourseId:getLessonByCourseId,
    deleteLesson:deleteLesson,
    updateLesson:updateLesson,
    deleteFileOfLesson:deleteFileOfLesson,
    deleteMultipleChoice:deleteMultipleChoice,
    addAnMultipleChoice:addAnMultipleChoice,
    addVideo:addVideo,
    addDoc:addDoc,
    addListMultipleChoice:addListMultipleChoice,
    getLessonById:getLessonById,
    deleteImageMultipleChoice:deleteImageMultipleChoice,
    addListPopupQuestion:addListPopupQuestion,
    deletePopupQuestion:deletePopupQuestion,
    addMoreListMultipleChoice:addMoreListMultipleChoice,
    getMultipleChoiceOfLesson:getMultipleChoiceOfLesson,
    getMultipleChoiceForTest:getMultipleChoiceForTest,
    checkTest:checkTest
}