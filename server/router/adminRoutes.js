const express = require("express");
const {
  getAllUsers,
  updateUserPermissions,
  updateTask,
  updateLocation,
} = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", protectAdmin, getAllUsers);
router.put("/updatePermissions", protectAdmin, updateUserPermissions);
router.put("/updateTask", updateTask);
router.put("/updateLocation", updateLocation);

module.exports = router;
