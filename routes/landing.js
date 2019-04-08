const express = require("express");
      router  = express.Router();
//show homepage
router.get("/", (req, res, next) => {
    res.render("landing");
});

module.exports = router;