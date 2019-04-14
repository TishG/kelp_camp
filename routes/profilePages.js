const express = require("express");
      router  = express.Router();
      User = require("../models/user");
      Campground = require("../models/campground");
      middleware = require("../middleware"); 

      router.get("/:id", middleware.isLoggedIn, (req, res, next) => {
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
                console.log("Profile avatart url: ", foundUser.avatar)
            })
        })
      });

    //   edit avatar image url page
      router.get("/:id/edit", middleware.isLoggedIn, (req, res, next) => {
        User.findById(req.params.id, (err, foundUser) => {
            if(err) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            } else {
            if(!req.user) {
                req.flash("error", "You must be signed in to do that.");
                res.redirect("/login");
            }
            if(req.user && !(foundUser._id.equals(req.user._id))) {
                req.flash("error", "You are not authorized to do that.")
                res.redirect("back");
                }
            if(req.user && foundUser._id.equals(req.user._id)) {
            res.render("users/edit", {user: foundUser});
                }
            }
        })
      });

    //edit image avatar post
    
    router.put("/:id", middleware.isLoggedIn, (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, { $set: {avatar: req.body.avatar }}, (err, foundUser) => {
            console.log("Url before: ", foundUser.avatar);
            if(err) {
                req.flash("error", err.message);
                res.redirect("back");
                console.log(err);
            }
            if(foundUser._id.equals(req.user._id)) {
            req.flash("success", "Updated avatar.");
            res.redirect(`/users/${req.params.id}`);
            console.log("Url after: ", foundUser.avatar);
            }
            else {
            req.flash("error", "You are not authorized to do that");
            res.redirect("/campgrounds");
            }
        })
    })

module.exports = router;