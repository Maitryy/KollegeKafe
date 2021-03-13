
var mongoose=require('mongoose');
var subjectSchema=mongoose.Schema({
    name:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    pdf:[String]
});




module.exports=mongoose.model("subject",subjectSchema);