const fs=require('fs');
const path = require('path');
var categorySchema = require('../schema/category.schema');
var courseSchema = require('../schema/course.schema');

function addCategory(userData,image) {
  return new Promise((resolve, reject) => {
    categorySchema.findOne({name:userData.name}).then(result=>{
        if(result){
            return resolve({status:false,"message":"Danh mục đã tồn tại"});
        }else{
            let category = new categorySchema();
            category.name = userData.name;
            category.image=image;
            category.save().then(newCategory=>{
                return resolve({status:true,"category":newCategory});
            }).catch(err=>{
                return reject(err);
            })
        }
    }).catch(err=>{
        return reject(err);
    })

  });
}

function getCategory(id){
    return new Promise((resolve,reject)=>{
        categorySchema.findOne({_id:id}).then(category=>{
            return resolve(category);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function getCategories(){
    return new Promise((resolve,reject)=>{
        categorySchema.find().then(categories=>{
            return resolve(categories);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function deleteCategory(id){
    return new Promise((resolve,reject)=>{
        categorySchema.findOne({_id:id}).then(category=>{
            fs.unlink(path.join(__dirname, '../public/upload/category/')+category.image,(err)=>{
                console.log(err);
            });
            categorySchema.deleteOne({_id:id}).then(deletedCategory=>{
                return resolve(deletedCategory);
            }).catch(err=>{
                return reject(err);
            })
        }).catch(err=>{
            return reject(err);
        })

    })
}

function updateCategory(id,userData,image){
    return new Promise((resolve,reject)=>{
        categorySchema.findOne({name:userData.name}).then(result=>{
            if(result){
                return resolve({status:false,message:"danh mục đã tồn tại"});
            }else{
                categorySchema.findOneAndUpdate({_id:id},{name:userData.name,image:image},{new:true}).then(newCategory=>{
                    return resolve({status:true,category:newCategory});
                }).catch(err=>{
                    return reject(err);
                })
            }
        }).catch(err=>{
            return reject(err);
        })
    })
}

async function getTotalCourseEachCategory(){
    try{
        var result= await courseSchema.aggregate([
            {
                $group:{
                    _id:{
                        category:"$category"
                    },
                    "Total":{
                        $sum:1
                    }
                }
            },
        ]);
        return result;
    }catch(error){
        throw new Error(error);
    }
    
}

module.exports = {
    addCategory:addCategory,
    getCategory:getCategory,
    getCategories:getCategories,
    deleteCategory:deleteCategory,
    updateCategory:updateCategory,
    getTotalCourseEachCategory:getTotalCourseEachCategory
}
