const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  login: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);
