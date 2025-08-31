import * as React from "react";
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
  
  // Clear body content safely
  document.body.innerHTML = '';
  
  // Create error display using safe DOM methods
  const container = document.createElement('div');
  container.style.cssText = 'padding: 20px; font-family: Arial, sans-serif;';
  
  const title = document.createElement('h1');
  title.textContent = 'Application Error';
  
  const description = document.createElement('p');
  description.textContent = 'Failed to start ASOPETS application:';
  
  const errorPre = document.createElement('pre');
  errorPre.style.cssText = 'background: #f5f5f5; padding: 10px; border-radius: 4px;';
  errorPre.textContent = String(error); // Safe text content, no HTML injection
  
  const support = document.createElement('p');
  support.textContent = 'Please refresh the page or contact support.';
  
  // Append elements safely
  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(errorPre);
  container.appendChild(support);
  document.body.appendChild(container);
}
