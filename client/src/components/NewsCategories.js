import React, { useContext, useEffect } from "react";
import { NewsContext } from "./NewsContext";
import Spinner from "./Spinner"; // Assume you have a spinner component

const NewsCategories = () => {
  const { categories, articles, fetchNewsArticles, loading, error } =
    useContext(NewsContext);

  useEffect(() => {
    if (categories.length > 0) {
      // Fetch articles for the first category as an example
      fetchNewsArticles(categories[0].name);
    }
  }, [categories, fetchNewsArticles]);

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>News Articles</h1>
      {articles.map((article, index) => (
        <div key={index} className="article">
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsCategories;
