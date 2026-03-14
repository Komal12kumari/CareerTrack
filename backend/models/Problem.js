const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    topic: {
      type: String,
      default: "",
    },

    isSolved: {
      type: Boolean,
      default: false,
    },

    // ⭐ Store date when problem is solved
    solvedDate: {
      type: Date,
      default: null,
    },

    link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);