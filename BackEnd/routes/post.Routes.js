const express = require("express");
const router = express.Router();
const { upload, uploadImage } = require("../controller/posts/uploadimage");
const { NewPost } = require("../controller/posts/newpost");
const { getNewsFeed } = require("../controller/posts/getpost");
const { addReaction } = require("../controller/posts/reaction/addreaction");
const {
  countReactions,
} = require("../controller/posts/reaction/CountReaction");
const {
  getReactionList,
} = require("../controller/posts/reaction/ReactionList");
const { createComment } = require("../controller/posts/comment/createComment");
const {
  getCommentsList,
} = require("../controller/posts/comment/getCommentList");
const { reactComment } = require("../controller/posts/comment/reactcomment");
const {
  getReactComentList,
} = require("../controller/posts/comment/reactCommentList");
const { deleteComment } = require("../controller/posts/comment/deletecomment");
const { updateComment } = require("../controller/posts/comment/updatecomment");
const { deletePost } = require("../controller/posts/deletepost");
const Authorization = require("../middleware/Authorization");

router.post("/uploadImage", Authorization, upload.single("image"), uploadImage);
router.post("/newpost", Authorization, NewPost);
router.post("/getNewsFeed", Authorization, getNewsFeed);
router.post("/addReaction", Authorization, addReaction);
router.post("/countReactions", Authorization, countReactions);
router.get("/:postId/reactions/list", Authorization, getReactionList);
router.post("/createComments", Authorization, createComment);
router.get("/:postId/comments/list", Authorization, getCommentsList);
router.post("/reactcomment", Authorization, reactComment);
router.get(
  "/:postId/comments/reactions/list",
  Authorization,
  getReactComentList
);
router.post("/delete/comments", Authorization, deleteComment);
router.post("/update/comments", Authorization, updateComment);
router.post("/delete/post", Authorization, deletePost);
module.exports = router;
