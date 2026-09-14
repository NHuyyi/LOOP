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
const { editPost } = require("../controller/posts/editpost");
const { changePostVisibility } = require("../controller/posts/postvisibility");
const authorize = require("../middleware/authorize");
const Authorization = require("../middleware/Authorization");

router.post("/uploadImage",Authorization, authorize("user"), upload.single("image"), uploadImage);
router.post("/newpost",Authorization, authorize("user"), NewPost);
router.post("/getNewsFeed",Authorization, authorize("user"), getNewsFeed);
router.post("/addReaction",Authorization, authorize("user"), addReaction);
router.post("/countReactions",Authorization, authorize("user"), countReactions);
router.get("/:postId/reactions/list",Authorization, authorize("user"), getReactionList);
router.post("/createComments",Authorization, authorize("user"), createComment);
router.get("/:postId/comments/list",Authorization, authorize("user"), getCommentsList);
router.post("/reactcomment",Authorization, authorize("user"), reactComment);
router.get(
  "/:postId/comments/reactions/list",Authorization, authorize("user"),
  getReactComentList
);
router.post("/delete/comments",Authorization, authorize("user"), deleteComment);
router.post("/update/comments",Authorization, authorize("user"), updateComment);
router.post("/delete/post",Authorization, authorize("user"), deletePost);
router.post("/edit/post",Authorization, authorize("user"), editPost);
router.post("/change/post/visibility",Authorization, authorize("user"), changePostVisibility);
module.exports = router;
