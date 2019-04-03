const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");

app.get("/", (req, res, next)=> {
    res.render("landing");
});

app.get("/campgrounds", (req, res, next)=> {

    let campgrounds = [
        {name: "Sunny Hill", image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
        {name: "Blooper Mountain", image: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
        {name: "IDK Jeesh", image: "https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"}
    ];
    res.render("Campgrounds", {campgrounds});
})

app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})