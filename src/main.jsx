// src/main.jsx - Enhanced with Service Worker
import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Service Worker Registration with Enhanced Error Handling
const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      // Wait for page to load completely
      await new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve();
        } else {
          window.addEventListener("load", resolve);
        }
      });

      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/", // Ensure SW controls entire app
        updateViaCache: "none", // Always check for updates
      });

      console.log(
        "✅ Service Worker registered successfully:",
        registration.scope
      );

      // Handle service worker updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log("🔄 New service worker available. Refresh to update.");

            // Optionally show update notification to user
            if (window.confirm("New version available! Refresh to update?")) {
              window.location.reload();
            }
          }
        });
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "CACHE_UPDATED") {
          console.log("📦 Cache updated:", event.data);
        }
      });

      // Check if page is controlled by service worker
      if (navigator.serviceWorker.controller) {
        console.log("🎯 Page is controlled by service worker");
      } else {
        console.log("⚠️ Page is not controlled by service worker yet");
      }
    } catch (error) {
      console.error("❌ Service Worker registration failed:", error);
    }
  } else {
    console.log("🚫 Service Worker not supported");
  }
};

// Register service worker
registerServiceWorker();

// Render React app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
