const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js"); // for authentication (isLoggedIn middleware)
const listingController = require("../controllers/listings.js"); // for listing controller
const multer = require("multer"); // for file upload (multer package) (middleware for handling multipart/form-data, which is used for uploading files)
const { storage } = require("../cloudConfig.js"); // for image upload (cloudinary package) (for uploading images to cloudinary)
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // It will extract files from the form and will store in the storage(cloudinary storage)


// app. is replaced with router. (router object also have all the methods like get, post, delete, update)

router
  .route("/")
  // Index Route
  .get(wrapAsync(listingController.index)) // listingController.index is a function that will be called when the route is hit. It will get all the listings from the database and render the index.ejs file with the listings data.
  // Create New Route
  .post(
    isLoggedIn,
    upload.single("listing[image]"), // for uploading a single image (image is the name of the input field in the form) (multer middleware)
    validateListing, // for listing validation (server-side validation using joi package)
    wrapAsync(listingController.createListing) // listingController.createListing is a function that will be called when the route is hit. It will create a new listing and save it to the database.
  );

// New Route (this route should come before the Show Route)
router.get("/new", isLoggedIn, listingController.renderNewForm); // listingController.renderNewForm is a function that will be called when the route is hit. It will render the new.ejs file.

router
  .route("/:id")
  // Show Route (showing all the data of the indvidual listing)
  .get(
    wrapAsync(listingController.showListing) // listingController.showListing is a function that will be called when the route is hit. It will create a new listing and save it to the database.
  )
  // Update Route
  .put(
    isLoggedIn,
    isOwner, // for checking if the user is the owner of the listing (if not then redirect to the listing page)
    validateListing,
    wrapAsync(listingController.updateListing) // listingController.updateListing is a function that will be called when the route is hit. It will update the listing and save it to the database.
  )
  // Delete Route
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing) // listingController.destroyListing is a function that will be called when the route is hit. It will delete the listing from the database.
  );

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm) // listingController.renderEditForm is a function that will be called when the route is hit. It will render the edit.ejs file.
);

module.exports = router;
