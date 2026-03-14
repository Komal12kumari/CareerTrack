const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
const problemRoutes = require("./routes/problemRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const resumeRoutes = require("./routes/resumeRoutes"); // Resume routes

const app = express();

app.use(cors());
app.use(express.json());


// Serve uploaded resumes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Root Route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// Auth Routes
app.use("/api/auth", authRoutes);


// Problems Routes
app.use("/api/problems", problemRoutes);


// Applications Routes
app.use("/api/applications", applicationRoutes);


// Resume Routes
app.use("/api/resume", resumeRoutes);


// Protected Test Route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

module.exports = app;