const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

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

// Home Route
app.get("/", (req, res) => {
  res.send("Hey, This is Home page");
});

// Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// New Route (this route should come before the Show Route)
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create New Route
app.post("/listings", async (req, res) => {
  // const {title, description, image, price, location, country} = req.body;
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// Show Route (showing all the data of the indvidual listing)
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// Edit Rotue
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const editedListing = req.body.listing;
  await Listing.findByIdAndUpdate(id, {...editedListing}, { new: true, runValidators: true });
  res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete('/listings/:id', async (req, res)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
})

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

app.listen(3000, () => {
  console.log("Listening at 3000");
});
