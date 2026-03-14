const Problem = require("../models/Problem");


// ================= CREATE PROBLEM =================
exports.createProblem = async (req, res) => {
  try {
    const { title, difficulty, topic, link } = req.body;

    if (!title || !difficulty) {
      return res.status(400).json({
        message: "Title and difficulty are required",
      });
    }

    const problem = await Problem.create({
      user: req.user._id,
      title,
      difficulty,
      topic,
      link,
    });

    res.status(201).json(problem);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================= GET PROBLEMS =================
exports.getProblems = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }

    const problems = await Problem.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Problem.countDocuments(filter);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      problems,
    });
  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================= UPDATE PROBLEM =================
exports.updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    if (problem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    problem.title = req.body.title ?? problem.title;
    problem.difficulty = req.body.difficulty ?? problem.difficulty;
    problem.topic = req.body.topic ?? problem.topic;
    problem.link = req.body.link ?? problem.link;

    // ⭐ Handle solved toggle
    if (req.body.isSolved !== undefined) {
      problem.isSolved = req.body.isSolved;

      if (req.body.isSolved === true) {
        problem.solvedDate = new Date();
      } else {
        problem.solvedDate = null;
      }
    }

    const updatedProblem = await problem.save();

    res.json(updatedProblem);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE PROBLEM =================
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    if (problem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await problem.deleteOne();

    res.json({
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================= ANALYTICS =================
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalProblems = await Problem.countDocuments({
      user: userId,
    });

    const totalSolved = await Problem.countDocuments({
      user: userId,
      isSolved: true,
    });

    const easy = await Problem.countDocuments({
      user: userId,
      difficulty: "Easy",
    });

    const medium = await Problem.countDocuments({
      user: userId,
      difficulty: "Medium",
    });

    const hard = await Problem.countDocuments({
      user: userId,
      difficulty: "Hard",
    });

    const solvedPercentage =
      totalProblems === 0
        ? 0
        : Math.round((totalSolved / totalProblems) * 100);

    res.json({
      totalProblems,
      totalSolved,
      easy,
      medium,
      hard,
      solvedPercentage,
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================= STREAK =================
exports.getStreak = async (req, res) => {
  try {
    const problems = await Problem.find({
      user: req.user._id,
      isSolved: true,
      solvedDate: { $ne: null }
    }).sort({ solvedDate: -1 });

    if (problems.length === 0) {
      return res.json({ streak: 0 });
    }

    let streak = 1;
    let lastDate = new Date(problems[0].solvedDate);

    for (let i = 1; i < problems.length; i++) {
      const currentDate = new Date(problems[i].solvedDate);

      const diff =
        (lastDate - currentDate) / (1000 * 60 * 60 * 24);

      if (Math.floor(diff) === 1) {
        streak++;
        lastDate = currentDate;
      } else if (Math.floor(diff) > 1) {
        break;
      }
    }

    res.json({ streak });

  } catch (error) {
    console.error("STREAK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};