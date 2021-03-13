
var mongoose=require('mongoose');
var subjetSchema=mongoose.Schema({
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




module.exports=mongoose.model("subject",yearSchema);