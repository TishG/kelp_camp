const express = require("express");
      router  = express.Router();
      Campground = require("../models/campground");
      Comment = require("../models/comment");
      middleware = require("../middleware"); 

//campgrounds show
router.get("/", (req, res, next) => {
    let noMatch = null;
    if(req.query.search) {
    const regex = new RegExp(middleware.escapeRegex(req.query.search), 'gi');
    Campground.find({name: regex}, (err, allCampgrounds) => {
        if(err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            res.redirect("/landing");
        } 
        if(allCampgrounds.length < 1) {
            noMatch = "No campgrounds match that query, please try again.";
        }
        res.render("campgrounds/index", { campgrounds: allCampgrounds, noMatch: noMatch });
        })

    } else {
    Campground.find({}, (err, allCampgrounds) => {
        if(err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            res.redirect("/landing");
        }
        res.render("campgrounds/index", { campgrounds: allCampgrounds, noMatch: noMatch });
        })
    }
})
//campgrounds new
router.post("/", middleware.isLoggedIn, (req, res, next) => {
    //get data from forms and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {name, image, description, price, author}; //<--- (sames as) let newCampground = {name:name, image:image, description:description, author:author};
    //create a newCampground and save to db
    Campground.create(newCampground, (err, newCampgroundCreated) => {
        if(err) {
            console.log(err);
            req.flash("error", "Unable to create camplground.");
            res.redirect("/Campgrounds")
        }
        req.flash("succes", "Successfully created new campground.");
        res.redirect("/campgrounds");
        console.log('Successfully created a new campground... ', newCampgroundCreated);
    })
    //redirect back to campgrounds page
})

//campgrounds form show
router.get("/new", middleware.isLoggedIn, (req, res, next) => {
    res.render("campgrounds/new");
})

//campground show
router.get("/:id", (req, res, next) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) {
            console.log(err);
            req.flash("error", "Camground not found.")
        }      
        res.render("campgrounds/show", {campground: foundCampground});
    })
});

//edit campground
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership, (req, res, next) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
            req.flash("error", "Campground not found.")
            res.redirect(`back`);
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    })
})

//update campground 

router.put("/:id", middleware.checkCampgroundOwnership, (req, res, next) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            req.flash("error", "Campground not found.");
            res.redirect(`/campgrounds`);
            console.log(err);
        }
        req.flash("success", "Updated campground.");
        res.redirect(`/campgrounds/${req.params.id}`);
    })
})

//Destroy campground show route
router.get("/:id/delete", middleware.checkCampgroundOwnership, (req, res, next) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) { 
            console.log(err);
            req.flash("error", "Campground not found.")
            res.redirect("back");
        }
        req.flash("Are you sure you want to delete this campground post? Click delete again to delete or cancel to stop.")
        return res.render("campgrounds/delete", {campground: foundCampground});
    })
})

//Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res, next) => {
    Campground.findByIdAndDelete(req.params.id, (err, deletedCampground) => {
        if(err) {
            console.log(err);
            req.flash("error", "Campground not found.")
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
            req.flash("success", "Campground deleted.")
            res.redirect("/campgrounds");
        });
    })
})

module.exports = router;