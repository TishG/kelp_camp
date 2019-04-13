const express = require("express");
      router  = express.Router({mergeParams: true});
      middleware = require("../middleware");

//new comment post
router.post("/", middleware.isLoggedIn, middleware.isEmpty, (req, res, next) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
            req.flash("error", "Campground not found.");
            res.redirect(`/campgrounds`);
        } else {
            Comment.create(req.body.comment, (err, newComment) => {
                if(err) {
                    console.log(err);
                    req.flash("error", "Comment not found.");
                    res.redirect(`/campgrounds/${req.params.id}`);
                } else {
                    //add username and id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    //save comment
                    newComment.save();
                    foundCampground.comments.push(newComment);
                    foundCampground.save((err) => {
                        if(err) {
                            console.log(err);
                        }
                        req.flash("Success", "Comment added!");
                        res.redirect(`/campgrounds/${req.params.id}`);
                        console.log(newComment);
                    });
                }
            })
        }
    })
});

router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res, next) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) {
            console.log(err);
            req.flash("error", "Campground not fount.");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                console.log(err);
                req.flash("error", "Comment not found.");
                res.redirect("back");
            }
            res.render("comments/edit", {campground: foundCampground, comment: foundComment})
        })
    })
});

router.put("/:comment_id", middleware.isLoggedIn, middleware.checkCommentOwnership, middleware.isEmpty, (req, res, next) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            req.flash("error", "Comment not found.")
            res.redirect("back");
            console.log(err);
        }
        req.flash("success", "Successfully updated comment.")
        res.redirect(`/campgrounds/${req.params.id}`);
    })
})

router.delete("/:comment_id", middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res, next) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err, deletedComment) => {
        if(err) {
            console.log(err);
            req.flash("error", "Comment not found");
            res.redirect("back");
        }
        req.flash("sucess", "Comment deleted.");
        res.redirect(`/campgrounds/${req.params.id}`);
    })
});

module.exports = router;