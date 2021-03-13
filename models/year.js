var mongoose=require('mongoose');
var yearSchema=mongoose.Schema({
    name:Number,
  /*  author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    subject:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subject"
        }
    ],
    */
});




module.exports=mongoose.model("year",yearSchema);