const express = require("express");
const router = express.Router();

const {
  createProblem,
  getProblems,
  updateProblem,
  deleteProblem,
  getAnalytics,
  getStreak
} = require("../controllers/problemController");

const { protect } = require("../middleware/authMiddleware");

// 📊 Analytics
router.get("/analytics", protect, getAnalytics);

// 🔥 Streak
router.get("/streak", protect, getStreak);

// ➕ Create problem
router.post("/", protect, createProblem);

// 📄 Get problems
router.get("/", protect, getProblems);

// ✏️ Update problem
router.put("/:id", protect, updateProblem);

// ❌ Delete problem
router.delete("/:id", protect, deleteProblem);

module.exports = router;