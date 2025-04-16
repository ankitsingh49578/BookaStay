if(process.env.NODE_ENV != "production") { // for environment variables (dotenv package)
  require("dotenv").config(); // for environment variables (dotenv package)
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require('express-session');       // for session management
const MongoStore = require('connect-mongo');      // MongoDB session store for Connect and Express
const flash = require('connect-flash');         // for flash messages
const passport = require('passport');       // for authentication (passportjs.org)
const LocalStrategy = require('passport-local'); // for local authentication 
const User = require('./models/user.js'); 
const userRouter = require("./routes/user.js"); // for user model (user.js) 


const dbUrl = process.env.ATLASDB_URL;
// Connection with DataBase
const MONGO_URL = "mongodb://127.0.0.1:27017/bookastay";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json({limit: '10mb'})); 

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,   // Don't resave the session to the database unless it was modified or 24hours time has passed since the last save.
});

store.on("error", (err)=>{
  console.log("ERROR IN MONGO SESSION STORE". err);
})

// by using mongoStore our session info will store in the atlas DB (Online DB not in our systems mongodb Database)
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days(no. of milliseconds in 7 days)
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days(no. of milliseconds in 7 days)
    httpOnly: true, // helps to prevent cross-site scripting attacks
  }
};

// // Home Route
// app.get("/", (req, res) => {
//   res.send("Hey, This is Home page");
// });


app.use(session(sessionOptions)); // for session management
app.use(flash()); // for flash messages (it should come before listings route)

// it should come after session and flash middleware
app.use(passport.initialize()); // for authentication (before using passport we have to initialize it)
app.use(passport.session()); // for session management (after initializing passport)
passport.use(new LocalStrategy(User.authenticate())); // for local authentication (passport-local-mongoose)

passport.serializeUser(User.serializeUser()); // for session management (all the information of a user is stored in session is called serialization)
passport.deserializeUser(User.deserializeUser()); // for session management (all the info. of a user is retrieved (removed) from session (once session is finished) is called deserialization)

// locals can be used anywhere in the app (in all the views) (it is used to pass data to all the views)
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // flash message for success
  res.locals.error = req.flash("error"); // flash message for error
  res.locals.currUser = req.user;   // current user (if logged in) (req.user is set by passport)
  // console.log(res.locals.success);
  next();
});

// listing routes
app.use('/listings', listingRouter);     // will use listing.js

// Review Routes
app.use('/listings/:id/reviews', reviewRouter); // will use review.js 

// User Routes
app.use('/', userRouter); // for user routes (user.js)


app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

const server = app.listen(3000, () => {
  console.log("Listening at 3000");
});
server.setTimeout(30000); // for timeout (for 30 sec) (if the server is idle for 5 minutes then it will be closed automatically)
