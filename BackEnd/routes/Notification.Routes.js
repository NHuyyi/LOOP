const express = require("express");
const router = express.Router();
const getSettings = require("../controller/notification/getSettings");
const updateSettings = require("../controller/notification/updateSettings");
const subscribePush = require("../controller/notification/subscribePush")
const authorize = require("../middleware/Authorization");


router.get("/get-settings-sounds", authorize, getSettings.getSettings);
router.put("/update-settings-sounds", authorize, updateSettings.updateSettings);
router.post("/subscribe-push", authorize, subscribePush.subscribePush);
module.exports = router;