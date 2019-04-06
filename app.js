const express    = require("express"),
      app        = express(),
      port       = process.env.PORT || 3000,
      bodyParser = require("body-parser"),
      path       = require("path"),
      dotenv     = require('dotenv').config(),
      URI        = `mongodb+srv://kelpCampCreator:${process.env.kelpCampCreatorPassword}@kelpcampapp-rwgto.mongodb.net/test?retryWrites=true`,
      mongoose   = require("mongoose");
      Campground = require("./models/campground");
      Comment = require("./models/comment");
    //   User = require("./models/user");
      seedDB     = require("./seeds");
      seedDB();
      mongoose.connect(URI, { useNewUrlParser: true }, (err) => {
          if(err) {
              console.log(err.errors);
          } else {
              console.log("successully connected to database!")
          }
      })

    //   Campground.create({
    //       name: "Blooper Mountain", 
    //       image: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", 
    //       description: "This is a peaceful mountain where all curse words have been filtered"}, (err, campground) => {
    //       if(err) console.log(err);
    //       else console.log('successfully created new campground: ', campground);
    //   })

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname + "/assets")));

app.get("/", (req, res, next) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res, next) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err) console.log(err);
        else res.render("campgrounds/index", {campgrounds: allCampgrounds});
    })
})

app.post("/campgrounds", (req, res, next) => {
    //get data from forms and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = {name, image, description};
    //create a newCampground and save to db
    Campground.create(newCampground, (err, newCampgroundCreated) => {
        if(err) console.log(err);
        else res.redirect("/campgrounds");
        console.log('Successfully created a new campground... ', newCampgroundCreated);
    })
    //redirect back to campgrounds page
})

app.get("/campgrounds/new/", (req, res, next) => {
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id", (req, res, next) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) console.log(err);
        else res.render("campgrounds/show", {campground: foundCampground});
        console.log(foundCampground);
    })
})

app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})