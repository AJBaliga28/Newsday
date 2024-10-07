const express = require("express");
const {
  getArticlesByCategory,
  searchNewsArticles,
  getRecommendedArticles,
  getLatestNews,
} = require("../controllers/newsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//Route to get latest news
router.get("/latest", getLatestNews);

// Route to get articles by category
router.get("/category/:category", getArticlesByCategory);

// Route to get articles by user query
router.get("search/:query", searchNewsArticles);

// Route to get recommended articles (optional)
// router.get("/recommendations", getRecommendedArticles);
router.get("/get-recommendations", authMiddleware, getRecommendedArticles);

module.exports = router;
