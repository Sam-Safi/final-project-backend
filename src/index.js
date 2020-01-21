const express = require("express");
const session = require("express-session");
const app = express();
const UserRouter = require("./routes/User.route");
const BookRouter = require("./routes/Book");
const ApiRouter = require("./routes/Api.route");
require("./mongo");
require("dotenv").config();

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

app.use("/user", UserRouter);
app.use("/book", BookRouter);
app.use("api", ApiRouter);

app.use(express.static(__dirname + "/public"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
