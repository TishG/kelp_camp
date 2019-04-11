const express = require("express");
      router  = express.Router();
      passport = require("passport");

//register show
router.get("/register", (req, res, next) => {
    res.render("auth/register");
});

//new register post
router.post("/register", (req, res, next) => {
    let newUser = new User({ username: req.body.username});
    let password = req.body.password;
    User.register(newUser, password, (err, newUser) => {
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, (err) => {
            if(err) {
                console.log(err);
                req.flash("error", "Something went wrong.");
                res.redirect("/register");
            }
            req.flash("success", `Welcome to KelpCamp ${newUser.username}`)
            res.redirect("/campgrounds");
            console.log("Successfully created user");
        })
    })
});

//login show route
router.get("/login", (req, res, next) => {
    res.render("auth/login");
})

//login post route
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login"}), (req, res, next) => {
        req.flash("success", "You have successfully logged in");
        res.redirect("/campgrounds");
    });

//logout route
router.get("/logout", (req, res, next) => {
    req.flash("success", "You have successfully signed out.")
    req.logout();
    res.redirect("/");
});

module.exports = router