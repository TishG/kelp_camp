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

//edit campground
router.get("/:id/edit", isLoggedIn, checkCampgroundOwnership, (req, res, next) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
            res.redirect(`back`);
        }
        res.render("campgrounds/edit", {campground: foundCampground});
        console.log("Found - ", foundCampground);
    })
})

//update campground 

router.put("/:id", checkCampgroundOwnership, (req, res, next) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect(`/campgrounds`);
            console.log(err);
        }
        res.redirect(`/campgrounds/${req.params.id}`);
        console.log("Updated - ", updatedCampground.name);
    })
})

//Destroy campground show route
router.get("/:id/delete", checkCampgroundOwnership, (req, res, next) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) { 
            console.log(err);
        }
        res.render("campgrounds/delete", {campground: foundCampground});
        console.log(foundCampground);
    })
})

//Destroy campground route
router.delete("/:id", checkCampgroundOwnership, (req, res, next) => {
    Campground.findByIdAndDelete(req.params.id, (err, deletedCampground) => {
        if(err) {
            console.log(err);
            res.redirect(`/campgrounds/${req.params.id}`);
        }
        Comment.deleteMany( 
            { _id: { 
                    $in: deletedCampground.comments 
                }
            }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    })
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
    Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) console.log(err);
    if(foundCampground.author.id.equals(req.user._id)) {
        next();
        } else {
            console.log(err);
            res.redirect("back");
        }
    })
}

module.exports = router;