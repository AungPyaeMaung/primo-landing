import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const useInitialAnimations = (currentImageRef) => {
  useGSAP(() => {
    gsap.from("#main-logo", {
      xPercent: 200,
      duration: 0.8,
      ease: "power1.out",
    });

    if (currentImageRef.current) {
      gsap.fromTo(
        currentImageRef.current,
        { opacity: 0, yPercent: -200 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: "power1.out",
        }
      );
    }

    gsap.from("#title", {
      yPercent: 30,
      opacity: 0,
      duration: "1",
      ease: "power1.out",
    });

    gsap.from(
      "#basic-info",
      {
        yPercent: 70,
        opacity: 0,
        duration: "1",
        ease: "power1.out",
      },
      "-=0.8"
    );

    gsap.from("#price", {
      yPercent: 50,
      opacity: 0,
      duration: "1",
      ease: "power1.out",
    });

    gsap.from(
      "#description",
      {
        yPercent: 30,
        opacity: 0,
        duration: "1",
        ease: "power1.out",
      },
      "-=0.8"
    );

    gsap.from(
      "#order-btn",
      {
        yPercent: 50,
        opacity: 0,
        duration: "1",
        ease: "power1.out",
      },
      "<"
    );

    gsap.from(
      "#name",
      {
        yPercent: 50,
        opacity: 0,
        duration: "0.5",
        ease: "power1.out",
      },
      "-=0.9"
    );

    gsap.from(
      "#new-price",
      {
        yPercent: 50,
        opacity: 0,
        duration: "0.5",
        ease: "power1.out",
      },
      "-=0.8"
    );

    gsap.from(
      "#old-price",
      {
        yPercent: 50,
        opacity: 0,
        duration: "0.5",
        ease: "power1.out",
      },
      "-=0.7"
    );

    gsap.from(
      "#arrowleft",
      {
        yPercent: 20,
        opacity: 0,
        duration: "0.5",
        ease: "power1.out",
      },
      "-=0.9"
    );

    gsap.from(
      "#arrowright",
      {
        yPercent: 20,
        opacity: 0,
        duration: "0.5",
        ease: "power1.out",
      },
      "-=0.7"
    );

    gsap.from(
      "#sample-1",
      {
        yPercent: 20,
        opacity: 0,
        duration: "0.3",
        ease: "power1.out",
      },
      "-=0.8"
    );

    gsap.from(
      "#sample-2",
      {
        yPercent: 20,
        opacity: 0,
        duration: "0.3",
        ease: "power1.out",
      },
      "-=0.7"
    );

    gsap.from(
      "#counter",
      {
        yPercent: 50,
        opacity: 0,
        duration: "0.5",
        ease: "power1.out",
      },
      "-=0.7"
    );
  }, []);
};
