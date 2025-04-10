const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js"); // for listing validation (server-side validation using joi package)
const Listing = require("../models/listing.js");


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

// app. is replaced with router. (router object also have all the methods like get, post, delete, update)

// Index Route
router.get(             
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route (this route should come before the Show Route)
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create New Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // const {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Successfully Created a New Listing!");    // flash messaage whenever a new listing is created
    res.redirect("/listings");
  })
);

// Show Route (showing all the data of the indvidual listing)
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); // populating the reviews field in the listing
    if (!listing) {
      req.flash("error", "Listing Not Found!"); // flash message when the listing is not found
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Edit Rotue
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "Listing Not Found!"); // flash message when the listing is not found
      return res.redirect("/listings");   
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const editedListing = req.body.listing;
    await Listing.findByIdAndUpdate(
      id,
      { ...editedListing },
      { new: true, runValidators: true }
    );
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(   
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id); // when this findByIdAndDelete is called, then the listing will be deleted and the post middleware of listingSchema will be called and all the reviews associated with it will also be deleted
    req.flash("success", "Listing Deleted!");    // flash messaage whenever a new listing is created
    res.redirect("/listings");
  })
);


module.exports = router;