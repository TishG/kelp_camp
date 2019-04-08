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
router.post("/", (req, res, next) => {
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

//campgrounds form show
router.get("/new", (req, res, next) => {
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

module.exports = router;