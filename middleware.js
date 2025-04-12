const Listing = require("./models/listing"); // import the listing model
const ExpressError = require("./utils/ExpressError.js"); // for error handling (custom error class)
const { listingSchema, reviewSchema } = require("./schema.js"); // for listing validation (server-side validation using joi package)
const Review = require("./models/review.js"); // import the review model

// middleware for listing schema validation
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // store the original URL in session (to redirect to that page after login)
    // if the user is not authenticated then redirect to login page
    req.flash("error", "You must be signed in to create a listing!"); // flash message when the user is not authenticated
    return res.redirect("/login"); // redirect to login page
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // store the original URL in locals (to redirect to that page after login)
  }
  next();
};

module.exports.isOwner = async (req, res, next) =>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "Permission Denied!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

// middleware for review schema validation
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) =>{
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error", "You don't have permission to delete this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
