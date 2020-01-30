const express = require("express");
const session = require("express-session");
const UserRouter = express.Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");

UserRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (user) {
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (passwordCheck) {
      console.log("valid user profile found, adding profile to session");
      req.session.user = { id: user.id };
      res.status(200).send({
        profile: { username: user.username, firstname: user.firstname }
      });
    } else {
      res.status(404).send({ error: "Authentication error" });
    }
  } else {
    res.status(404).send({ error: "Authentication error" });
  }
});

UserRouter.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("Logged out");
});

module.exports = UserRouter;
