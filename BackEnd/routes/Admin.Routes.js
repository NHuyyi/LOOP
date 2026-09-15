const express = require("express");
const router = express.Router();
const Authorization = require("../middleware/Authorization");
const authorize = require("../middleware/authorize");
const { getAllUsers } = require("../controller/admin/getAllUsers"); // Thêm dòng này

router.get("/users", Authorization, authorize("admin"), getAllUsers);
module.exports = router;