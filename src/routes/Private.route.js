const express = require("express");
const PrivateRouter = express.Router();

const BookModel = require("../models/Book.model");

// dogRouter.use(express.json());

//Middleware
PrivateRouter.use((req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else res.status(401).send("forbidden! maybe login?");
});

PrivateRouter.get("/", (req, res) => {
  res.send(
    "You are logged in and can create books!, you have viewed this page: "
  );
});

PrivateRouter.post("/new", async (req, res) => {
  const book = await BookModel.create(req.body);

  res.json({ status: "book created", id: book.id });
});

PrivateRouter.put("/:id", (req, res) => {
  BookModel.findByIdAndUpdate({ id: req.body.bookID });
  res.json({ success: true });
});

PrivateRouter.get("/:id", async (req, res) => {
  const book = await BookModel.findById(req.params.id);
  res.json(book);
});

PrivateRouter.delete("/:id", async (req, res) => {
  console.log("body", req.params);
  const deleteBook = await BookModel.deleteOne({ _id: req.params.id });
  if (deleteBook) {
    res.send({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

module.exports = PrivateRouter;
