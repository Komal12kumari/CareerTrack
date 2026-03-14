const Resume = require("../models/Resume");
const fs = require("fs");
const pdfParse = require("pdf-parse");
// ---------------- Role Skills ----------------

const roleSkills = {
  "Frontend Intern": ["HTML", "CSS", "JavaScript", "React"],
  "Backend Intern": ["Node.js", "Express", "MongoDB", "SQL"],
  "Full Stack Intern": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB"
  ],
  "Data Analyst Intern": [
    "Python",
    "SQL",
    "Excel",
    "Pandas",
    "Matplotlib"
  ]
};

// ---------------- Skill Variations ----------------

const skillMap = {
  HTML: ["html"],
  CSS: ["css"],
  JavaScript: ["javascript", "js"],
  React: ["react", "react.js"],
  "Node.js": ["node", "node.js"],
  Express: ["express"],
  MongoDB: ["mongodb", "mongo"],
  SQL: ["sql"],
  Python: ["python"],
  Excel: ["excel"],
  Pandas: ["pandas"],
  Matplotlib: ["matplotlib"],
  Git: ["git"]
};

// ---------------- Extract Skills ----------------

const extractSkills = (text) => {

  const foundSkills = [];
  const lowerText = text.toLowerCase();

  for (const skill in skillMap) {

    const variations = skillMap[skill];

    for (const word of variations) {

      if (lowerText.includes(word)) {

        if (!foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }

      }

    }

  }

  return foundSkills;
};


// ---------------- Upload Resume ----------------

exports.uploadResume = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: "No file uploaded"
      });

    }

    const userId = req.user.id;
    const roleInput = req.body.role;

    if (!roleInput) {

      return res.status(400).json({
        message: "Role is required"
      });

    }

    // Find correct role key
    const roleKey = Object.keys(roleSkills).find(
      r => r.toLowerCase() === roleInput.toLowerCase()
    );

    if (!roleKey) {

      return res.status(400).json({
        message: "Invalid role"
      });

    }

    const requiredSkills = roleSkills[roleKey];

    // ---------------- Read PDF ----------------

    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text || "";

    console.log("PDF TEXT:", text); // Debug

    // ---------------- Extract Skills ----------------

    const skills = extractSkills(text);

    // ---------------- Match Skills ----------------

    const matchedSkills = requiredSkills.filter(skill =>
      skills.includes(skill)
    );

    const missingSkills = requiredSkills.filter(skill =>
      !skills.includes(skill)
    );

    // ---------------- Save Resume ----------------

    let resume = await Resume.findOne({ user: userId });

    if (resume) {

      resume.fileUrl = req.file.path;
      resume.uploadedAt = new Date();

      await resume.save();

    } else {

      resume = await Resume.create({
        user: userId,
        fileUrl: req.file.path
      });

    }

    // ---------------- Response ----------------

    res.status(200).json({

      message: "Resume uploaded successfully",

      skills,
      matchedSkills,
      missingSkills,

      fileUrl: resume.fileUrl

    });

  } catch (error) {

    console.log("Resume Upload Error:", error);

    res.status(500).json({
      message: "Server error while uploading resume"
    });

  }

};


// ---------------- Get Resume ----------------

exports.getResume = async (req, res) => {

  try {

    const resume = await Resume.findOne({ user: req.user.id });

    if (!resume) {

      return res.status(404).json({
        message: "No resume found"
      });

    }

    res.json(resume);

  } catch (error) {

    console.log("Get Resume Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


// ---------------- Delete Resume ----------------

exports.deleteResume = async (req, res) => {

  try {

    const resume = await Resume.findOneAndDelete({
      user: req.user.id
    });

    if (!resume) {

      return res.status(404).json({
        message: "Resume not found"
      });

    }

    res.json({
      message: "Resume deleted successfully"
    });

  } catch (error) {

    console.log("Delete Resume Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};