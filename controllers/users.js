const User = require("../models/user"); // import user model

module.exports.renderSignUpForm = (req, res) => {
  res.render("./users/signup");
};

module.exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username }); //  // we didn't add username in the model but still it will work because of passport-local-mongoose
    const registeredUser = await User.register(newUser, password); // {user, password}   registering the user (it will hash the password and store it in the database)
    req.login(registeredUser, (err) => {
      if (err) return next(err); // if there is an error, it will call the next middleware

      req.flash("success", "Welcome to BookaStay!"); // flash message for success
      res.redirect("/listings"); // redirect to listings page
    });
    // console.log(registeredUser);
  } catch (err) {
    req.flash("error", err.message); // flash message for error
    res.redirect("/signup"); // redirect to signup page
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./users/login");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to BookaStay!"); // if the user is authenticated, it will send this message
  let redirectUrl = res.locals.redirectUrl || "/listings"; // if the redirectUrl is not present in locals then redirect to listings page
  res.redirect(redirectUrl); // redirect to the original URL (the page where the user was trying to go before login)
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    // logout the user (passportjs.org)
    if (err) return next(err); // if there is an error, it will call the next middleware

    req.flash("success", "Logged out!"); // flash message for success
    res.redirect("/listings"); // redirect to listings page
  });
};
