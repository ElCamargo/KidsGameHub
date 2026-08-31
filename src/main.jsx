/**
 * KidsGameHub — ponto de entrada
 * ElCamargo Soluções em TI LTDA
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { installStorage } from "./lib/storage.js";
import App from "./App.jsx";
import "./index.css";

installStorage();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
