const express = require("express");
const path = require("path");
const session = require("express-session");
const app = express();
const fs = require("fs");
const cors = require("cors");
const UserRouter = require("./routes/User.route");
const BookRouter = require("./routes/Book.Public");
const PublicRouter = require("./routes/Public.route");
const ApiRouter = require("./routes/Api.route");
const PrivateRouter = require("./routes/Private.route");
require("./mongo");
require("dotenv").config();

const port = process.env.PORT || 4000;
console.log("__dirname", __dirname);
const uploadFolder = path.resolve(__dirname, "../upload");
console.log("uploadFolder", uploadFolder);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}
//upload files

app.use(express.static("upload"));
app.use(express.static("frontend"));
app.use(express.json());
app.use(cors());

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
