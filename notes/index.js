const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const note = require("./routes/note");
const user = require("./routes/user");

const MAX_FILE_SIZE = 8388608; // 8 MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + Math.round(Math.random() * 500);
    cb(null, name + ".pdf");
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are supported"), false);
    } else {
      cb(null, true);
    }
  },
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  const loggerFileStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    {
      flags: "a",
    }
  );
  app.use(
    morgan("short", {
      stream: loggerFileStream,
    })
  );
}
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/api", upload.single("pdf"), note);
app.use("/api/users", user);

mongoose
  .connect(
    "mongodb+srv://raspace:IpwWauPKlo2JyRT6@cluster0.suuodyr.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log("Server running on port: ", PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
