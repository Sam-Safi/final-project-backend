const express = require("express");
const session = require("express-session");
require("dotenv").config();
const app = express();

const port = process.env.EXPRESS_PORT || 4000;

app.get("/", (req, res) => res.send("Hello World!"));

app.use(
  session({
    secret: "SS window sill cat",
    name: "ss_cookie_ftw",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
