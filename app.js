var express= require ("express");
var app=express();
const path = require('path');
var bodyParser= require ("body-parser");
var year=require("./models/year");
var semester=require("./models/semester");
const Travel=require("./models/travel");
const Cab=require("./models/cab");
var mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/college_app';
mongoose.connect(mongoDB, {useNewUrlParser: true, 
              useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("Database connected");
});
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

// app.use(express.static(__dirname + "/views"));
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
// app.get("/travel",function(req,res){
//     //this will be login signup page
//     res.render("travel.ejs", {travels} );
  
  
//   });
app.get("/travel", async (req, res) => {
  const travels = await Travel.find({});
  res.render("travel.ejs", {travels});
})

app.get("/cab", async (req, res) => {
  const cabs = await Cab.find({});
  res.render("cab.ejs", {cabs});
})

  app.get("/notes",function(req,res){
    //this will be login signup page
    semester.find({},function(err,allCampgrounds){
      if(err)
      {
          console.log(err);
      }
      else
      {
       res.render("notes.ejs",{semester:allCampgrounds});
      }
  
  });
});
  
  app.post("/notes",function(req,res){
    var image=req.body.image;
    var name=req.body.name;
   

    var newImg={name:name ,image:image};
    semester.create(newImg,function(err,camp)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("yipee added new");
            res.redirect("/notes");
        }
    });
    });
    app.post("/notes/:id",function(req,res){
      semester.findById(req.params.id,function(err,semester){
          if(err)
          {
              console.log(err);
              res.redirect("/notes");
          }
          else{
            var name=req.body.year;
             console.log(req.body);
            var newImg={name:name };
            year.create(newImg,function(err,com){
              if(err)
              console.log(err);
              else{
                  semester.year.push(com);
            semester.save();
                res.redirect("/notes/" +semester._id);
           
          }
      })
      }
    })
  })
    app.get("/notes/new",function(req,res){
        res.render("new_sem.ejs"); 
    });
    app.get("/notes/:id/new",function(req,res){
      semester.findById(req.params.id,function(err,campground){
          if(err)
          console.log(err);
          else
          
          res.render("new_year.ejs",{sem: campground});
      })
     
  });

    app.get("/notes/:id",function(req,res){
      var years=[];



        semester.findById(req.params.id, function(err,foundCampground)
        {
       let n=foundCampground.year.length;
         let i=0;
            if(err)
               console.log(error);
            else{

              console.log(foundCampground.year);
              
              foundCampground.year.forEach(function(y)
              {
                
                year.findById(y, function(err,year)
                {
                    if(err)
                       console.log(error);
                    else{
                     
                     i++;
                      years.push(year);
                      console.log(years);
                      if(i==n)
                    
                        res.render("show.ejs",{sem:foundCampground , years:years});
                 } })
               
              } 
        )
      
    }
    if(n==0)
    res.render("show.ejs",{sem:foundCampground , years:years});
  }
   
       
   
  );

    });

    app.get("/travel/new",function(req,res){
      //this will be login signup page
      res.render("new_travel.ejs" );
    });
    app.get("/cab/new",function(req,res){
      //this will be login signup page
      res.render("new_cab.ejs" );
    });

    app.post("/travel",function(req,res){
      var image=req.body.image;
      var title=req.body.title;
      var description=req.body.description;
     
  
      var newImg={title:title ,image:image, description: description};
      Travel.create(newImg,function(err,camp)
      {
          if(err)
          {
              console.log(err);
          }
          else
          {
              console.log("yipee added new");
              res.redirect("/travel");
          }
      });
      });

      app.post("/cab",function(req,res){
        var name=req.body.name;
        var title=req.body.title;
        var destination=req.body.destination;
        var location=req.body.location;
       
    
        var newImg={title:title ,name:name, destination: destination, location: location}
        Cab.create(newImg,function(err,camp)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log("yipee added new");
                console.log(camp);
                res.redirect("/cab");
            }
        });
        });

app.listen(3007,function()

{
    console.log("yelpcamp started");
});
