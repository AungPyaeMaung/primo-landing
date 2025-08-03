// hooks/useImagePreloader.js - Cached version
import { useState, useEffect, useCallback, useRef } from "react";

// Global cache to persist across component unmounts
const imageCache = new Map();
const loadingPromises = new Map();

// Check if image is cached by browser
const isImageCached = (src) => {
  // Check our memory cache first
  if (imageCache.has(src)) {
    return true;
  }

  // Quick cache check using a temporary image
  const img = new Image();
  img.src = src;
  return img.complete && img.naturalWidth > 0;
};

// Get cache key for localStorage
const getCacheKey = (src) => `img_cache_${btoa(src).slice(0, 20)}`;

// Check if image is in localStorage cache (timestamp-based)
const isCachedInStorage = (src, maxAge = 24 * 60 * 60 * 1000) => {
  // 24 hours default
  try {
    const cacheKey = getCacheKey(src);
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return false;

    const { timestamp } = JSON.parse(cached);
    return Date.now() - timestamp < maxAge;
  } catch {
    return false;
  }
};

// Mark image as cached in localStorage
const setCachedInStorage = (src) => {
  try {
    const cacheKey = getCacheKey(src);
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        src,
        timestamp: Date.now(),
      })
    );
  } catch {
    // Ignore localStorage errors
  }
};

export const useImagePreloader = (imageSources = [], options = {}) => {
  const {
    maxAge = 24 * 60 * 60 * 1000, // 24 hours
    skipCacheCheck = false,
    criticalImages = [], // Images that must be loaded before showing content
  } = options;

  const [loadedImages, setLoadedImages] = useState(new Set());
  const [cachedImages, setCachedImages] = useState(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [criticalImagesLoaded, setCriticalImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const mountedRef = useRef(true);

  // Check which images are already cached
  const checkCachedImages = useCallback(
    (sources) => {
      const cached = new Set();
      const needsLoading = [];

      sources.forEach((src) => {
        if (
          imageCache.has(src) ||
          isImageCached(src) ||
          isCachedInStorage(src, maxAge)
        ) {
          cached.add(src);
          imageCache.set(src, true); // Update memory cache
        } else {
          needsLoading.push(src);
        }
      });

      setCachedImages(cached);
      setLoadedImages((prev) => new Set([...prev, ...cached]));

      return needsLoading;
    },
    [maxAge]
  );

  const preloadImage = useCallback((src) => {
    // Return existing promise if already loading
    if (loadingPromises.has(src)) {
      return loadingPromises.get(src);
    }

    const promise = new Promise((resolve) => {
      // Check if already cached
      if (imageCache.has(src) || isImageCached(src)) {
        resolve(src);
        return;
      }

      const img = new Image();

      const cleanup = () => {
        loadingPromises.delete(src);
      };

      img.onload = () => {
        if (!mountedRef.current) return;

        imageCache.set(src, true);
        setCachedInStorage(src);

        setLoadedImages((prev) => {
          const newSet = new Set(prev);
          newSet.add(src);
          return newSet;
        });

        cleanup();
        resolve(src);
      };

      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        cleanup();
        resolve(src); // Still resolve to not block loading
      };

      // Set loading attributes for better caching
      img.crossOrigin = "anonymous";
      img.loading = "eager";
      img.src = src;
    });

    loadingPromises.set(src, promise);
    return promise;
  }, []);

  const preloadAllImages = useCallback(
    async (sources) => {
      if (!sources || sources.length === 0) {
        setAllImagesLoaded(true);
        setCriticalImagesLoaded(true);
        return;
      }

      // Check which images need loading
      const needsLoading = skipCacheCheck
        ? sources
        : checkCachedImages(sources);

      // If all images are cached, we're done
      if (needsLoading.length === 0) {
        setLoadingProgress(100);
        setAllImagesLoaded(true);
        setCriticalImagesLoaded(true);
        return;
      }

      try {
        const loadPromises = needsLoading.map((src) => preloadImage(src));

        // Track progress
        let completed = cachedImages.size;
        const total = sources.length;

        // Update initial progress based on cached images
        setLoadingProgress((completed / total) * 100);

        // Track individual completions
        loadPromises.forEach((promise) => {
          promise.then(() => {
            completed++;
            if (mountedRef.current) {
              setLoadingProgress((completed / total) * 100);

              // Check if critical images are loaded
              if (criticalImages.length > 0) {
                const criticalLoaded = criticalImages.every(
                  (src) =>
                    loadedImages.has(src) ||
                    cachedImages.has(src) ||
                    imageCache.has(src)
                );
                if (criticalLoaded && !criticalImagesLoaded) {
                  setCriticalImagesLoaded(true);
                }
              }
            }
          });
        });

        await Promise.all(loadPromises);

        if (mountedRef.current) {
          setAllImagesLoaded(true);
          if (!criticalImagesLoaded) {
            setCriticalImagesLoaded(true);
          }
        }
      } catch (error) {
        console.error("Error preloading images:", error);
        if (mountedRef.current) {
          setAllImagesLoaded(true);
          setCriticalImagesLoaded(true);
        }
      }
    },
    [
      skipCacheCheck,
      checkCachedImages,
      preloadImage,
      loadedImages,
      criticalImages,
      criticalImagesLoaded,
      cachedImages,
    ]
  );

  useEffect(() => {
    mountedRef.current = true;

    if (imageSources.length > 0) {
      preloadAllImages(imageSources);
    } else {
      setAllImagesLoaded(true);
      setCriticalImagesLoaded(true);
    }

    return () => {
      mountedRef.current = false;
    };
  }, [imageSources, preloadAllImages]);

  // Cleanup function to clear old cache entries
  const clearOldCache = useCallback(() => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("img_cache_")) {
          try {
            const cached = JSON.parse(localStorage.getItem(key));
            if (Date.now() - cached.timestamp > maxAge) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      });
    } catch {
      // Ignore localStorage errors
    }
  }, [maxAge]);

  // Clear old cache on mount
  useEffect(() => {
    clearOldCache();
  }, [clearOldCache]);

  return {
    loadedImages,
    cachedImages,
    allImagesLoaded,
    criticalImagesLoaded,
    loadingProgress,
    preloadAllImages,
    isImageCached: (src) => loadedImages.has(src) || cachedImages.has(src),
    cacheStats: {
      total: imageSources.length,
      cached: cachedImages.size,
      loaded: loadedImages.size,
      remaining: Math.max(0, imageSources.length - loadedImages.size),
    },
  };
};
