import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { NewsProvider } from "./context/NewsContext";
import { SavedItemsProvider } from "./context/SavedItemsContext"; // Import SavedItemsProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <NewsProvider>
        <SavedItemsProvider>
          <App />
        </SavedItemsProvider>
      </NewsProvider>
    </UserProvider>
  </React.StrictMode>
);
