// Global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error?.message);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding:20px;background:#fee;border:2px solid red;color:red;font-family:monospace"><h2>Error</h2><pre>${event.error?.stack || event.message}</pre></div>`;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding:20px;background:#fee;border:2px solid red;color:red;font-family:monospace"><h2>Rejection</h2><pre>${event.reason?.stack || String(event.reason)}</pre></div>`;
  }
});

console.log('Starting React app...');

import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

console.log('React and App imported successfully');

const rootElement = document.getElementById("root");
console.log('Root element found:', !!rootElement);

if (!rootElement) {
  throw new Error("Root element not found!");
}

const root = ReactDOM.createRoot(rootElement);
console.log('React root created, rendering App...');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('App render called');
