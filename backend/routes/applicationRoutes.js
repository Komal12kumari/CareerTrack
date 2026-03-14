const express = require("express");
const router = express.Router();

const {
  addApplication,
  getApplications,
  deleteApplication,
  getApplicationAnalytics,
} = require("../controllers/applicationController");

// ✅ Correct import
const { protect } = require("../middleware/authMiddleware");

// Add application
router.post("/", protect, addApplication);

// Get all applications
router.get("/", protect, getApplications);

// Delete application
router.delete("/:id", protect, deleteApplication);

// Analytics route
router.get("/analytics", protect, getApplicationAnalytics);

module.exports = router;