const Listing = require("../models/listing");
const Review = require("../models/review"); // importing the review model

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review); // review is array of fields in the form
  newReview.author = req.user._id; // adding author id to the review
  listing.reviews.push(newReview); // pushing the new review into the listing
  await newReview.save();
  await listing.save(); // saving the listing with the new review
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // removing the review id from the listing
  await Review.findByIdAndDelete(reviewId); // deleting the review from the review collection
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
