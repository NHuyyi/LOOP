const express = require("express");
const router = express.Router();
const getSettings = require("../controller/notification/getSettings");
const updateSettings = require("../controller/notification/updateSettings");
const authorize = require("../middleware/Authorization");


router.get("/get-settings-sounds", authorize, getSettings.getSettings);
router.put("/update-settings-sounds", authorize, updateSettings.updateSettings);

module.exports = router;