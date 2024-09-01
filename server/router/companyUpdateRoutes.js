const express = require("express");
const {
  getAllUpdates,
  addUpdate,
  deleteUpdate,
} = require("../controllers/companyUpdateController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/updates", getAllUpdates);
router.post("/addUpdate", addUpdate);
router.delete("/deleteUpdate/:updateId", deleteUpdate);

module.exports = router;
