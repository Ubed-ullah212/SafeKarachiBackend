const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const BodyParser = require("body-parser");
const Upload = require("express-fileupload");
const path = require("path");
const Applymiddleware = require("./middleware/ErrorCallBackReturn");
const cors = require("cors");
const UserRoutes = require("./routes/UserRoutes");
const PostTypeRoutes = require("./routes/PostTypeRoutes");
const PostRoutes = require("./routes/PostRoutes");
const router = express.Router();
app.use(express.json());
app.use(cookieParser());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(Upload());
app.use(cors());
app.use("/api/v1", UserRoutes);
app.use("/api/v1", PostRoutes);
app.use("/api/v1", PostTypeRoutes);
app.use(
  "/",
  router.get("/uploads/:image", (req, res) => {
    var image = req.params.image;
    res.sendFile(__dirname + "/uploads/" + image, (err) => {
      if (err) {
        res.status(500).send("Internal Server Error " + err);
      }
    });
  })
);
app.use(Applymiddleware);

module.exports = app;
