const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  login: String,
  password: String, //password hashed with Bcrypt
  token: String, //token hashed with Bcrypt
  profile: { role: String, name: String, age: Number }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
