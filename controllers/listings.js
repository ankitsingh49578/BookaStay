const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner"); // populate is used to get the data of the reviews and owner (user) from the database (it will not show the id of the reviews and owner, it will show the data of the reviews and owner)
  if (!listing) {
    req.flash("error", "Listing Not Found!"); // flash message when the listing is not found
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  // const {title, description, image, price, location, country} = req.body;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // adding the owner of the listing (user id) to the listing
  newListing.image = {url, filename}; // adding the image to the listing (image is the name of the input field in the form)
  await newListing.save();
  req.flash("success", "Successfully Created a New Listing!"); // flash messaage whenever a new listing is created
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Not Found!"); // flash message when the listing is not found
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const editedListing = req.body.listing;
  await Listing.findByIdAndUpdate(
    id,
    { ...editedListing },
    { new: true, runValidators: true }
  );
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id); // when this findByIdAndDelete is called, then the listing will be deleted and the post middleware of listingSchema will be called and all the reviews associated with it will also be deleted
  req.flash("success", "Listing Deleted!"); // flash messaage whenever a new listing is created
  res.redirect("/listings");
};
