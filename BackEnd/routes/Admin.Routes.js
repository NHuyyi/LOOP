const express = require("express");
const router = express.Router();
const Authorization = require("../middleware/Authorization");
const authorize = require("../middleware/authorize");
const { getAllUsers } = require("../controller/admin/getAllUsers"); // Thêm dòng này
const { hardDeleteUser } = require("../controller/admin/deleteUser");
const { createReport } = require("../controller/admin/createReport");
const { manualBanUser } = require("../controller/admin/manualBanUser");
const { getAllReports } = require("../controller/admin/getAllReports");
const { rejectReport } = require("../controller/admin/rejectReport");

router.get("/users", Authorization, authorize("admin"), getAllUsers);
router.post("/hard-delete-user", Authorization, authorize("admin"), hardDeleteUser);
router.post("/create-report", Authorization, authorize("user"), createReport);
router.post("/manual-ban", Authorization, authorize("admin"), manualBanUser);
router.get("/reports", Authorization, authorize("admin"), getAllReports);
router.post("/reject-report", Authorization, authorize("admin"), rejectReport);
module.exports = router;