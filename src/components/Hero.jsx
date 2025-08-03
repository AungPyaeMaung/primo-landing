// components/Hero.jsx - Instant loading version
"use client";

import { Helmet } from "react-helmet-async";
import { useState, useEffect, useMemo } from "react";
import { useProductCarousel } from "../hooks/useProductCarousel";
import { useInitialAnimations } from "../hooks/useInitialAnimations";
import { useImagePreloader } from "../hooks/useImagePreloader";
import { productList } from "../../constants";
import Header from "./Header";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import NavigationControls from "./NavigationControls";

const Hero = () => {
  const [isReady, setIsReady] = useState(false);

  // Organize images by priority
  const { allImageSources, criticalImages } = useMemo(() => {
    const critical = [];
    const all = [];

    // Critical: First product + essential UI
    if (productList[0]) {
      critical.push(
        productList[0].image,
        productList[0].firstSampleImgPath,
        productList[0].secondSampleImgPath
      );
    }

    // Essential UI images
    critical.push("/images/logo.svg", "/images/arrowleft.svg");

    // All product images
    productList.forEach((product) => {
      all.push(
        product.image,
        product.firstSampleImgPath,
        product.secondSampleImgPath
      );
    });

    // All UI images
    all.push(
      "/images/logo.svg",
      "/images/profile.svg",
      "/images/remove.svg",
      "/images/arrowleft.svg",
      "/images/minus.svg",
      "/images/plus.svg"
    );

    return { allImageSources: all, criticalImages: critical };
  }, []);

  const { shouldShowLoading, allImagesLoaded, loadingProgress, isImageCached } =
    useImagePreloader(allImageSources);

  const {
    isAnimating,
    titleRef,
    productSampleRef,
    currentImageRef,
    infoRef,
    descriptionRef,
    btnRef,
    priceRef,
    backgroundRef,
    btnBackgroundRef1,
    btnBackgroundRef2,
    sizeRef1,
    sizeRef2,
    getButtonBackground,
    getBackgroundGradient,
    goToNext,
    goToPrev,
    getProductAt,
  } = useProductCarousel();

  const currentProduct = getProductAt(0);

  // Show content immediately if loading is not needed
  useEffect(() => {
    if (!shouldShowLoading && currentProduct) {
      // Very short delay to ensure DOM is ready
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    } else if (!shouldShowLoading) {
      setIsReady(true);
    }
  }, [shouldShowLoading, currentProduct]);

  // Initialize animations when ready
  useInitialAnimations(currentImageRef, titleRef, isReady);

  // Minimal loading screen - only shown for first-time visitors
  if (shouldShowLoading && !isReady) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-milk to-light-brown/20">
        <div className="text-center max-w-sm mx-auto px-6">
          {/* Simplified loading indicator */}
          <div className="w-16 h-16 border-3 border-dark-brown/20 border-t-dark-brown rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-sans font-medium text-dark-brown mb-2">
            PRIMO
          </h2>
          <div className="w-32 bg-dark-brown/10 rounded-full h-1 mx-auto">
            <div
              className="bg-dark-brown h-1 rounded-full transition-all duration-500"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>PRIMO - Refreshing Soft Drinks & Cold Beverages</title>
        <meta
          name="description"
          content="Sip into something refreshing with PRIMO's signature drinks. Explore bold flavours, icy cold beverages, and exciting promotions in our showcase app."
        />

        {/* Aggressive preloading for critical images */}
        {criticalImages.map((src, index) => (
          <link
            key={index}
            rel="preload"
            as="image"
            href={src}
            type={src.endsWith(".svg") ? "image/svg+xml" : "image/webp"}
            crossOrigin="anonymous"
          />
        ))}

        {/* Prefetch remaining images for instant navigation */}
        {allImageSources.slice(criticalImages.length).map((src, index) => (
          <link
            key={`prefetch-${index}`}
            rel="prefetch"
            href={src}
            as="image"
            type={src.endsWith(".svg") ? "image/svg+xml" : "image/webp"}
          />
        ))}

        {/* DNS prefetch and preconnect */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Cache control meta tags */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Helmet>

      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-start relative overflow-hidden">
        <Header
          currentProduct={currentProduct}
          getButtonBackground={getButtonBackground}
          btnBackgroundRef1={btnBackgroundRef1}
          btnBackgroundRef2={btnBackgroundRef2}
        />

        <div
          ref={backgroundRef}
          className="absolute inset-0"
          style={{
            background: getBackgroundGradient(currentProduct.bgColor),
            transition: "none",
          }}
        />

        <div className="absolute flex md:flex-col top-20 left-1/2 -translate-x-1/2 md:top-1/4 md:right-30 md:translate-x-full font-sans text-sm md:text-base gap-2.5">
          <div
            className="flex-center size-12 md:size-14 rounded-full text-black cursor-pointer"
            style={{
              background: "white",
              transition: "none",
            }}
          >
            500
          </div>
          <div
            ref={sizeRef1}
            className="flex-center size-12 md:size-14 rounded-full text-white cursor-pointer"
            style={{
              background: getButtonBackground(currentProduct.bgColor),
              transition: "none",
            }}
          >
            250
          </div>
          <div
            ref={sizeRef2}
            className="flex-center size-12 md:size-14 rounded-full text-white cursor-pointer"
            style={{
              background: getButtonBackground(currentProduct.bgColor),
              transition: "none",
            }}
          >
            100
          </div>
        </div>

        <ProductImage
          currentProduct={currentProduct}
          currentImageRef={currentImageRef}
          isReady={isReady}
          isImageCached={isImageCached}
        />

        <div className="md:absolute md:bottom-20 flex flex-col-reverse justify-center items-center md:flex-row md:justify-between w-full z-10 px-10 md:px-20 gap-5 text-white">
          <ProductInfo
            currentProduct={currentProduct}
            titleRef={titleRef}
            infoRef={infoRef}
            btnRef={btnRef}
            descriptionRef={descriptionRef}
          />

          <div className="relative font-semibold text-4xl self-center md:mr-32 md:self-end">
            <span ref={priceRef} id="price" className="inline-block inset-0">
              {currentProduct.newPrice}
            </span>
          </div>

          <NavigationControls
            currentProduct={currentProduct}
            goToPrev={goToPrev}
            goToNext={goToNext}
            productSampleRef={productSampleRef}
            isAnimating={isAnimating}
          />
        </div>

        {/* Subtle background loading indicator */}
        {!allImagesLoaded && isReady && (
          <div className="fixed bottom-4 left-4 z-50 opacity-30">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;
