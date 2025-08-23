"use client";
import { useState, useCallback, useMemo } from "react";
import gsap from "gsap";

import { useCarouselRefs } from "./useCarouselRefs";
import { useBackgroundUtils } from "./useBackgroundUtils";
import { useCarouselAnimations } from "./useCarouselAnimations";
import { productList } from "../../constants";

// Utility function for debouncing rapid clicks
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Utility functions for DOM manipulation
const createClonedElement = (originalElement) => {
  if (!originalElement) return null;

  const clonedElement = originalElement.cloneNode(true);
  clonedElement.style.position = "absolute";
  clonedElement.style.top = "0";
  clonedElement.style.left = "0";
  clonedElement.style.width = "100%";
  clonedElement.style.height = "100%";

  return clonedElement;
};

const updateElementContent = (element, product, type) => {
  if (!element || !product) return;

  const infoSpans = element.querySelectorAll("span");
  const sampleImages = element.querySelectorAll("img");

  switch (type) {
    case "image":
      element.src = product.image;
      break;
    case "title":
      element.textContent = product.name;
      break;
    case "description":
      element.textContent = product.description;
      break;
    case "price":
      element.textContent = product.newPrice;
      break;
    case "info":
      if (infoSpans[0]) infoSpans[0].textContent = product.flavour;
      if (infoSpans[1]) infoSpans[1].textContent = product.newPrice;
      if (infoSpans[2]) infoSpans[2].textContent = product.oldPrice;
      break;
    case "sample":
      if (sampleImages[0]) sampleImages[0].src = product.firstSampleImgPath;
      if (sampleImages[1]) sampleImages[1].src = product.secondSampleImgPath;
      break;
    default:
      break;
  }
};

// Main carousel hook
export const useProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const refs = useCarouselRefs();
  const { getButtonBackground, getBackgroundGradient } = useBackgroundUtils();
  const { animateBackgroundElements, createAnimationTimeline } =
    useCarouselAnimations(refs, getBackgroundGradient, getButtonBackground);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const animateImageTransition = useCallback(
    (newIndex, direction) => {
      if (isAnimating || newIndex === currentIndex) return;

      // Skip animation if user prefers reduced motion
      if (prefersReducedMotion) {
        setCurrentIndex(newIndex);
        return;
      }

      setIsAnimating(true);

      const product = productList[newIndex];
      const {
        currentImageRef,
        titleRef,
        productSampleRef,
        infoRef,
        descriptionRef,
        priceRef,
      } = refs;

      // Validate all required refs
      const requiredRefs = [
        currentImageRef,
        titleRef,
        productSampleRef,
        infoRef,
        descriptionRef,
        priceRef,
      ];

      if (requiredRefs.some((ref) => !ref.current)) {
        console.warn("Some required refs are not attached");
        setIsAnimating(false);
        return;
      }

      const originalElements = {
        image: currentImageRef.current,
        title: titleRef.current,
        sample: productSampleRef.current,
        info: infoRef.current,
        description: descriptionRef.current,
        price: priceRef.current,
      };

      // Create cloned elements
      const clonedElements = {};
      Object.entries(originalElements).forEach(([key, element]) => {
        const cloned = createClonedElement(element);
        if (cloned) {
          updateElementContent(cloned, product, key);
          element.parentNode.appendChild(cloned);
          clonedElements[key] = cloned;
        }
      });

      // Animate background elements
      animateBackgroundElements(product);

      // Create and execute animation timeline
      const cleanup = () => {
        // Update original elements
        Object.entries(originalElements).forEach(([key, element]) => {
          updateElementContent(element, product, key);
          gsap.set(element, { yPercent: 0, opacity: 1 });
        });

        // Remove cloned elements
        Object.values(clonedElements).forEach((element) => {
          if (element && element.parentNode) {
            element.remove();
          }
        });

        setCurrentIndex(newIndex);
        setIsAnimating(false);
      };

      createAnimationTimeline(
        originalElements,
        clonedElements,
        product,
        direction,
        cleanup
      );
    },
    [
      isAnimating,
      currentIndex,
      refs,
      animateBackgroundElements,
      createAnimationTimeline,
      prefersReducedMotion,
    ]
  );

  // Create the core slide function first
  const slideToIndex = useCallback(
    (index, direction = "next") => {
      if (isAnimating) return;
      // Validation
      if (!productList || productList.length === 0) {
        console.warn("Product list is empty or undefined");
        return null;
      }

      const totalProducts = productList.length;
      const newIndex = (index + totalProducts) % totalProducts;
      if (newIndex === currentIndex) return;
      animateImageTransition(newIndex, direction);
    },
    [isAnimating, currentIndex, animateImageTransition]
  );

  // Create debounced version
  const goToSlide = useMemo(() => debounce(slideToIndex, 100), [slideToIndex]);

  const goToNext = useCallback(() => {
    // Validation
    if (!productList || productList.length === 0) {
      console.warn("Product list is empty or undefined");
      return null;
    }

    const totalProducts = productList.length;
    const nextIndex = (currentIndex + 1) % totalProducts;
    goToSlide(nextIndex, "next");
  }, [currentIndex, goToSlide]);

  const goToPrev = useCallback(() => {
    // Validation
    if (!productList || productList.length === 0) {
      console.warn("Product list is empty or undefined");
      return null;
    }

    const totalProducts = productList.length;
    const prevIndex = (currentIndex - 1 + totalProducts) % totalProducts;
    goToSlide(prevIndex, "prev");
  }, [currentIndex, goToSlide]);

  const getProductAt = useCallback(
    (indexOffset) => {
      // Validation
      if (!productList || productList.length === 0) {
        console.warn("Product list is empty or undefined");
        return null;
      }

      const totalProducts = productList.length;
      return productList[
        (currentIndex + indexOffset + totalProducts) % totalProducts
      ];
    },
    [currentIndex]
  );

  // Keyboard navigation support
  const handleKeyDown = useCallback(
    (event) => {
      if (isAnimating) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goToPrev();
          break;
        case "ArrowRight":
          event.preventDefault();
          goToNext();
          break;
        default:
          break;
      }
    },
    [isAnimating, goToPrev, goToNext]
  );

  return {
    // State
    currentIndex,
    isAnimating,

    // Refs
    ...refs,

    // Utilities
    getButtonBackground,
    getBackgroundGradient,

    // Navigation
    goToNext,
    goToPrev,
    goToSlide,
    getProductAt,

    // Accessibility
    handleKeyDown,
    prefersReducedMotion,
  };
};
