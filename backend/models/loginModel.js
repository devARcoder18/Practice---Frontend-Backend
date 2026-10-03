const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "A LoginSystem must have Username"],
    unique: true,
    default: "Random User",
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true, // Note: unique creates a MongoDB index, it is not a Mongoose validator
    lowercase: true, // Automatically converts the email to lowercase before saving
    trim: true, // Removes leading/trailing whitespace
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"], // Built-in regex validation
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ],
  },
});

const Login = mongoose.model("Login", loginSchema);
module.exports = Login;
