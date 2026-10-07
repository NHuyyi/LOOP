const express = require("express");
const router = express.Router();
const { getShopItems } = require("../controller/shop/getShopItems");
const { buySticker } = require("../controller/shop/buySticker");
const authorize = require("../middleware/authorize");
const Authorization = require("../middleware/Authorization");

router.get("/stickers",Authorization, authorize("user", "admin"), getShopItems);
router.post("/buy", Authorization, authorize("user", "admin"), buySticker);

module.exports = router;