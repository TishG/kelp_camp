const express = require("express");
      router  = express.Router({mergeParams: true});

//new comment post
router.post("/", isLoggedIn, isEmpty, (req, res, next) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
            res.redirect(`/campgrounds`);
        } else {
            Comment.create(req.body.comment, (err, newComment) => {
                if(err) {
                    console.log(err);
                    res.redirect(`/campgrounds/${req.params.id}`);
                } else {
                    //add username and id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    //save comment
                    newComment.save();
                    foundCampground.comments.push(newComment);
                    foundCampground.save((err) => {
                        if(err) console.log(err)
                        else res.redirect(`/campgrounds/${req.params.id}`);
                        console.log(newComment);
                    });
                }
            })
        }
    })
});

router.get("/:comment_id/edit", isLoggedIn, checkCommentOwnership, (req, res, next) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) console.log(err);
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                console.log(err);
                res.redirect("back");
            }
            res.render("comments/edit", {campground: foundCampground, comment: foundComment})
        })
    })
});

router.put("/:comment_id", isLoggedIn, checkCommentOwnership, isEmpty, (req, res, next) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            res.redirect("back");
            console.log(err);
        }
        res.redirect(`/campgrounds/${req.params.id}`);
    })
})

router.delete("/:comment_id", isLoggedIn, checkCommentOwnership, (req, res, next) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err, deletedComment) => {
        if(err) {
            console.log(err);
            res.redirect("back");
        }
        res.redirect(`/campgrounds/${req.params.id}`);
    })
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function isEmpty(req, res, next) {
    if(req.body.comment.text != "") {
        return next();
    }
    res.redirect(`/campgrounds/${req.params.id}`);
}

function checkCommentOwnership(req, res, next) {
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

module.exports = router;