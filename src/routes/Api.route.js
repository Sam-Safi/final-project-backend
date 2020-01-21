const express = require("express");
const ApiRouter = express.Router();

// JSON parting middleware
ApiRouter.use(express.json());

ApiRouter.use((req, res, next) => {
  if (!req.session.user) {
    return res.status(403).json({ status: "user required" });
  }
  next();
});

ApiRouter.get("/hello", (req, res) => {
  res.json(req.session.user);
});

module.exports = ApiRouter;
