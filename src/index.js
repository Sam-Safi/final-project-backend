const express = require("express");
const session = require("express-session");
const app = express();
const UserRouter = require("./routes/User.route");
const BookRouter = require("./routes/Book.Public");
const PublicRouter = require("./routes/Public.route");
const ApiRouter = require("./routes/Api.route");
const PrivateRouter = require("./routes/Private.route");
require("./mongo");
require("dotenv").config();

const port = process.env.PORT || 4000;

app.use(express.static("frontend"));
app.use(express.json());
// hello world example is good to start
// app.get("/", (req, res) => res.send("Hello World!"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "SS window sill cat",
    name: "ss_cookie_ftw",
    cookie: { maxAge: 1000 * 60 * 60 },
    resave: false,
    saveUninitialized: false
  })
);

app.use("/user", UserRouter);
app.use("/book", BookRouter);
app.use("/public", PublicRouter);
app.use("/private/book", PrivateRouter);
app.use("api", ApiRouter);

app.use(express.static(__dirname + "/public/image"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
