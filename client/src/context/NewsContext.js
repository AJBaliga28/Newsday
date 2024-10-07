import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create a context to hold news-related data and functions
export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendedArticles, setRecommendedArticles] = useState([]);

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/news`, // Adjust according to your backend
    headers: { "Content-Type": "application/json" },
  });

  // Filter function to check if an article should be excluded
  const isArticleValid = (article) => {
    return (
      article.title !== "[Removed]" &&
      article.description !== "[Removed]" &&
      article.source?.name !== "[Removed]" &&
      article.urlToImage !== null // Optionally, you can check if urlToImage is not null if required
    );
  };

  // Fetch articles by category with pagination
  const fetchNewsByCategory = async (category, page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/category/${category}?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Filter out invalid articles
      const filteredArticles = response.data.filter(isArticleValid);
      setArticles((prevArticles) => [...prevArticles, ...filteredArticles]); // Append new articles
    } catch (err) {
      setError("Error fetching news articles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch search results
  const searchNews = async (query, page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/search/q=${query}&page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Filter out invalid articles
      const filteredArticles = response.data.filter(isArticleValid);

      if (page === 1) {
        setArticles(filteredArticles); // Overwrite state on first page
      } else {
        setArticles((prevArticles) => [...prevArticles, ...filteredArticles]); // Append subsequent pages
      }
    } catch (err) {
      setError("Error fetching search results");
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest news
  const fetchLatestNews = async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/latest?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Filter out invalid articles
      const filteredArticles = response.data.filter(isArticleValid);
      setArticles((prevArticles) => [...prevArticles, ...filteredArticles]); // Append latest news
    } catch (err) {
      setError("Error fetching latest news");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/get-recommendations`, // Adjust the endpoint as necessary
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Filter out invalid articles
      const filteredArticles = response.data.filter(isArticleValid);
      setRecommendedArticles(filteredArticles);
    } catch (err) {
      setError("Error fetching recommended articles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NewsContext.Provider
      value={{
        articles,
        loading,
        error,
        recommendedArticles,
        setArticles,
        fetchNewsByCategory,
        searchNews,
        fetchLatestNews,
        fetchRecommendedArticles,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
