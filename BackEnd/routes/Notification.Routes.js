const express = require("express");
const router = express.Router();
const getSettings = require("../controller/notification/getSettings");
const updateSettings = require("../controller/notification/updateSettings");
const subscribePush = require("../controller/notification/subscribePush")
const getNotifications = require("../controller/notification/getNotifications")
const markAsRead = require("../controller/notification/markAsRead")
const authorize = require("../middleware/authorize");
const Authorization = require("../middleware/Authorization");

router.get("/get-settings-sounds",Authorization, authorize("user", "admin"), getSettings.getSettings);
router.put("/update-settings-sounds",Authorization, authorize("user", "admin"), updateSettings.updateSettings);
router.post("/subscribe-push",Authorization, authorize("user", "admin"), subscribePush.subscribePush);
router.get("/list",Authorization, authorize("user", "admin"), getNotifications.getNotifications);
router.put("/mark-read/:notiId",Authorization, authorize("user", "admin"), markAsRead.markAllAsRead);
module.exports = router;