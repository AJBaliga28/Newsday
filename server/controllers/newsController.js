const axios = require("axios");
const { spawn } = require("child_process");
require("dotenv").config();

const BASE_URL = "https://newsapi.org/v2";
const API_KEY = process.env.NEWS_API_KEY;

// Fetch news articles by category with pagination
exports.getArticlesByCategory = async (req, res) => {
  const { category } = req.params;
  // console.log(category);
  const page = req.query.page || 1; // Default to page 1 if not provided
  const pageSize = req.query.pageSize || 10; // Default to 10 articles per page

  try {
    const response = await axios.get(
      `${BASE_URL}/everything?q=${category}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`
    );
    console.log(response.data.articles);
    res.status(200).json(response.data.articles); // Send only the articles part of the response
  } catch (error) {
    console.error(`Error fetching articles for category ${category}:`, error);
    res
      .status(500)
      .json({ message: `Error fetching articles for category ${category}` });
  }
};

exports.searchNewsArticles = async (req, res) => {
  const { query } = req.query; // Extract the search query from URL query params

  try {
    const response = await axios.get(
      `${BASE_URL}/everything?q=${query}&apiKey=${API_KEY}`,
      {
        headers: {
          // Set required headers if the external API enforces specific headers
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    console.log(response.data.articles[0]);
    res.status(200).json(response.data.articles); // Send only the articles part of the response
  } catch (error) {
    console.error(`Error fetching search results for query ${query}:`, error);
    res
      .status(500)
      .json({ message: `Error fetching search results for query ${query}` });
  }
};

// Fetch latest news articles
exports.getLatestNews = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;

  try {
    const response = await axios.get(
      `${BASE_URL}/top-headlines?country=us&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`
    );
    res.status(200).json(response.data.articles);
  } catch (error) {
    console.error("Error fetching latest news:", error);
    res.status(500).json({ message: "Error fetching latest news" });
  }
};

// Fetch recommended articles based on user's ID
exports.getRecommendedArticles = async (req, res) => {
  const userId = req.user.id;
  console.log("Hit the function: ", userId);

  const pythonProcess = spawn("python3", ["scripts/recommend.py", userId]);

  let data = "";
  let responseSent = false; // Track if response is already sent

  pythonProcess.stdout.on("data", (chunk) => {
    data += chunk.toString();
  });

  pythonProcess.stderr.on("data", (error) => {
    const errorMessage = error.toString().trim();
    console.error(`Python Error: ${errorMessage}`); // Log stderr output

    // If stderr contains critical error messages, respond with failure
    if (
      errorMessage.toLowerCase().includes("error") || // Check for critical error keywords
      errorMessage.toLowerCase().includes("failed")
    ) {
      if (!responseSent) {
        responseSent = true;
        return res
          .status(500)
          .json({ error: "!responseSent - Failed to get recommendations" });
      }
    } else {
      // Non-critical logs in stderr can be ignored or logged for debugging
      console.log(`Non-critical log from Python: ${errorMessage}`);
    }
  });

  pythonProcess.on("close", async (code) => {
    console.log(`Python process exited with code ${code}`);

    if (responseSent) return; // Skip if response is already sent

    if (code === 0) {
      try {
        const recommendedTitles = JSON.parse(data); // Parse Python output
        console.log("Recommended Titles:", recommendedTitles);

        if (!recommendedTitles.length) {
          return res.status(200).json([]); // No recommendations
        }

        // Fetch news articles from NewsAPI based on the recommended titles
        const articlePromises = recommendedTitles.map((title) =>
          axios.get(
            `${BASE_URL}/everything?q=${encodeURIComponent(
              title
            )}&apiKey=${API_KEY}`
          )
        );
        const responses = await Promise.all(articlePromises);
        console.log("NewsAPI responses:", responses);

        const articles = responses.flatMap(
          (response) => response.data.articles
        );
        // console.log("Recommended Articles: ", articles);
        res.status(200).json(articles); // Send articles in response
      } catch (error) {
        console.error("Error fetching recommended articles:", error);
        if (!responseSent) {
          res
            .status(500)
            .json({ message: "Error fetching recommended articles" });
        }
      }
    } else {
      console.error(`Python process exited with code ${code}`);
      if (!responseSent) {
        res
          .status(500)
          .json({ error: "Last one - Failed to get recommendations" });
      }
    }
  });
};
