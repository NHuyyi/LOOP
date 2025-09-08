const express = require("express");
const router = express.Router();
const { upload, uploadImage } = require("../controller/posts/uploadimage");
const { NewPost } = require("../controller/posts/newpost");
const { getNewsFeed } = require("../controller/posts/getpost");
const { addReaction } = require("../controller/posts/addreaction");
const { countReactions } = require("../controller/posts/CountReaction");
const Authorization = require("../middleware/Authorization");

router.post("/uploadImage", Authorization, upload.single("image"), uploadImage);
router.post("/newpost", Authorization, NewPost);
router.post("/getNewsFeed", Authorization, getNewsFeed);
router.post("/addReaction", Authorization, addReaction);
router.post("/countReactions", Authorization, countReactions);

module.exports = router;
