const express = require('express');
const router = express.Router({mergeParams: true});         // here mergeParams will merge parent parameter(route given in the app.js) with the child parameter(route in review.js)
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js"); // for review validation (server-side validation using joi package)
const reviewController = require("../controllers/reviews.js");
const review = require('../models/review.js');

//Reviews
// Post Review Route (this route should come after the Show Route)
router.post(
  "/",
  isLoggedIn, // for authentication (if user is logged in then only he can post a review)
  validateReview,
  wrapAsync(reviewController.createReview) // reviewController.createReview is the function that will be called when this route is hit
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview) // reviewController.destroyReview is the function that will be called when this route is hit
);

module.exports = router;