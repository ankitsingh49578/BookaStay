const express = require('express');
const router = express.Router({mergeParams: true});         // here mergeParams will merge parent parameter(route given in the app.js) with the child parameter(route in review.js)
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js"); // for listing validation (server-side validation using joi package)
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



// middleware for review schema validation
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

//Reviews
// Post Review Route (this route should come after the Show Route)
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); // review is array of fields in the form
    listing.reviews.push(newReview); // pushing the new review into the listing
    await newReview.save();
    await listing.save(); // saving the listing with the new review
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Review Route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // removing the review id from the listing
    await Review.findByIdAndDelete(reviewId); // deleting the review from the review collection
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;