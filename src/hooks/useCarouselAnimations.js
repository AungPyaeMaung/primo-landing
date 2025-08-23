"use client";
import { useCallback } from "react";
import gsap from "gsap";

import { ANIMATION_CONFIG } from "../../constants";

// Custom hook for animation logic
export const useCarouselAnimations = (
  refs,
  getBackgroundGradient,
  getButtonBackground
) => {
  const animateBackgroundElements = useCallback(
    (product) => {
      const {
        backgroundRef,
        btnBackgroundRef1,
        btnBackgroundRef2,
        sizeRef1,
        sizeRef2,
      } = refs;

      const nextGradient = getBackgroundGradient(product.bgColor);
      const nextBackgroundColor = getButtonBackground(product.bgColor);

      const elements = [
        { ref: backgroundRef, background: nextGradient },
        { ref: btnBackgroundRef1, background: nextBackgroundColor },
        { ref: btnBackgroundRef2, background: nextBackgroundColor },
        { ref: sizeRef1, background: nextBackgroundColor },
        { ref: sizeRef2, background: nextBackgroundColor },
      ];

      elements.forEach(({ ref, background }) => {
        if (ref.current) {
          gsap.to(ref.current, {
            duration: ANIMATION_CONFIG.durations.background,
            background,
            ease: ANIMATION_CONFIG.easing.background,
          });
        }
      });
    },
    [refs, getBackgroundGradient, getButtonBackground]
  );

  const createAnimationTimeline = useCallback(
    (originalElements, clonedElements, product, direction, onComplete) => {
      const isNext = direction === "next";
      const { offsets, durations, easing } = ANIMATION_CONFIG;

      const outgoingYPercent = isNext
        ? offsets.image.outgoing
        : -offsets.image.outgoing;
      const incomingYPercent = isNext
        ? offsets.image.incoming
        : -offsets.image.incoming;

      const tl = gsap.timeline({ onComplete });

      // Set initial positions for cloned elements
      Object.entries(clonedElements).forEach(([key, element]) => {
        if (!element) return;

        let yPercent;
        switch (key) {
          case "title":
            yPercent = offsets.title.incoming;
            break;
          case "image":
            yPercent = incomingYPercent;
            break;
          default:
            yPercent = offsets.content.incoming;
        }

        gsap.set(element, { yPercent, opacity: 1 });
      });

      // Animate outgoing elements
      Object.entries(originalElements).forEach(([key, element]) => {
        if (!element) return;

        let yPercent, duration, ease;
        switch (key) {
          case "title":
            yPercent = offsets.title.outgoing;
            duration = durations.title;
            ease = easing.imageOut;
            break;
          case "image":
            yPercent = outgoingYPercent;
            duration = durations.transition;
            ease = easing.imageOut;
            break;
          default:
            yPercent = offsets.content.outgoing;
            duration = durations.content;
            ease = easing.contentOut;
        }

        tl.to(
          element,
          { yPercent, opacity: key === "image" ? 1 : 0, duration, ease },
          0
        );
      });

      // Animate incoming elements
      Object.entries(clonedElements).forEach(([key, element]) => {
        if (!element) return;

        let duration, ease;
        switch (key) {
          case "title":
            duration = durations.title;
            ease = easing.contentIn;
            break;
          case "image":
            duration = 1; // Slightly longer for smooth image transition
            ease = easing.imageIn;
            break;
          default:
            duration = durations.content;
            ease = easing.contentIn;
        }

        tl.to(element, { yPercent: 0, opacity: 1, duration, ease }, 0);
      });

      // Animate button
      if (refs.btnRef.current) {
        tl.fromTo(
          refs.btnRef.current,
          { yPercent: offsets.content.incoming },
          {
            yPercent: 0,
            opacity: 1,
            duration: durations.button,
            ease: easing.contentIn,
          },
          0
        );
      }

      return tl;
    },
    [refs]
  );

  return { animateBackgroundElements, createAnimationTimeline };
};
