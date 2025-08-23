// hooks/useInitialAnimations.js - Fixed version
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const useInitialAnimations = (
  currentImageRef,
  titleRef,
  imagesLoaded = false
) => {
  useGSAP(() => {
    // Only run animations after images are loaded
    if (!imagesLoaded) return;

    // Wait a bit longer to ensure DOM is fully ready
    gsap.delayedCall(0.3, () => {
      // Create a master timeline
      const tl = gsap.timeline();

      // Helper function to safely animate elements
      const safeAnimate = (selector, fromProps, toProps, position = null) => {
        const element =
          typeof selector === "string"
            ? document.querySelector(selector)
            : selector;
        if (!element) {
          console.warn(`Element not found: ${selector}`);
          return;
        }

        // Set initial state
        gsap.set(element, fromProps);

        // Add to timeline
        if (position !== null) {
          tl.to(element, toProps, position);
        } else {
          tl.to(element, toProps);
        }
      };

      // Logo animation - use more specific selector
      safeAnimate(
        'img[alt="hero-logo"]',
        { xPercent: 200, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.8, ease: "power1.out" }
      );

      // Main image animation - use ref directly
      if (currentImageRef.current) {
        gsap.set(currentImageRef.current, { opacity: 0, yPercent: -200 });
        tl.to(
          currentImageRef.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power1.out",
          },
          "-=0.4"
        );
      }

      // Title animation - use ref directly
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 0, yPercent: 30 });
        tl.to(
          titleRef.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power1.out",
          },
          "-=0.6"
        );
      }

      // Info section animations - use more specific selectors
      safeAnimate(
        '[id="basic-info"]',
        { yPercent: 70, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "power1.out" },
        "-=0.8"
      );

      safeAnimate(
        '[id="price"]',
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "power1.out" },
        "-=0.9"
      );

      safeAnimate(
        '[id="description"]',
        { yPercent: 30, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "power1.out" },
        "-=0.8"
      );

      safeAnimate(
        '[id="order-btn"]',
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "power1.out" },
        "-=0.8"
      );

      // Individual info elements
      safeAnimate(
        '[id="name"]',
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: "power1.out" },
        "-=0.9"
      );

      safeAnimate(
        '[id="new-price"]',
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: "power1.out" },
        "-=0.8"
      );

      safeAnimate(
        '[id="old-price"]',
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: "power1.out" },
        "-=0.7"
      );

      // Navigation controls
      safeAnimate(
        '[id="arrowleft"]',
        { yPercent: 20, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: "power1.out" },
        "-=0.9"
      );

      safeAnimate(
        '[id="arrowright"]',
        { yPercent: 20, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: "power1.out" },
        "-=0.7"
      );

      // Sample images
      safeAnimate(
        '[id="sample-1"]',
        { yPercent: 20, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.3, ease: "power1.out" },
        "-=0.8"
      );

      safeAnimate(
        '[id="sample-2"]',
        { yPercent: 20, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.3, ease: "power1.out" },
        "-=0.7"
      );

      // Counter
      safeAnimate(
        '[id="counter"]',
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: "power1.out" },
        "-=0.7"
      );

      // Cleanup function
      return () => {
        tl.kill();
      };
    });
  }, [imagesLoaded, currentImageRef, titleRef]); // Add refs as dependencies
};
