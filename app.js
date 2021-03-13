var express= require ("express");
var app=express();
const path = require('path');
var bodyParser= require ("body-parser");
var mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

var mongoDB = 'mongodb://localhost:27017/college_app';
mongoose.connect(mongoDB, {useNewUrlParser: true, 
              useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("Database connected");
});
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use(bodyParser.urlencoded({extended: true})); 

app.get("/",function(req,res){
    //this will be login signup page
    res.render("landingpage.ejs");

});

app.get("/home",function(req,res){
    //this will be login signup page
   
         res.render("Homepage.ejs");
        
    });

app.get("/register",function(req,res){
        //this will be login signup page
    res.render("register.ejs");
      
      
});
      
app.get("/login",function(req,res){
        //this will be login signup page
 res.render("login.ejs");
});


    app.listen(3001,function()

    {
        console.log("yelpcamp started");
    });