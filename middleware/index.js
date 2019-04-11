const Campground = require("../models/campground");
      Comment    = require("../models/comment");


module.exports = {
    isLoggedIn: (req, res, next) => {
            if(req.isAuthenticated()) {
                return next();
            }
            res.redirect("/login");
    },
    isEmpty: (req, res, next) => {
        if(req.body.comment.text != "") {
            return next();
        }
        res.redirect(`/campgrounds/${req.params.id}`);
    },
    checkCampgroundOwnership: (req, res, next) => {
        Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
            res.redirect("back");
        }
        if(foundCampground.author.id.equals(req.user._id)) {
            next();
            } else {
                console.log(err);
                res.redirect("back");
            }
        })
    },
    checkCommentOwnership: (req, res, next) => {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect("back");
            console.log(err);
        }
        if(foundComment.author.id.equals(req.user._id)) {
            next();
            } else {
                console.log(err);
                res.redirect("back");
            }
        })
    }
}