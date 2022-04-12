const express = require("express");
const router = express.Router();

// Logout route
router.route("/").get((req, res) => {
  const errorHeading = "Invalid user credentials";
  const errorText = "Please try to login again";
  const errorBtnText = "Head back to login";
  const redirectLink = "/";

  res.render("error", {
    errorHeading: errorHeading,
    errorText: errorText,
    errorBtnText: errorBtnText,
    redirectLink: redirectLink,
  });
});

module.exports = router;
