import { useRef, useState } from "react";
import gsap from "gsap";

import { bgColorMap, gradientMap, productList } from "../../constants";

export const useProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentImageRef = useRef(null);
  const titleRef = useRef(null);
  const productSampleRef = useRef(null);
  const backgroundRef = useRef(null);
  const btnBackgroundRef1 = useRef(null);
  const btnBackgroundRef2 = useRef(null);

  const totalProducts = productList.length;

  const getButtonBackground = (bgColorClass) => {
    return bgColorMap[bgColorClass];
  };

  const getBackgroundGradient = (
    bgColorClass,
    gradientType = "product-halo"
  ) => {
    const colors =
      gradientMap[bgColorClass] || gradientMap["caramel-background"];

    switch (gradientType) {
      case "product-focused":
        return `
        radial-gradient(circle 700px at center, ${colors.from}80, transparent 60%),
        radial-gradient(circle 1000px at center, ${colors.accent}40, transparent 70%),
        ${colors.to}
      `;
      case "product-glow":
        return `
        radial-gradient(circle 800px at 50% 45%, ${colors.from}90, transparent 20%),
        radial-gradient(circle 1000px at 50% 45%, ${colors.accent}30, transparent 40%),
        ${colors.to}
      `;
      case "spotlight":
        return `
        radial-gradient(circle 1000px at center, ${colors.from}95, transparent 80%),
        ${colors.to}
      `;
      case "ambient-light":
        return `
        radial-gradient(circle 220px at 48% 42%, ${colors.from}60, transparent 90%),
        radial-gradient(circle 120px at 52% 48%, ${colors.accent}40, transparent 100%),
        ${colors.to}
      `;
      case "product-halo":
        return `
        radial-gradient(circle 700px at center, ${colors.from}85, transparent 75%),
        radial-gradient(circle 800px at center, ${colors.from}25, transparent 85%),
        ${colors.to}
      `;
      case "radial":
        return `radial-gradient(circle at 30% 20%, ${colors.from}, ${colors.to})`;
      case "linear":
        return `linear-gradient(135deg, ${colors.from}, ${colors.to})`;
      default:
        return `
        radial-gradient(circle 200px at center, ${colors.from}80, transparent 60%),
        radial-gradient(circle 300px at center, ${colors.accent}40, transparent 70%),
        ${colors.to}
      `;
    }
  };

  const animateImageTransition = (newIndex, direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const currentImage = currentImageRef.current;
    const currentTitle = titleRef.current;
    const currentSample = productSampleRef.current;

    if (!currentImage || !currentTitle || !currentSample) return;

    const outgoingYPercent = direction === "next" ? 200 : -200;
    const incomingYPercent = direction === "next" ? -200 : 200;

    const titleOutgoingYPercent = -120;
    const titleIncomingYPercent = 40;

    const sampleOutgoingYPercent = -40;
    const sampleIncomingYPercent = 80;

    const newImage = currentImage.cloneNode();
    newImage.src = productList[newIndex].image;
    newImage.style.position = "absolute";
    newImage.style.top = "0";
    newImage.style.left = "0";
    newImage.style.width = "100%";
    newImage.style.height = "100%";

    currentImage.parentNode.appendChild(newImage);

    const newTitle = currentTitle.cloneNode(true);
    newTitle.textContent = productList[newIndex].name;
    newTitle.style.position = "absolute";
    newTitle.style.top = "0";
    newTitle.style.left = "0";
    newTitle.style.width = "100%";
    newTitle.style.height = "100%";

    currentTitle.parentNode.appendChild(newTitle);

    // Clone and setup new product sample
    const newSample = currentSample.cloneNode(true);
    // Update the image sources in the cloned sample
    const sampleImages = newSample.querySelectorAll("img");
    if (sampleImages[0])
      sampleImages[0].src = productList[newIndex].firstSampleImgPath;
    if (sampleImages[1])
      sampleImages[1].src = productList[newIndex].secondSampleImgPath;

    newSample.style.position = "absolute";
    newSample.style.top = "0";
    newSample.style.left = "0";
    newSample.style.width = "100%";
    newSample.style.height = "100%";

    currentSample.parentNode.appendChild(newSample);

    gsap.set(newImage, {
      yPercent: incomingYPercent,
      opacity: 1,
    });

    gsap.set(newTitle, {
      yPercent: titleIncomingYPercent,
      opacity: 1,
    });

    gsap.set(newSample, {
      yPercent: sampleIncomingYPercent,
      opacity: 1,
    });

    const bgEl = backgroundRef.current;
    const nextGradient = getBackgroundGradient(productList[newIndex].bgColor);

    gsap.to(bgEl, {
      duration: 1.2,
      background: nextGradient,
      ease: "power2.inOut",
    });

    const btnBgEl1 = btnBackgroundRef1.current;
    const btnBgEl2 = btnBackgroundRef2.current;
    const nextBackgroundColor = getButtonBackground(
      productList[newIndex].bgColor
    );

    gsap.to(btnBgEl1, {
      duration: 1.2,
      background: nextBackgroundColor,
      ease: "power2.inOut",
    });

    gsap.to(btnBgEl2, {
      duration: 1.2,
      background: nextBackgroundColor,
      ease: "power2.inOut",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        currentImage.src = productList[newIndex].image;
        currentTitle.textContent = productList[newIndex].name;

        // Update original sample images
        const originalSampleImages = currentSample.querySelectorAll("img");
        if (originalSampleImages[0])
          originalSampleImages[0].src =
            productList[newIndex].firstSampleImgPath;
        if (originalSampleImages[1])
          originalSampleImages[1].src =
            productList[newIndex].secondSampleImgPath;

        gsap.set(currentImage, { yPercent: 0, opacity: 1 });
        gsap.set(currentTitle, { yPercent: 0, opacity: 1 });
        gsap.set(currentSample, { yPercent: 0, opacity: 1 });

        newImage.remove();
        newTitle.remove();
        newSample.remove();

        setCurrentIndex(newIndex);
        setIsAnimating(false);
      },
    });

    // Animate outgoing elements
    tl.to(
      currentImage,
      {
        yPercent: outgoingYPercent,
        opacity: 1,
        duration: 0.8,
        ease: "power1.inOut",
      },
      0
    );

    tl.to(
      currentTitle,
      {
        yPercent: titleOutgoingYPercent,
        opacity: 1,
        duration: 0.1,
        ease: "power1.inOut",
      },
      0
    );

    tl.to(
      currentSample,
      {
        yPercent: sampleOutgoingYPercent,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0
    );

    // Animate incoming elements
    tl.to(
      newImage,
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "power1.out",
      },
      0
    );

    tl.to(
      newTitle,
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power1.out",
      },
      0
    );

    tl.to(
      newSample,
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power1.out",
      },
      0
    );
  };

  const goToSlide = (index, direction = "next") => {
    if (isAnimating) return;
    const newIndex = (index + totalProducts) % totalProducts;
    if (newIndex === currentIndex) return;
    animateImageTransition(newIndex, direction);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % totalProducts;
    goToSlide(nextIndex, "next");
  };

  const goToPrev = () => {
    const prevIndex = (currentIndex - 1 + totalProducts) % totalProducts;
    goToSlide(prevIndex, "prev");
  };

  const getProductAt = (indexOffset) => {
    return productList[
      (currentIndex + indexOffset + totalProducts) % totalProducts
    ];
  };

  return {
    currentIndex,
    isAnimating,
    currentImageRef,
    titleRef,
    productSampleRef,
    backgroundRef,
    btnBackgroundRef1,
    btnBackgroundRef2,
    getButtonBackground,
    getBackgroundGradient,
    goToNext,
    goToPrev,
    getProductAt,
    totalProducts,
  };
};
