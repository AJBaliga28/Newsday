const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const newsRoutes = require("./routes/newsRoutes");
const savedItemsRoutes = require("./routes/savedItemsRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const authMiddleware = require("./middlewares/authMiddleware");
require("dotenv").config();

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Connect to database
connectDB();

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Enable CORS
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// app.use(authMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/saved-items", savedItemsRoutes);

app.get("/", (req, res) => {
  return res.send("<h1> Yo! </h1>");
});

// Error handling middleware
app.use(errorMiddleware);

// Server configuration
const PORT = process.env.PORT || 5005;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
