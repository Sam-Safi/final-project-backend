const express = require("express");
const BookRouter = express.Router();

// // JSON parting middleware
// router.use(express.json());

BookRouter.get("/find", (req, res) => {
  Book.find().then(books => res.json(books));
});

// //Middleware
BookRouter.use((req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else res.status(401).send("forbidden! maybe login?");
});

BookRouter.get("/", (req, res) => {
  res.send(
    "You are logged in and can view books!, you have viewed this page: "
  );
});

BookRouter.get("/view", (req, res) => {
  res.send("This route is not private ");
});
module.exports = BookRouter;
