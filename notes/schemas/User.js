const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minLength: 2,
    maxLength: 20,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minLength: 2,
    maxLength: 20,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  joinedDate: {
    type: String,
    default: Date.toLocaleString,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
