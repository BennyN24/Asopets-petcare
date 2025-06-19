import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // Service worker registered successfully
      })
      .catch((registrationError) => {
        // Service worker registration failed
      });
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
