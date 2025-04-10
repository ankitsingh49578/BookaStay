const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose"); // for authentication (Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.)

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        // username and password are already defined in passport-local-mongoose
    }
});

// passportLocalMongoose is a Mongoose plugin that automatically adds username and password fields to the schema, along with methods for authentication. It also handles hashing and salting of passwords, making it easier to implement secure authentication in your application. 
userSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("User", userSchema); // exporting the model so that it can be used in other files