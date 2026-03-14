require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

// Job Routes
const jobRoutes = require("./routes/jobs");

// Use Job API
app.use("/api/jobs", jobRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error ❌", err);
  });