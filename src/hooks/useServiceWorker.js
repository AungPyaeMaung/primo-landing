// hooks/useServiceWorker.js
import { useEffect, useCallback, useState } from "react";

export const useServiceWorker = () => {
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        setIsServiceWorkerReady(true);
      });
    }
  }, []);

  // Send message to service worker to preload images
  const preloadImages = useCallback(
    (imageUrls) => {
      if (registration && registration.active) {
        registration.active.postMessage({
          type: "PRELOAD_IMAGES",
          images: imageUrls,
        });
      }
    },
    [registration]
  );

  // Check if service worker is controlling the page
  const isControlled = useCallback(() => {
    return navigator.serviceWorker.controller !== null;
  }, []);

  // Force service worker update
  const updateServiceWorker = useCallback(async () => {
    if (registration) {
      try {
        await registration.update();
        // Reload page if new service worker is waiting
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
        }
      } catch (error) {
        console.error("Service worker update failed:", error);
      }
    }
  }, [registration]);

  return {
    isServiceWorkerReady,
    isControlled: isControlled(),
    preloadImages,
    updateServiceWorker,
    registration,
  };
};
