const express = require("express");
const router = express.Router();
const {
  CreateUser,
  GetUser,
  LoginUser,
  SingleUser,
  EditUser,
} = require("../controller/UserController");
const { VerifyUser } = require("../middleware/Auth");
router.route("/SingleUser").get(VerifyUser, SingleUser);
router.route("/EditUser").put(VerifyUser, EditUser);
router.route("/CreateUser").post(CreateUser);
router.route("/LoginUser").post(LoginUser);
module.exports = router;
