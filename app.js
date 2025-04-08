const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js"); // for listing validation (server-side validation using joi package)
const Review = require("./models/review.js");

// Connection with DataBase
const MONGO_URL = "mongodb://127.0.0.1:27017/bookastay";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// // Home Route
// app.get("/", (req, res) => {
//   res.send("Hey, This is Home page");
// });

// middleware for listing schema validation
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
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

// Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route (this route should come before the Show Route)
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create New Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // const {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Show Route (showing all the data of the indvidual listing)
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); // populating the reviews field in the listing
    res.render("listings/show.ejs", { listing });
  })
);

// Edit Rotue
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const editedListing = req.body.listing;
    await Listing.findByIdAndUpdate(
      id,
      { ...editedListing },
      { new: true, runValidators: true }
    );
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id); // when this findByIdAndDelete is called, then the listing will be deleted and the post middleware of listingSchema will be called and all the reviews associated with it will also be deleted
    res.redirect("/listings");
  })
);

// Post Review Route (this route should come after the Show Route)
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); // review is array of fields in the form
    listing.reviews.push(newReview); // pushing the new review into the listing
    await newReview.save();
    await listing.save(); // saving the listing with the new review

    console.log("New Review was added to the listing");
    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Review Route
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // removing the review id from the listing
    await Review.findByIdAndDelete(reviewId); // deleting the review from the review collection

    res.redirect(`/listings/${id}`);
  })
);

//
// app.get('/testListing', async (req, res)=>{
//   let sampleListing = new Listing({
//     title: "My new home",
//     descritpion: "at the seasore of Juhu",
//     price: 12000,
//     location: "Juhu, Mumbai",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(3000, () => {
  console.log("Listening at 3000");
});
