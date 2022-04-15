const express = require("express");
const router = express.Router();

// Logout route
router
  .route("/")
  .get((req, res) => {
    req.logout();
    res.clearCookie("user");
    console.log("[Logout] Logout user");
    res.redirect("/");
  });

module.exports = router;
