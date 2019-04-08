const express = require("express");
      router  = express.Router({mergeParams: true});

//new comment post
router.post("/comments", isLoggedIn, (req, res, next) => {
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


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;