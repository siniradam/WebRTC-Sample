const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
const fileUpload = require("express-fileupload");
const uploadPath = __dirname + "/www/files";
const fs = require("fs");
const path = require("path");

//Middlewares
app.set("view engine", "ejs");
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
  })
);

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/www/index.html"));
});

app.use(express.static(__dirname + "/www"));

app.get("/", (req, res) => {
  res.render(__dirname + "/www/index");
  // res.sendFile(__dirname + "/www/index.html");
});
app.post("/", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return renderError(res, 400, "No files were uploaded.");
  }

  audioFile = req.files.audio;

  const timeStamp = new Date().getTime();
  const file = `${uploadPath}/${timeStamp}.webm`;

  if (audioFile.mimetype !== "audio/webm") {
    return renderError(res, 400, "Invalid file type.");
  }

  audioFile.mv(file, function (err) {
    //
    if (err) {
      return renderError(res, 400, "Error uploading file.", err);
    }

    return res.json({
      status: true,
      message: "File uploaded",
    });
  });
});

app.get("/files", (req, res) => {
  let directoryPath = __dirname + "/www/files";
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return renderError(res, 400, "Error reading directory.", err);
    }

    let audioFiles = files.filter((file) => {
      return path.extname(file).toLowerCase() === ".webm";
    });
    
    console.log(audioFiles);

    res.render(__dirname + "/www/files", { audioFiles });
  });
});

const renderError = (res, code, message, err) => {
  res.status(400).json({
    status: false,
    message,
    err,
  });
};

app.listen(port);
console.log("Running at " + port);
