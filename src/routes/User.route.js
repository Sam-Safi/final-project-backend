const express = require("express");
const session = require("express-session");
const UserRouter = express.Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");

// JSON parting middleware//

UserRouter.use(express.json());

UserRouter.post("/new", async (req, res) => {
  // create new user login here
  const salt = "$2a$10$iaKciWAPW5o5N3ZzLQuZau";
  req.body.password = bcrypt.hashSync(req.body.password, salt);
  req.body.token = bcrypt.hashSync(req.body.token, salt);

  const user = await UserModel.create(req.body);

  res.json({ status: "user created", id: user.id });
});

UserRouter.get("/login", async (req, res) => {
  // login logic here
  const salt = "$2a$10$iaKciWAPW5o5N3ZzLQuZau";

  //   check for user header
  if (!req.headers.authorization) {
    return res.status(400).json();
  }
  //   extract user details from request
  const [userType, userPass] = req.headers.authorization.split(" ");

  let user = null;
  // check database if user exists

  switch (userType) {
    case "Basic":
      const userPassDecoded = Buffer.from(userPass, "base64").toString();
      const [userName, userPassword] = userPassDecoded.split(":");
      const passHash = bcrypt.hashSync(userPassword, salt);
      user = await UserModel.findOne({ login: userName, password: passHash });

      break;
    case "Bearer":
      // check DB for token
      const tokenHash = bcrypt.hashSync(userPass, salt);
      user = await UserModel.findOne({ token: tokenHash });
      break;
  }

  if (!user) {
    return res
      .status(400)
      .json({ status: "user not found or incorrect password" });
  }
  req.session.user = user;
  res.json(user);
});

UserRouter.get("/logout", (req, res) => {
  // logout logic here
  req.session.destroy();
  res.json({ status: "logout route" });
});

module.exports = UserRouter;
