const express = require("express");
const Busboy = require("busboy");
const path = require("path");
const fs = require("fs");
const BookModel = require("../models/Book.model");

console.log("__dirname", __dirname);

const PrivateRouter = express.Router();
const uploadFolder = path.resolve(__dirname, "../../upload");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

//Middleware
PrivateRouter.use((req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else res.status(401).send("forbidden! maybe login?");
});

PrivateRouter.get("/", (req, res) => {
  res.send(
    "You are logged in and can create books!, you have viewed this page: "
  );
});

PrivateRouter.post("/new", async (req, res) => {
  console.log("PrivateRouter req: ", req);
  const newBook = {};

  const kiloByteSizeLimit = 100; //size limit in KB, multiplied by 1000 below to convert to bytes
  //configure busBoy with fileSize limit (optional) docs: https://www.npmjs.com/package/busboy#busboy-methods
  const busboy = new Busboy({
    headers: req.headers,
    limits: { fileSize: kiloByteSizeLimit * 6000 }
  });
  let responseMsg = "file uploaded";
  let fileName;
  let status = 201; //http code for 'created' see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

  //busboy file event
  busboy.on("file", (fieldname, file, filename) => {
    console.log("attempting to save file: " + filename);
    fileName = filename;
    const saveTo = path.join(uploadFolder, filename);

    file.on("limit", data => {
      responseMsg = "file size reached";
      status = 413; //http code for 'payload to large'
      fs.unlink(saveTo, () => {}); //remove the partial uploaded file
    });

    file.pipe(fs.createWriteStream(saveTo));
  });

  //busboy field event
  busboy.on("field", (fieldname, value) => {
    console.log(`Field event: field name: ${fieldname}, value: ${value}`);
    //todo log to database etc etc
    newBook[fieldname] = value;
  });

  busboy.on("finish", async () => {
    newBook.image = fileName;
    const book = await BookModel.create(newBook);
    res
      .status(status)
      .json({ id: book.id })
      .send();
  });
  return req.pipe(busboy);

  //res.json({ status: "book created", id: book.id });
});
PrivateRouter.put("/:id", async (req, res) => {
  await BookModel.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

PrivateRouter.get("/:id", async (req, res) => {
  const book = await BookModel.findById(req.params.id);
  res.json(book);
});

PrivateRouter.delete("/:id", async (req, res) => {
  console.log("body", req.params);
  const deleteBook = await BookModel.deleteOne({ _id: req.params.id });
  if (deleteBook) {
    res.send({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

module.exports = PrivateRouter;
