const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { protect } = require("../middleware/authMiddleware");


// Add Job
router.post("/add", protect, async (req, res) => {
  try {
    const { company, role, status, date, notes } = req.body;

    const job = new Job({
      company,
      role,
      status,
      date,
      notes,
      userId: req.user._id,
    });

    await job.save();

    res.json({ message: "Job added successfully", job });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// Get Jobs
router.get("/", protect, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(jobs);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// Delete Job
router.delete("/:id", protect, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// Update Job
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;