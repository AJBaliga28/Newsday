import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context
export const SavedItemsContext = createContext();

export const SavedItemsProvider = ({ children }) => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch saved articles when the component mounts
  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/saved-items",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSavedArticles(response.data); // Set fetched saved articles
      } catch (err) {
        setError("Failed to fetch saved articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, []);

  // Function to save an article
  const saveArticle = async (article) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/saved-items",
        { article },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Add new saved article to state
      setSavedArticles([...savedArticles, response.data]);
    } catch (err) {
      console.error("Error saving article:", err);
    }
  };

  // Function to remove an article by URL
  const removeArticle = async (url) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/saved-items/${encodeURIComponent(url)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Remove the article from state after successful deletion
      setSavedArticles(
        savedArticles.filter((article) => article.article.url !== url)
      );
    } catch (err) {
      console.error("Error removing article:", err);
    }
  };

  // Helper function to check if an article is saved
  const isArticleSaved = (url) => {
    return savedArticles.some((saved) => saved.article.url === url);
  };

  return (
    <SavedItemsContext.Provider
      value={{
        savedArticles,
        loading,
        error,
        saveArticle,
        removeArticle,
        isArticleSaved, // Pass the helper function
      }}
    >
      {children}
    </SavedItemsContext.Provider>
  );
};
