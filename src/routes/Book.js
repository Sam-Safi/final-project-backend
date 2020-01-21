const express = require("express");
const router = express.Router();

const Book = require("../models/Book.model");

// JSON parting middleware
router.use(express.json());

router.get("/find", (req, res) => {
  Book.find().then(books => res.json(books));
});

router.post("/new", async (req, res) => {
  const book = await Book.create(req.body);

  res.json({ status: "book created", id: book.id });
});

router.put("/:id", (req, res) => {
  Book.findByIdAndUpdate({ id: req.body.bookID });
  res.json({ success: true });
});

router.delete("/:id", (req, res) => {
  Book.deleteOne({ id: req.body.bookID })
    .then(book => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
