const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js"); // for authentication (isLoggedIn middleware)

const listingController = require("../controllers/listings.js"); // for listing controller
// app. is replaced with router. (router object also have all the methods like get, post, delete, update)

// Index Route
router.get("/", wrapAsync(listingController.index));    // listingController.index is a function that will be called when the route is hit. It will get all the listings from the database and render the index.ejs file with the listings data.

// New Route (this route should come before the Show Route)
router.get("/new", isLoggedIn, listingController.renderNewForm); // listingController.renderNewForm is a function that will be called when the route is hit. It will render the new.ejs file.

// Create New Route
router.post(
  "/",
  isLoggedIn,
  validateListing, // for listing validation (server-side validation using joi package)
  wrapAsync(listingController.createListing) // listingController.createListing is a function that will be called when the route is hit. It will create a new listing and save it to the database.
);

// Show Route (showing all the data of the indvidual listing)
router.get(
  "/:id",
  wrapAsync(listingController.showListing)  // listingController.showListing is a function that will be called when the route is hit. It will create a new listing and save it to the database.
);

// Edit Rotue
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm) // listingController.renderEditForm is a function that will be called when the route is hit. It will render the edit.ejs file.
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner, // for checking if the user is the owner of the listing (if not then redirect to the listing page)
  validateListing,
  wrapAsync(listingController.updateListing) // listingController.updateListing is a function that will be called when the route is hit. It will update the listing and save it to the database.
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing) // listingController.destroyListing is a function that will be called when the route is hit. It will delete the listing from the database.
);

module.exports = router;
