const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" }, // Optional bio field
    location: { type: String, default: "" }, // Optional location field
    timezone: { type: String, default: "" }, // Optional timezone field
    interests: { type: [String], default: [] }, // Array of interests, default to empty array
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
