const express = require("express");
const router = express.Router();
const {
  CreatePostType,
  GetPostTypeListing,
} = require("../controller/PostTypeController");
const {} = require("../middleware/Auth");

router.route("/CreatePostType").post(CreatePostType);
router.route("/GetPostTypeListing").get(GetPostTypeListing);

module.exports = router;
