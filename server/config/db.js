// /config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((error) => console.error("Error connecting to MongoDB:", error));
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
