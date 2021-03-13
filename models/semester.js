var mongoose=require('mongoose');

var semesterSchema=new mongoose.Schema({
    name:String,
    image:String,
    description: String,
   
    year:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "year"
        }
    ],
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
});
module.exports=mongoose.model("semester",semesterSchema);