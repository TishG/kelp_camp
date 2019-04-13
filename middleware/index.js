const Campground = require("../models/campground");
      Comment    = require("../models/comment");

module.exports = {
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You must be signed in to do that.");
        res.redirect("/login");
    },
    isEmpty: (req, res, next) => {
        if(req.body.comment.text != "") {
            return next();
        }
        req.flash("error", "Cannot send an empty comment.");
        res.redirect(`/campgrounds/${req.params.id}`);
    },
    checkCampgroundOwnership: (req, res, next) => {
        Campground.findById(req.params.id, (err, foundCampground) => {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found.")
            console.log(err);
            res.redirect("back");
        }
        if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
            next();
            } else {
                req.flash("error", "You are not authorized to do that.")
                res.redirect("back");
                console.log(err);
            }
        })
    },
    checkCommentOwnership: (req, res, next) => {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err || !foundComment) {
            req.flash("error", "Comment not found.")
            res.redirect("back");
            console.log(err);
        }
        if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
            next();
            } else {
                console.log(err);
                req.flash("error", "You are not authorized to do that.")
                res.redirect("back");
            }
        })
    }, 
    escapeRegex: (text) => {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
}