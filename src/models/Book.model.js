const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BookSchema = new Schema({
  title: String,
  author: String,
  description: String,
  image: String,
  user_id: String
});
const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
