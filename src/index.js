const express = require("express");
const session = require("express-session");
const app = express();
const Busboy = require("busboy");
const fs = require("fs");
const UserRouter = require("./routes/User.route");
const BookRouter = require("./routes/Book.Public");
const PublicRouter = require("./routes/Public.route");
const ApiRouter = require("./routes/Api.route");
const PrivateRouter = require("./routes/Private.route");
require("./mongo");
require("dotenv").config();
const port = process.env.PORT || 4000;

//upload files
app.use("/upload", (req, res) => {
  console.log("trying to upload");
  const busboy = new Busboy({ headers: req.headers });
  busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
    console.log("attempting to save");
    const saveTo = "./uploads/" + filename;
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on("finish", function() {
    console.log("file uploaded");
    res.send("That's all folks!");
  });
  return req.pipe(busboy);
});

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
