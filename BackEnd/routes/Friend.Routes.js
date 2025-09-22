const express = require("express");
const router = express.Router();
const sendRequest = require("../controller/friends/sendRequest");
const acceptRequest = require("../controller/friends/acceptRequest");
const rejectRequest = require("../controller/friends/rejectRequest");
const removeFriend = require("../controller/friends/removefriend");
const findnewfriend = require("../controller/friends/findnewfriend");
const checkFriendStatus = require("../controller/friends/checkstatust");
const cancelRequest = require("../controller/friends/cancleRequest");
const authorize = require("../middleware/Authorization");

router.post("/sendRequest", authorize, sendRequest.sendRequest);
router.post("/acceptRequest", authorize, acceptRequest.acceptRequest);
router.post("/rejectRequest", authorize, rejectRequest.rejectRequest);
router.post("/removeFriend", authorize, removeFriend.removeRequest);
router.post("/findnewfriend", authorize, findnewfriend.findnewfriend);
router.post(
  "/checkFriendStatus",
  authorize,
  checkFriendStatus.checkFriendStatus
);
router.post("/cancelRequest", authorize, cancelRequest.cacleRequest);

module.exports = router;
