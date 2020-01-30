const express = require("express");
const publicRouter = express.Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");

publicRouter.post("/newUser", async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password);
  const userCurrent = await UserModel.findOne({ email: req.body.email });
  if (userCurrent) {
    res.status(400).send({ message: "User already exists" });
  } else {
    const { firstname, lastname, email, password } = req.body;
    const user = await UserModel.create({
      firstname,
      lastname,
      email,
      password
    });
    if (user)
      res.status(201).send({
        message: "user created, you may now sign in"
      });
    else res.status(500).send("could not create user");
  }
});

module.exports = publicRouter;
