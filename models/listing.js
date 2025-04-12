const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // import the Review model to use in the post middleware

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "https://wallpapers.com/images/high/beautiful-place-pictures-njspr18qy1g3fzan.webp",     // default image(if image is not provided)
    set: (v) =>        // setting image if a empty image is provided ("")
      v === ""
        ? "https://wallpapers.com/images/high/beautiful-place-pictures-njspr18qy1g3fzan.webp"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,    // ObjectId type for the review
      ref: "Review",    // reference to the Review model
    }  
  ],
  owner: {
    type: Schema.Types.ObjectId,    // ObjectId type for the owner
    ref: "User",    // reference to the User model
  }
});

// Middleware to delete the reviews when the listing is deleted (post mongoose middleware)
// The findOneAndDelete Mongoose operation internally triggers this middleware.
listingSchema.post("findOneAndDelete", async function (listing) {
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}}); // delete all the reviews that are in the listing
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
