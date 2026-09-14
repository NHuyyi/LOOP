const express = require("express");
const router = express.Router();
const getSettings = require("../controller/notification/getSettings");
const updateSettings = require("../controller/notification/updateSettings");
const subscribePush = require("../controller/notification/subscribePush")
const getNotifications = require("../controller/notification/getNotifications")
const markAsRead = require("../controller/notification/markAsRead")
const authorize = require("../middleware/authorize");
const Authorization = require("../middleware/Authorization");

router.get("/get-settings-sounds",Authorization, authorize("user"), getSettings.getSettings);
router.put("/update-settings-sounds",Authorization, authorize("user"), updateSettings.updateSettings);
router.post("/subscribe-push",Authorization, authorize("user"), subscribePush.subscribePush);
router.get("/list",Authorization, authorize("user"), getNotifications.getNotifications);
router.put("/mark-read/:notiId",Authorization, authorize("user"), markAsRead.markAllAsRead);
module.exports = router;