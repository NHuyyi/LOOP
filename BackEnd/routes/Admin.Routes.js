const express = require("express");
const router = express.Router();
const Authorization = require("../middleware/Authorization");
const authorize = require("../middleware/authorize");
const { getAllUsers } = require("../controller/admin/getAllUsers"); // Thêm dòng này
const { hardDeleteUser } = require("../controller/admin/deleteUser");
router.get("/users", Authorization, authorize("admin"), getAllUsers);
router.post("/hard-delete-user", Authorization, authorize("admin"), hardDeleteUser);

module.exports = router;