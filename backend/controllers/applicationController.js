const Application = require("../models/Application");


// ADD APPLICATION
exports.addApplication = async (req, res) => {
  try {

    const { company, role, status, link, notes } = req.body;

    const application = await Application.create({
      user: req.user.id,
      company,
      role,
      status,
      link,
      notes,
    });

    res.status(201).json(application);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL APPLICATIONS
exports.getApplications = async (req, res) => {
  try {

    const applications = await Application.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE APPLICATION
exports.deleteApplication = async (req, res) => {
  try {

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: "Application deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// APPLICATION ANALYTICS
exports.getApplicationAnalytics = async (req, res) => {
  try {

    const userId = req.user.id;

    const total = await Application.countDocuments({ user: userId });

    const applied = await Application.countDocuments({
      user: userId,
      status: "Applied",
    });

    const interview = await Application.countDocuments({
      user: userId,
      status: "Interview",
    });

    const offer = await Application.countDocuments({
      user: userId,
      status: "Offer",
    });

    const rejected = await Application.countDocuments({
      user: userId,
      status: "Rejected",
    });

    res.json({
      total,
      applied,
      interview,
      offer,
      rejected,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};