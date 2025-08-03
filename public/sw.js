// public/sw.js - Complete Service Worker
const CACHE_NAME = "primo-app-v1.0.0";
const STATIC_CACHE = "primo-static-v1.0.0";
const IMAGE_CACHE = "primo-images-v1.0.0";

const STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/images/logo.svg",
  "/images/profile.svg",
  "/images/remove.svg",
  "/images/arrowleft.svg",
  "/images/minus.svg",
  "/images/plus.svg",
];

const IMAGE_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png", ".gif", ".svg"];

// Install event – cache static resources
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");

  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("[SW] Caching static resources");
        return cache.addAll(STATIC_RESOURCES);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting(),
    ])
  );
});

// Activate event – clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== IMAGE_CACHE
            ) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients immediately
      self.clients.claim(),
    ])
  );

  console.log("[SW] Activated and claimed clients");
});

// Utility functions
const isImageRequest = (request) => {
  const url = new URL(request.url);
  return IMAGE_EXTENSIONS.some((ext) =>
    url.pathname.toLowerCase().endsWith(ext)
  );
};

const isStaticResource = (request) => {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith("/images/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    STATIC_RESOURCES.includes(url.pathname)
  );
};

// Fetch event – implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Strategy 1: Cache First for images (aggressive caching)
  if (isImageRequest(request)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log("[SW] Image served from cache:", url.pathname);
            return cachedResponse;
          }

          console.log("[SW] Fetching and caching image:", url.pathname);
          return fetch(request)
            .then((response) => {
              // Only cache successful responses
              if (response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Return fallback image if available
              console.log("[SW] Failed to fetch image, trying fallback");
              return cache.match("/images/logo.svg");
            });
        });
      })
    );
    return;
  }

  // Strategy 2: Cache First for static resources
  if (isStaticResource(request)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log(
              "[SW] Static resource served from cache:",
              url.pathname
            );
            return cachedResponse;
          }

          console.log(
            "[SW] Fetching and caching static resource:",
            url.pathname
          );
          return fetch(request).then((response) => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Strategy 3: Network First for HTML and API calls
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful HTML responses
        if (response.status === 200 && request.destination === "document") {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache for HTML
        if (request.destination === "document") {
          console.log("[SW] Network failed, serving cached HTML");
          return caches.match("/index.html");
        }
        return caches.match(request);
      })
  );
});

// Background message handling for preloading
self.addEventListener("message", (event) => {
  const { data } = event;

  if (data && data.type === "PRELOAD_IMAGES") {
    const images = data.images;
    console.log("[SW] Received preload request for", images.length, "images");

    if (Array.isArray(images)) {
      caches.open(IMAGE_CACHE).then((cache) => {
        const preloadPromises = images.map((src) => {
          return fetch(src)
            .then((response) => {
              if (response.status === 200) {
                console.log("[SW] Preloaded:", src);
                return cache.put(src, response.clone());
              }
            })
            .catch((err) => {
              console.warn("[SW] Failed to preload image:", src, err);
            });
        });

        Promise.all(preloadPromises).then(() => {
          console.log("[SW] Preloading batch completed");
          // Notify clients that cache was updated
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: "CACHE_UPDATED",
                count: images.length,
              });
            });
          });
        });
      });
    }
  }

  // Handle skip waiting message
  if (data && data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Periodic cache cleanup (runs when SW becomes idle)
self.addEventListener("backgroundsync", (event) => {
  if (event.tag === "cache-cleanup") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName.startsWith("primo-") &&
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== IMAGE_CACHE
            ) {
              console.log("[SW] Cleaning up old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});

// Log service worker lifecycle
console.log("[SW] Service Worker script loaded");
