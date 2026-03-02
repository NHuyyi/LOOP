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
const getFriendList = require("../controller/friends/getFriendList");
const getFriendListFilter = require("../controller/friends/getFriendListFilter");

router.post("/sendRequest", authorize, sendRequest.sendRequest);
router.post("/acceptRequest", authorize, acceptRequest.acceptRequest);
router.post("/rejectRequest", authorize, rejectRequest.rejectRequest);
router.post("/removeFriend", authorize, removeFriend.removeRequest);
router.post("/findnewfriend", authorize, findnewfriend.findnewfriend);
router.post(
  "/checkFriendStatus",
  authorize,
  checkFriendStatus.checkFriendStatus,
);
router.post("/cancelRequest", authorize, cancelRequest.cacleRequest);
router.post("/getFriendList", authorize, getFriendList.getFriendList);
router.post(
  "/getFriendListFilter",
  authorize,
  getFriendListFilter.getFriendListFilter,
);

module.exports = router;
