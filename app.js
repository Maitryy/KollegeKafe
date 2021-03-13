var express= require ("express");
var app=express();
const path = require('path');
var bodyParser= require ("body-parser");
var year=require("./models/year");
var methodOverride=require('method-override');
var semester=require("./models/semester");
var subject=require("./models/subject");
const Travel=require("./models/travel");
const Cab=require("./models/cab");
var mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
var flash=require('connect-flash');
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user"); 
//Set up default mongoose connection
var mongoDB ="mongodb+srv://riyag051299:riyag051299@cluster0.bhr2h.mongodb.net/college_app?retryWrites=true&w=majority";
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


app.use(methodOverride("_method"));
app.use(flash());


app.use(require("express-session")({
   secret:"vibhu bola h",
   resave:false,
   saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//To use in all the things
app.use(function(req,res, next){
    res.locals.currentUser= req.user;
    res.locals.error=req.flash("error"); 
    res.locals.success=req.flash("success"); 
    next();
});



app.get("/",function(req,res){
    //this will be login signup page
    res.render("landingpage.ejs",{ currentUser: req.user});

});

app.get("/home",isLoggedIn,function(req,res){
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

app.post("/login",passport.authenticate("local", 
{
    successRedirect:"/home",
    failureRedirect:"/login"
}),
 function(req,res){

 });
 app.post("/register",function(req,res){

  var newUser=new User({username: req.body.username}); 
  User.register(newUser, req.body.password, function(err, user){
      if(err)
      {
          console.log(err);
          req.flash("error", "please try something else");
          return res.render("register.ejs")
      }
      passport.authenticate("local")(req,res,function(){
        req.flash("success", "Welcome to yelpcamp "+ user.username); 
          res.redirect("/home");
      });
  });

});

//Logout route
app.get("/logout",isLoggedIn,function(req,res){
    req.logout();
    req.flash("success", "Logged you out!!");
  
    res.redirect("/home");
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
  app.post("/notes/:id/:id2",function(req,res){
    semester.findById(req.params.id,function(err,semester){
        if(err)
        {
            console.log(err);
            res.redirect("/notes");
        }
        else{
          year.findById(req.params.id2,function(err,year){
            if(err)
            {
                console.log(err);
                res.redirect("/notes");
            }
            else{
          var name=req.body.year;
           console.log(req.body);
          var newImg={name:name };
          subject.create(newImg,function(err,com){
            if(err)
            console.log(err);
            else{

               year.subject.push(com);
          year.save();
          semester.save();
              res.redirect("/notes/" +semester._id + "/" + year._id) ;
         
        }
    })
    }
  })}
})})

app.post("/notes/:id/:id2/:id3",function(req,res){
  semester.findById(req.params.id,function(err,semester){
      if(err)
      {
          console.log(err);
          res.redirect("/notes");
      }
      else{
        year.findById(req.params.id2,function(err,year){
          if(err)
          {
              console.log(err);
              res.redirect("/notes");
          }
          else{

            subject.findById(req.params.id3,function(err,subject){
              if(err)
              {
                  console.log(err);
                  res.redirect("/notes");
              }
              else{
                console.log(req.body.year);
        var name=req.body.year.toString();
        console.log(subject);
         console.log(name);
       subject.pdf.push(name);
       subject.save();
        year.save();
        semester.save();
            res.redirect("/notes/" +semester._id + "/" + year._id + "/" + subject._id) ;
       
      }
  })
  }
})}
})})
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
  app.get("/notes/:id/:id2/new",function(req,res){
    semester.findById(req.params.id,function(err,campground){
        if(err)
        console.log(err);
        else
        {
          year.findById(req.params.id2,function(err,year){
            if(err)
            console.log(err);
            else
            res.render("new_subject.ejs",{sem: campground , year:year});
        })
       
    }})

   
});


app.get("/notes/:id",function(req,res){
  var years=[];



    semester.findById(req.params.id, function(err,foundCampground)
    {
  
        if(err)
           console.log(error);
        else{
          let n=foundCampground.year.length;
          let i=0;

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
    if(n==0)
    res.render("show.ejs",{sem:foundCampground , years:years});
}

}

   

);

});
    app.get("/notes/:id/:id2",function(req,res){
      var subjects=[];
      var years=[];


        semester.findById(req.params.id, function(err,foundCampground)
        {
      
            if(err)
               console.log(err);
            else{
              year. findById(req.params.id2, function(err,foundYear)
              {
                if(err)
                     console.log(err);
 
                     else{
              
             let n=foundYear.subject.length;
             console.log(n);
               let i=0;
                 
              foundYear.subject.forEach(function(y)
              {
                
                subject.findById(y, function(err,year)
                {
                    if(err)
                       console.log(err);
                    else{
                     
                     i++;
                      subjects.push(year);
                    
                      if(i==n)
                      
                        res.render("show_year.ejs",{sem:foundCampground , year:foundYear ,subjects:subjects});
                 } })
               
              } 
        )
        if(n==0)
    res.render("show_year.ejs",{sem:foundCampground , year:foundYear ,subjects:subjects});
    }
  
  })}
   
       
   
 } );

    });
    app.get("/notes/:id/:id2/:id3",function(req,res){
      var pdf=[];
      


        semester.findById(req.params.id, function(err,foundCampground)
        {
      
            if(err)
               console.log(err);
            else{
              year. findById(req.params.id2, function(err,foundYear)
              {
                if(err)
                     console.log(err);
 
                     else{
                      subject. findById(req.params.id3, function(err,subject)
                      {
                        if(err)
                             console.log(err);
         
                             else{
              
             let n=subject.pdf.length;
             console.log(n);
               let i=0;
                 
               subject.pdf.forEach(function(y)
              {
                
                    if(err)
                       console.log(err);
                    else{
                     
                     i++;
                      pdf.push(y);
                    
                      if(i==n)
                      
                        res.render("subject.ejs",{sem:foundCampground , year:foundYear ,subject:subject,pdf:pdf});
                 } })
                 if(n==0)
                 res.render("subject.ejs",{sem:foundCampground , year:foundYear ,subject:subject,pdf:pdf});
              } } )}}
       );
    }
  
  })}
   
       
   
  );
  app.get("/notes/:id/:id2/:id3/new",function(req,res){
  

      semester.findById(req.params.id, function(err,foundCampground)
      {
    
          if(err)
             console.log(err);
          else{
            year. findById(req.params.id2, function(err,foundYear)
            {
              if(err)
                   console.log(err);

                   else{
                    subject. findById(req.params.id3, function(err,subject)
                    {
                      if(err)
                           console.log(err);
       
                           else{
           
                    
                      res.render("upload_file.ejs",{sem:foundCampground , year:foundYear ,subject:subject});
            
            } }

      )}}
     );
  }

})} 
);

   
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
      var name=req.body.name;
     
  
      var newImg={title:title ,image:image, description: description, name:name};
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
        var location1=req.body.location1;
        var location2=req.body.location2;
        var contact=req.body.contact;
       
    
        var newImg={title:title ,name:name, location1: location1, location2: location2, contact: contact}
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
        function isLoggedIn(req,res,next){
          if(req.isAuthenticated()){
              return next();
          }
          req.flash("error" , "You need to be logged in to do that!");
          res.redirect("/login");
        }

app.listen(3002,function()

{
    console.log("yelpcamp started");
});
