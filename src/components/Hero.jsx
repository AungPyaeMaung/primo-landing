"use client";

import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { bgColorMap, gradientMap, productList } from "../../constants";

const HeroPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentImageRef = useRef(null);
  const backgroundRef = useRef(null);
  const btnBackgroundRef1 = useRef(null);
  const btnBackgroundRef2 = useRef(null);

  useGSAP(() => {
    gsap.from("#main-logo", {
      xPercent: 200,
      duration: 0.8,
      ease: "power1.out",
    });

    // Initial image animation (from left)
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

  const totalProducts = productList.length;

  const getButtonBackground = (bgColorClass) => {
    return bgColorMap[bgColorClass];
  };

  // Enhanced gradient function with focused lighting around product
  const getBackgroundGradient = (
    bgColorClass,
    gradientType = "product-halo"
  ) => {
    const colors =
      gradientMap[bgColorClass] || gradientMap["caramel-background"];

    switch (gradientType) {
      case "product-focused":
        // Tight spotlight around center product area
        return `
        radial-gradient(circle 700px at center, ${colors.from}80, transparent 60%),
        radial-gradient(circle 1000px at center, ${colors.accent}40, transparent 70%),
        ${colors.to}
      `;

      case "product-glow":
        // Soft glow with very limited spread
        return `
        radial-gradient(circle 800px at 50% 45%, ${colors.from}90, transparent 20%),
        radial-gradient(circle 1000px at 50% 45%, ${colors.accent}30, transparent 40%),
        ${colors.to}
      `;

      case "spotlight":
        // Dramatic spotlight effect
        return `
        radial-gradient(circle 1000px at center, ${colors.from}95, transparent 80%),
        ${colors.to}
      `;

      case "ambient-light":
        // Very subtle ambient lighting
        return `
        radial-gradient(circle 220px at 48% 42%, ${colors.from}60, transparent 90%),
        radial-gradient(circle 120px at 52% 48%, ${colors.accent}40, transparent 100%),
        ${colors.to}
      `;

      case "product-halo":
        // Halo effect around product with minimal spread
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
    if (!currentImage) return;

    // Determine animation direction
    const outgoingYPercent = direction === "next" ? 200 : -200;
    const incomingYPercent = direction === "next" ? -200 : 200;

    // Create a new image element for the incoming image
    const newImage = currentImage.cloneNode();
    newImage.src = productList[newIndex].image;
    newImage.style.position = "absolute";
    newImage.style.top = "0";
    newImage.style.left = "0";
    newImage.style.width = "100%";
    newImage.style.height = "100%";

    // Insert the new image
    currentImage.parentNode.appendChild(newImage);

    // Set initial position for incoming image
    gsap.set(newImage, {
      yPercent: incomingYPercent,
      opacity: 1,
    });

    // Enhanced background transition with smooth gradient blending
    const bgEl = backgroundRef.current;
    const nextGradient = getBackgroundGradient(productList[newIndex].bgColor);

    // Create a smooth transition between gradients
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

    // Create timeline for simultaneous animations
    const tl = gsap.timeline({
      onComplete: () => {
        // Update the original image source and position
        currentImage.src = productList[newIndex].image;
        gsap.set(currentImage, { yPercent: 0, opacity: 1 });

        // Remove the temporary image
        newImage.remove();

        // Update state
        setCurrentIndex(newIndex);
        setIsAnimating(false);
      },
    });

    // Animate outgoing image
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

    // Animate incoming image
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

  const currentProduct = getProductAt(0);

  return (
    <>
      <Helmet>
        <title>PRIMO - Refreshing Soft Drinks & Cold Beverages</title>
        <meta
          name="description"
          content="Sip into something refreshing with PRIMO’s signature drinks. Explore bold flavours, icy cold beverages, and exciting promotions in our showcase app."
        />
        <link
          rel="preload"
          as="image"
          href="/images/caramel.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/images/logo.svg"
          type="image/svg"
        />
      </Helmet>
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-start relative overflow-hidden">
        <div className="flex-between w-full z-10 px-10 md:px-20 pt-5">
          <div className="w-[15vw] md:w-[5vw] aspect-[3/2]">
            {" "}
            {/* Adjust ratio to match your logo */}
            <img
              src="/images/logo.svg"
              alt="logo"
              width="200"
              height="50"
              className="w-full h-full"
            />
          </div>
          <div className="flex-center gap-2">
            <div className="flex-center bg-white text-black text-sm w-24 h-10 rounded-3xl cursor-pointer">
              Products
            </div>
            <div
              ref={btnBackgroundRef1}
              className="flex-center text-white text-sm w-24 h-10 rounded-3xl cursor-pointer"
              style={{
                background: getButtonBackground(currentProduct.bgColor),
                transition: "none", // GSAP handles the transition
              }}
            >
              Contact
            </div>
          </div>
          <div className="flex-center gap-4">
            <div
              ref={btnBackgroundRef2}
              className="flex-center text-sm p-3 rounded-full cursor-pointer"
              style={{
                background: getButtonBackground(currentProduct.bgColor),
                transition: "none", // GSAP handles the transition
              }}
            >
              <img
                src="/images/profile.svg"
                alt="profile"
                className="w-5 h-5"
              />
            </div>
            <div className="flex-center bg-white text-sm p-3 rounded-full cursor-pointer">
              <img src="/images/remove.svg" alt="remove" className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Enhanced background with smooth gradient transitions */}
        <div
          ref={backgroundRef}
          className="absolute inset-0"
          style={{
            background: getBackgroundGradient(currentProduct.bgColor),
            transition: "none", // GSAP handles the transition
          }}
        />

        <div id="brand" className="relative col-center mx-5 mt-10 md:-mt-10">
          <div className="inset-0 size-[60vh] md:size-[52vw] z-10">
            <img
              ref={currentImageRef}
              src={currentProduct.image}
              alt={currentProduct.name}
              width="800"
              height="600"
              className="w-full h-full object-contain"
            />
          </div>
          <img
            id="main-logo"
            src="/images/logo.svg"
            alt="logo"
            width="200"
            height="50"
            className="absolute left-1/2 -translate-x-1/2 w-[70vw] max-w-lg md:w-[75vw] md:max-w-3xl h-auto"
          />
        </div>
        <div className="md:absolute md:bottom-20 flex flex-col-reverse justify-center items-center md:flex-row md:justify-between w-full z-10 px-10 md:px-20 gap-5 text-white">
          <div className="flex flex-col items-center md:items-start justify-between gap-5 w-full md:w-xs text-wrap">
            <div id="title" className="md:w-[5px] self-center md:self-start">
              <span className="text-5xl">{currentProduct.name}</span>
            </div>
            <div id="basic-info" className="flex-between font-light gap-5">
              <span id="name">{currentProduct.flavour}</span>
              <span id="new-price" className="!text-milk-yellow">
                {currentProduct.newPrice}
              </span>
              <span id="old-price" className="line-through !text-milk-yellow">
                {currentProduct.oldPrice}
              </span>
            </div>
            <p id="description" className="font-light text-milk-yellow">
              {currentProduct.description}
            </p>
            <div
              id="order-btn"
              className="flex-center bg-white text-black text-sm w-[70%] h-12 rounded-3xl cursor-pointer"
            >
              Add to cart
            </div>
          </div>
          <span
            id="price"
            className="font-semibold text-4xl self-center md:mr-32 md:self-end"
          >
            {currentProduct.newPrice}
          </span>
          <div className="flex flex-col justify-between items-center md:self-end gap-2">
            <div className="flex flex-col items-center md:items-end gap-5 mb-10">
              <div className="flex-between gap-3">
                <div
                  onClick={goToPrev}
                  disabled={isAnimating}
                  id="arrowleft"
                  className="flex-center text-sm p-3 rounded-full cursor-pointer border-white border"
                >
                  <img
                    alt="arrowleft"
                    src="/images/arrowleft.svg"
                    className="w-7 h-7"
                  />
                </div>
                <div
                  onClick={goToNext}
                  disabled={isAnimating}
                  id="arrowright"
                  className="flex-center text-sm p-3 rounded-full cursor-pointer border-white border rotate-180"
                >
                  <img
                    alt="arrowright"
                    src="/images/arrowleft.svg"
                    className="w-7 h-7"
                  />
                </div>
              </div>
              <div className="flex-between gap-2">
                <img
                  id="sample-1"
                  alt="sample-1"
                  src={currentProduct.firstSampleImgPath}
                  className="w-20 h-20 rounded-2xl"
                />
                <img
                  id="sample-2"
                  alt="sample-2"
                  src={currentProduct.secondSampleImgPath}
                  className="w-20 h-20 rounded-2xl"
                />
              </div>
            </div>
            <div id="counter" className="flex-between gap-5">
              <div className="flex-center text-sm p-3 rounded-xl cursor-pointer border-white border">
                <img
                  alt="minus-button"
                  src="/images/minus.svg"
                  className="w-3 h-3"
                />
              </div>
              <span className="font-semibold text-4xl">2</span>
              <div className="flex-center text-sm p-3 rounded-xl cursor-pointer border-white border">
                <img
                  alt="plus-button"
                  src="/images/plus.svg"
                  className="w-3 h-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroPage;
