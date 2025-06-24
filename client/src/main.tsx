import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Ensure React is globally available for all dependencies
(window as any).React = React;

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

try {
  console.log('Starting ASOPETS application...');
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error('Failed to find the root element');
  
  const root = createRoot(rootElement);
  console.log('Rendering App component...');
  root.render(<App />);
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to start application:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>Failed to start ASOPETS application:</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${error}</pre>
      <p>Please refresh the page or contact support.</p>
    </div>
  `;
}
