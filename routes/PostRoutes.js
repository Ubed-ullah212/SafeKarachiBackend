const express = require("express");
const router = express.Router();
const {
  CreatePost,
  SoftDeletePost,
  GetPostListing,
  EditPost,
  LikePost,
  UnLikePost,
  CommentPost,
  LikedComment,
  UnLikeComment,
} = require("../controller/PostController");
const { VerifyUser } = require("../middleware/Auth");

router.route("/UnLikeComment/:id").delete(VerifyUser, UnLikeComment);
router.route("/LikedComment/:id").post(VerifyUser, LikedComment);
router.route("/CommentPost/:id").post(VerifyUser, CommentPost);
router.route("/UnLikePost/:id").get(VerifyUser, UnLikePost);
router.route("/LikePost/:id").get(VerifyUser, LikePost);
router.route("/CreatePost").post(VerifyUser, CreatePost);
router.route("/SoftDeletePost/:id").delete(SoftDeletePost);
router.route("/GetPostListing").get(VerifyUser, GetPostListing);
router.route("/EditPost/:id").put(VerifyUser, EditPost);
module.exports = router;
