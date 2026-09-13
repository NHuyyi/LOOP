const express = require("express");
const router = express.Router();
const getSettings = require("../controller/notification/getSettings");
const updateSettings = require("../controller/notification/updateSettings");
const subscribePush = require("../controller/notification/subscribePush")
const getNotifications = require("../controller/notification/getNotifications")
const markAsRead = require("../controller/notification/markAsRead")
const authorize = require("../middleware/Authorization");

router.get("/get-settings-sounds", authorize, getSettings.getSettings);
router.put("/update-settings-sounds", authorize, updateSettings.updateSettings);
router.post("/subscribe-push", authorize, subscribePush.subscribePush);
router.get("/list", authorize, getNotifications.getNotifications);
router.put("/mark-read/:notiId", authorize, markAsRead.markAllAsRead);
module.exports = router;