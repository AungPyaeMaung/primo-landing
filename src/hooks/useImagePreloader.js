import { useState, useEffect, useCallback } from "react";

export const useImagePreloader = (imageSources = []) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const preloadImage = useCallback((src) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        setLoadedImages((prev) => {
          const newSet = new Set(prev);
          newSet.add(src);
          return newSet;
        });
        resolve(src);
      };

      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        // Still resolve to not block the loading process
        resolve(src);
      };

      img.src = src;
    });
  }, []);

  const preloadAllImages = useCallback(
    async (sources) => {
      if (!sources || sources.length === 0) {
        setAllImagesLoaded(true);
        return;
      }

      try {
        const loadPromises = sources.map((src) => preloadImage(src));

        // Track loading progress
        let completed = 0;
        loadPromises.forEach((promise) => {
          promise.then(() => {
            completed++;
            setLoadingProgress((completed / sources.length) * 100);
          });
        });

        await Promise.all(loadPromises);
        setAllImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        setAllImagesLoaded(true); // Continue anyway
      }
    },
    [preloadImage]
  );

  useEffect(() => {
    if (imageSources.length > 0) preloadAllImages(imageSources);
  }, [imageSources, preloadAllImages]);

  return {
    loadedImages,
    allImagesLoaded,
    loadingProgress,
    preloadAllImages,
  };
};
