const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware"); // ✅ FIXED
const upload = require("../middleware/uploadResume");

const {
  uploadResume,
  getResume,
  deleteResume
} = require("../controllers/resumeController");


// Upload Resume
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);


// Get User Resume
router.get(
  "/",
  protect,
  getResume
);


// Delete Resume
router.delete(
  "/",
  protect,
  deleteResume
);

module.exports = router;