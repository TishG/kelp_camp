const express = require("express");
      router  = express.Router();
      passport = require("passport");

//register show
router.get("/register", (req, res, next) => {
    res.render("auth/register");
});

//new register post
router.post("/register", (req, res, next) => {
    let newUser = new User({ username: req.body.username, avatar: req.body.avatar});
    let password = req.body.password;
    if(req.body.adminCode === process.env.adminCode) {
        newUser.isAdmin = true;
    }
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
            console.log(`${newUser.avatar}, ${newUser.username}`);
        })
    })
});

//login show route
router.get("/login", (req, res, next) => {
    res.render("auth/login");
})

//login post route
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failuerFlash: true,
    successRedirect: "/campgrounds",
    successFlash: "Welcome back!"}), (req, res, next) => {
    });

//logout route
router.get("/logout", (req, res, next) => {
    req.logout();
    req.flash("success", "You have successfully signed out.")
    res.redirect("/campgrounds");
});

module.exports = router