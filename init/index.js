const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

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

const initDB = async () => {
  await Listing.deleteMany({}); // deleting all the already existing data
  initData.data = initData.data.map((obj) =>({...obj, owner: "67f8a7e417218fbea0c0851a"})); // adding owner to each object in the data
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB(); // calling function
