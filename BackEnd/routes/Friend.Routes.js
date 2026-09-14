const express = require("express");
const router = express.Router();
const sendRequest = require("../controller/friends/sendRequest");
const acceptRequest = require("../controller/friends/acceptRequest");
const rejectRequest = require("../controller/friends/rejectRequest");
const removeFriend = require("../controller/friends/removefriend");
const findnewfriend = require("../controller/friends/findnewfriend");
const checkFriendStatus = require("../controller/friends/checkstatust");
const cancelRequest = require("../controller/friends/cancleRequest");
const authorize = require("../middleware/authorize");
const Authorization = require("../middleware/Authorization");
const getFriendList = require("../controller/friends/getFriendList");
const getFriendListFilter = require("../controller/friends/getFriendListFilter");

router.post("/sendRequest",Authorization, authorize("user"), sendRequest.sendRequest);
router.post("/acceptRequest",Authorization, authorize("user"), acceptRequest.acceptRequest);
router.post("/rejectRequest",Authorization, authorize("user"), rejectRequest.rejectRequest);
router.post("/removeFriend",Authorization, authorize("user"), removeFriend.removeRequest);
router.post("/findnewfriend",Authorization, authorize("user"), findnewfriend.findnewfriend);
router.post(
  "/checkFriendStatus",Authorization,
  authorize("user"),
  checkFriendStatus.checkFriendStatus,
);
router.post("/cancelRequest",Authorization, authorize("user"), cancelRequest.cacleRequest);
router.post("/getFriendList",Authorization, authorize("user"), getFriendList.getFriendList);
router.post(
  "/getFriendListFilter",Authorization,
  authorize("user"),
  getFriendListFilter.getFriendListFilter,
);

module.exports = router;
