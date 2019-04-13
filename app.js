const express    = require("express");
      app        = express();
      flash      = require("connect-flash");
      port       = process.env.PORT || 3000;
      bodyParser = require("body-parser");
      path       = require("path");
      methodOverride = require("method-override");
      commentRoutes = require("./routes/comments");
      campgroundRoutes = require("./routes/campgrounds");
      authRoutes = require("./routes/auth");
      landingRoute = require("./routes/landing");
      profileRoute = require("./routes/profilePages");
      dotenv     = require('dotenv').config(),
      URI        = `mongodb+srv://kelpCampCreator:${process.env.kelpCampCreatorPassword}@kelpcampapp-rwgto.mongodb.net/test?retryWrites=true`,
      mongoose   = require("mongoose");
      Campground = require("./models/campground");
      Comment    = require("./models/comment");
      User       = require("./models/user")
      passport   = require("passport");
      LocalStrategy = require("passport-local");
    //   User = require("./models/user");
      seedDB     = require("./seeds");
    //   seedDB(); //seed the database
      mongoose.connect(URI, { useNewUrlParser: true }, (err) => {
          if(err) {
              console.log(err.errors);
          } else {
              console.log("successully connected to database!")
          }
      });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname + "/assets")));
app.use(require("express-session")({
    secret: process.env.cookieSecret,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.locals.moment = require("moment");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//make currentUser available to all ejs templastes
//calls function on all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

router.use(function(req, res, next) {

    // log each request to the console
    console.log(req.method, req.url);

    // continue doing what we were doing and go to the route
    next(); 
});
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(authRoutes);
app.use("/", landingRoute);
app.use("/users", profileRoute);

//Auth Routes

app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})