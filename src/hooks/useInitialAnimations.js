// hooks/useInitialAnimations.js - Improved version
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

    // Create a master timeline
    const tl = gsap.timeline();

    // Set initial states to prevent flashing
    gsap.set("#main-logo", { xPercent: 200, opacity: 0 });
    gsap.set(currentImageRef.current, { opacity: 0, yPercent: -200 });
    gsap.set(titleRef.current, { opacity: 0, yPercent: 30 });
    gsap.set("#basic-info", { yPercent: 70, opacity: 0 });
    gsap.set("#price", { yPercent: 50, opacity: 0 });
    gsap.set("#description", { yPercent: 30, opacity: 0 });
    gsap.set("#order-btn", { yPercent: 50, opacity: 0 });
    gsap.set("#name", { yPercent: 50, opacity: 0 });
    gsap.set("#new-price", { yPercent: 50, opacity: 0 });
    gsap.set("#old-price", { yPercent: 50, opacity: 0 });
    gsap.set("#arrowleft", { yPercent: 20, opacity: 0 });
    gsap.set("#arrowright", { yPercent: 20, opacity: 0 });
    gsap.set("#sample-1", { yPercent: 20, opacity: 0 });
    gsap.set("#sample-2", { yPercent: 20, opacity: 0 });
    gsap.set("#counter", { yPercent: 50, opacity: 0 });

    // Wait for next frame to ensure DOM is ready
    gsap.delayedCall(0.1, () => {
      // Logo animation
      tl.to("#main-logo", {
        xPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power1.out",
      });

      // Main image animation
      if (currentImageRef.current) {
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

      // Title animation
      if (titleRef.current) {
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

      // Info section animations
      tl.to(
        "#basic-info",
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: "power1.out",
        },
        "-=0.8"
      )

        .to(
          "#price",
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power1.out",
          },
          "-=0.9"
        )

        .to(
          "#description",
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power1.out",
          },
          "-=0.8"
        )

        .to(
          "#order-btn",
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power1.out",
          },
          "-=0.8"
        )

        // Stagger info elements
        .to(
          "#name",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power1.out",
          },
          "-=0.9"
        )

        .to(
          "#new-price",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power1.out",
          },
          "-=0.8"
        )

        .to(
          "#old-price",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power1.out",
          },
          "-=0.7"
        )

        // Navigation controls
        .to(
          "#arrowleft",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power1.out",
          },
          "-=0.9"
        )

        .to(
          "#arrowright",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power1.out",
          },
          "-=0.7"
        )

        // Sample images
        .to(
          "#sample-1",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power1.out",
          },
          "-=0.8"
        )

        .to(
          "#sample-2",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power1.out",
          },
          "-=0.7"
        )

        // Counter
        .to(
          "#counter",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power1.out",
          },
          "-=0.7"
        );
    });

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, [imagesLoaded]); // Add imagesLoaded as dependency
};
