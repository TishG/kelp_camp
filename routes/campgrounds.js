const express = require("express");
      router  = express.Router();
      Campground = require("../models/campground");
      Comment = require("../models/comment");

//campgrounds show
router.get("/", (req, res, next) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err) console.log(err);
        else res.render("campgrounds/index", { campgrounds: allCampgrounds });
    })
})
//campgrounds new
router.post("/", isLoggedIn, (req, res, next) => {
    //get data from forms and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {name, image, description, author}; //<--- (sames as) let newCampground = {name:name, image:image, description:description, author:author};
    //create a newCampground and save to db
    Campground.create(newCampground, (err, newCampgroundCreated) => {
        if(err) console.log(err);
        else res.redirect("/campgrounds");
        console.log('Successfully created a new campground... ', newCampgroundCreated);
    })
    //redirect back to campgrounds page
})

//campgrounds form show
router.get("/new", isLoggedIn, (req, res, next) => {
    res.render("campgrounds/new");
})

//campground show
router.get("/:id", (req, res, next) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) console.log(err);
        else res.render("campgrounds/show", {campground: foundCampground});
        console.log(foundCampground);
    })
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;