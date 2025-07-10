import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";

// ✅ Get token from URL or localStorage
const urlParams = new URLSearchParams(window.location.search);
const tokenFromURL = urlParams.get("token");

if (tokenFromURL) {
  localStorage.setItem("token", tokenFromURL);
  // Optionally remove token from URL (cleaner UI)
  window.history.replaceState({}, document.title, "/");
}

const token = tokenFromURL || localStorage.getItem("token");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={token ? <Home /> : <div>Please login first</div>}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
