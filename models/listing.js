const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
