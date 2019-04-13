const express = require("express");
      router  = express.Router();
      User = require("../models/user");
      Campground = require("../models/campground");
      middleware = require("../middleware"); 

      router.get("/:id", (req, res, next) => {
        User.findById(req.params.id, (err, foundUser) => {
            if(err) {
                console.log(err);
                req.flash("error", "Whoops, Something went wrong.");
                res.redirect("back");
            }
            Campground.find().where("author.id").equals(foundUser._id).exec((err, allCampgrounds) => {
                if(err) {
                    console.log(err);
                    req.flash("error", "Something went wrong.");
                    res.redirect("back");
                }
                res.render("users/profile", {user: foundUser, campgrounds: allCampgrounds});
            })
        })
      });

module.exports = router;