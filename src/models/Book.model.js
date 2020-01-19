const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  total_pages: {
    type: Number,
    required: false
  },
  user_id: {
    type: String,
    required: true
  }
});
const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
