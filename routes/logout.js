const express = require("express");
const router = express.Router();

// Logout route
router
  .route("/")
  .get((req, res) => {
    res.clearCookie("user");
    res.redirect("/");
  })
  .post((req, res) => {});

module.exports = router;
