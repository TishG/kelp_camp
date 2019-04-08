const express = require("express");
      router  = express.Router();
      passport = require("passport");

//register show
router.get("/register", (req, res, next) => {
    res.render("register");
});

//new register post
router.post("/register", (req, res, next) => {
    let newUser = new User({ username: req.body.username});
    let password = req.body.password;
    User.register(newUser, password, (err, newUser) => {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, (err) => {
            if(err) {
                console.log(err);
                return res.render("register");
            }
            res.redirect("/campgrounds");
            console.log("Successfully created user");
        })
    })
});

//login show route
router.get("/login", (req, res, next) => {
    res.render("login");
})

//login post route
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"}), (req, res, next) => {});

//logout route
router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});
//function to check is user is logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router