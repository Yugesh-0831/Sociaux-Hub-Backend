const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected");
  } catch (e) {
    console.log(e.message);
  }
}

main();

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//middleware
app.use(express.static(path.resolve(__dirname, "build")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json()); //it lets our server accept json
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(
  cors({
    origin: "*",
  })
);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
    res.json(e.message);
  }
});

app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/posts", postRoute);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log("backend server is readyy");
});
