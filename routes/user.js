const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport"); // for authentication (passportjs.org)
const { saveRedirectUrl } = require("../middleware.js"); // middleware to save the original URL in session (to redirect to that page after login)
const userController = require("../controllers/users.js"); // user controller

router
  .route("/signup")
  // GET route for user signup
  .get(userController.renderSignUpForm) // render the signup form
  // POST route for user signup
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  // GET route for user login
  .get(userController.renderLoginForm) // render the login form
  // POST route for user login
  // passport.authenticate() will authenticate the user and if the user is authenticated, it will redirect to the next middleware (which is a function here) otherwise it will redirect to the login page again
  .post(
    saveRedirectUrl, // save the original URL in session (to redirect to that page after login)
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login // if the user is authenticated, it will call this function
  );

// GET route for user logout
router.get("/logout", userController.logout); // logout the user

module.exports = router;
