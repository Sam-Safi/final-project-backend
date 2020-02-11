const express = require("express");
const session = require("express-session");
const app = express();
const Busboy = require("busboy");
const fs = require("fs");
const path = require("path");
const UserRouter = require("./routes/User.route");
const BookRouter = require("./routes/Book.Public");
const PublicRouter = require("./routes/Public.route");
const ApiRouter = require("./routes/Api.route");
const PrivateRouter = require("./routes/Private.route");
require("./mongo");
require("dotenv").config();
const port = process.env.PORT || 4000;

const uploadFolder = "./upload";

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}
//upload files
app.use("/upload", (req, res) => {
  console.log("upload endpoint hit");
  const kiloByteSizeLimit = 100; //size limit in KB, multiplied by 1000 below to convert to bytes
  //configure busBoy with fileSize limit (optional) docs: https://www.npmjs.com/package/busboy#busboy-methods
  const busboy = new Busboy({
    headers: req.headers,
    limits: { fileSize: kiloByteSizeLimit * 1000 }
  });
  let responseMsg = "file uploaded";
  let status = 201; //http code for 'created' see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

  //busboy file event
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log("attempting to save file: " + filename);
    const saveTo = path.join(uploadFolder, filename);

    file.on("limit", data => {
      responseMsg = "file size reached";
      status = 413; //http code for 'payload to large'
      fs.unlink(saveTo, () => {}); //remove the partial uploaded file
    });

    file.pipe(fs.createWriteStream(saveTo));
  });

  //busboy field event
  busboy.on("field", (fieldName, value, fieldNameTruncated) => {
    console.log(`Field event: field name: ${fieldName}, value: ${value}`);
    //todo log to database etc etc
  });

  busboy.on("finish", () => {
    console.log(responseMsg);
    res.status(status).send(responseMsg);
  });
  return req.pipe(busboy); //pipe the request object into busboy //https://flaviocopes.com/nodejs-streams/#pipe
});
app.use(express.static(uploadFolder));
app.use(express.static("frontend"));
app.use(express.json());

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
