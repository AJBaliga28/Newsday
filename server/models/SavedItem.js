const mongoose = require("mongoose");

const SavedItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    article: { type: Object, required: true }, // Store article data
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedItem", SavedItemSchema);
