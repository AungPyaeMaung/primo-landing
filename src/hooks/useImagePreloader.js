// hooks/useImagePreloader.js - Instant load version
import { useState, useEffect, useCallback, useRef } from "react";

// Global persistent cache that survives page refreshes
const CACHE_PREFIX = "primo_img_cache_";
const CACHE_VERSION = "1.0.0";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Memory cache for current session
let memoryCache = new Map();
let loadingPromises = new Map();

// Check if image exists in browser cache (instant check)
const isImageInBrowserCache = (src) => {
  const img = new Image();
  img.src = src;
  // If complete and has dimensions, it's cached
  return img.complete && img.naturalWidth > 0;
};

// Aggressive cache check - multiple methods
const isImageCached = async (src) => {
  // 1. Memory cache (fastest)
  if (memoryCache.has(src)) {
    return true;
  }

  // 2. Browser cache check (very fast)
  if (isImageInBrowserCache(src)) {
    memoryCache.set(src, true);
    return true;
  }

  // 3. IndexedDB check for persistence
  try {
    const cachedData = await getCachedImageData(src);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      memoryCache.set(src, true);
      return true;
    }
  } catch (error) {
    // Continue to localStorage check
    console.warn(error);
  }

  // 4. LocalStorage fallback
  try {
    const cacheKey = CACHE_PREFIX + btoa(src).slice(0, 20);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      if (
        data.version === CACHE_VERSION &&
        Date.now() - data.timestamp < CACHE_DURATION
      ) {
        memoryCache.set(src, true);
        return true;
      }
    }
  } catch (error) {
    console.warn(error);
    // Ignore localStorage errors
  }

  return false;
};

// IndexedDB operations for better caching
const openCacheDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("PrimoImageCache", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "src" });
      }
    };
  });
};

const getCachedImageData = async (src) => {
  try {
    const db = await openCacheDB();
    const transaction = db.transaction(["images"], "readonly");
    const store = transaction.objectStore("images");

    return new Promise((resolve, reject) => {
      const request = store.get(src);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
};

const setCachedImageData = async (src) => {
  try {
    const db = await openCacheDB();
    const transaction = db.transaction(["images"], "readwrite");
    const store = transaction.objectStore("images");

    store.put({
      src,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    });
  } catch (error) {
    console.warn(error);
    // Fallback to localStorage
    try {
      const cacheKey = CACHE_PREFIX + btoa(src).slice(0, 20);
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          src,
          timestamp: Date.now(),
          version: CACHE_VERSION,
        })
      );
    } catch {
      return null;
      // Ignore storage errors
    }
  }
};

export const useImagePreloader = (imageSources = []) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [shouldShowLoading, setShouldShowLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const mountedRef = useRef(true);
  const initialCheckDone = useRef(false);

  // Instant cache check on mount
  const performInstantCacheCheck = useCallback(async () => {
    if (!imageSources.length || initialCheckDone.current) return;

    initialCheckDone.current = true;
    const cachedImages = new Set();
    let checkedCount = 0;

    // Check all images simultaneously for speed
    const checkPromises = imageSources.map(async (src) => {
      const isCached = await isImageCached(src);
      checkedCount++;

      if (mountedRef.current) {
        setLoadingProgress((checkedCount / imageSources.length) * 100);
      }

      if (isCached) {
        cachedImages.add(src);
        return src;
      }
      return null;
    });

    const results = await Promise.all(checkPromises);
    const cached = results.filter(Boolean);

    if (!mountedRef.current) return;

    setLoadedImages(cachedImages);

    // If most images are cached, skip loading screen
    const cacheRatio = cached.length / imageSources.length;
    if (cacheRatio > 0.7) {
      // 70% cached = instant load
      setShouldShowLoading(false);
      setAllImagesLoaded(true);
      setLoadingProgress(100);
      return;
    }

    // If first product images are cached, show content immediately
    const firstProductImages = imageSources.slice(0, 3);
    const firstProductCached = firstProductImages.every((src) =>
      cachedImages.has(src)
    );
    if (firstProductCached) {
      setShouldShowLoading(false);
      // Continue loading others in background
      loadRemainingImages(imageSources.filter((src) => !cachedImages.has(src)));
    } else {
      // Need to load critical images
      loadRemainingImages(imageSources.filter((src) => !cachedImages.has(src)));
    }
  }, [imageSources]);

  const loadRemainingImages = useCallback(
    async (imagesToLoad) => {
      if (!imagesToLoad.length) {
        setAllImagesLoaded(true);
        return;
      }

      const loadPromises = imagesToLoad.map((src) => loadSingleImage(src));
      let completedCount = loadedImages.size;

      // Track progress
      loadPromises.forEach((promise) => {
        promise.then(() => {
          completedCount++;
          if (mountedRef.current) {
            setLoadingProgress((completedCount / imageSources.length) * 100);
          }
        });
      });

      try {
        await Promise.all(loadPromises);
        if (mountedRef.current) {
          setAllImagesLoaded(true);
          setShouldShowLoading(false);
        }
      } catch (error) {
        console.warn("Some images failed to load:", error);
        if (mountedRef.current) {
          setAllImagesLoaded(true);
          setShouldShowLoading(false);
        }
      }
    },
    [loadedImages.size, imageSources.length]
  );

  const loadSingleImage = useCallback((src) => {
    // Return existing promise if already loading
    if (loadingPromises.has(src)) {
      return loadingPromises.get(src);
    }

    const promise = new Promise((resolve) => {
      const img = new Image();

      const onLoad = () => {
        memoryCache.set(src, true);
        setCachedImageData(src); // Cache for future visits

        if (mountedRef.current) {
          setLoadedImages((prev) => new Set([...prev, src]));
        }

        cleanup();
        resolve(src);
      };

      const onError = () => {
        console.warn(`Failed to load: ${src}`);
        cleanup();
        resolve(src); // Still resolve to not block
      };

      const cleanup = () => {
        loadingPromises.delete(src);
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      };

      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);

      // Force immediate loading with aggressive caching headers
      img.crossOrigin = "anonymous";
      img.loading = "eager";
      img.decoding = "sync";
      img.src = src;
    });

    loadingPromises.set(src, promise);
    return promise;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    performInstantCacheCheck();

    return () => {
      mountedRef.current = false;
    };
  }, [performInstantCacheCheck]);

  // Clean old cache entries periodically
  useEffect(() => {
    const cleanOldCache = () => {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith(CACHE_PREFIX)) {
            try {
              const data = JSON.parse(localStorage.getItem(key));
              if (
                !data.version ||
                data.version !== CACHE_VERSION ||
                Date.now() - data.timestamp > CACHE_DURATION
              ) {
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
    };

    // Clean cache on first load
    cleanOldCache();
  }, []);

  return {
    loadedImages,
    allImagesLoaded,
    shouldShowLoading,
    loadingProgress,
    isImageCached: (src) => memoryCache.has(src) || loadedImages.has(src),
  };
};
