// components/Hero.jsx - Enhanced with Service Worker
"use client";

import { Helmet } from "react-helmet-async";
import { useState, useEffect, useMemo } from "react";
import { useProductCarousel } from "../hooks/useProductCarousel";
import { useInitialAnimations } from "../hooks/useInitialAnimations";
import { useImagePreloader } from "../hooks/useImagePreloader";
import { useServiceWorker } from "../hooks/useServiceWorker";
import { productList } from "../../constants";
import Header from "./Header";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import NavigationControls from "./NavigationControls";

const Hero = () => {
  const [isReady, setIsReady] = useState(false);

  // Service Worker integration
  const { isServiceWorkerReady, preloadImages, isControlled } =
    useServiceWorker();

  // Organize images by priority
  const { allImageSources, criticalImages, nextImages } = useMemo(() => {
    const critical = [];
    const next = [];
    const all = [];

    // Critical: First product + essential UI
    if (productList[0]) {
      critical.push(
        productList[0].image,
        productList[0].firstSampleImgPath,
        productList[0].secondSampleImgPath
      );
    }

    // Next: Second and third products for navigation
    if (productList[1]) {
      next.push(
        productList[1].image,
        productList[1].firstSampleImgPath,
        productList[1].secondSampleImgPath
      );
    }
    if (productList[2]) {
      next.push(
        productList[2].image,
        productList[2].firstSampleImgPath,
        productList[2].secondSampleImgPath
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

    return {
      allImageSources: all,
      criticalImages: critical,
      nextImages: next,
    };
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

  // Preload images via service worker when ready
  useEffect(() => {
    if (isServiceWorkerReady && !allImagesLoaded) {
      // First preload critical images
      preloadImages(criticalImages);

      // Then preload next navigation images after a short delay
      setTimeout(() => {
        preloadImages(nextImages);
      }, 1000);

      // Finally preload all remaining images
      setTimeout(() => {
        const remainingImages = allImageSources.filter(
          (img) => !criticalImages.includes(img) && !nextImages.includes(img)
        );
        preloadImages(remainingImages);
      }, 3000);
    }
  }, [
    isServiceWorkerReady,
    allImagesLoaded,
    preloadImages,
    criticalImages,
    nextImages,
    allImageSources,
  ]);

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

  // Enhanced loading screen with service worker status
  if (shouldShowLoading && !isReady) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-milk to-light-brown/20">
        <div className="text-center max-w-sm mx-auto px-6">
          {/* Loading indicator */}
          <div className="relative mb-4">
            <div className="w-16 h-16 border-3 border-dark-brown/20 border-t-dark-brown rounded-full animate-spin mx-auto"></div>
            {isServiceWorkerReady && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          <h2 className="text-lg font-sans font-medium text-dark-brown mb-2">
            PRIMO
          </h2>

          <p className="text-sm text-dark-brown/70 mb-3">
            {isControlled ? "Loading from cache..." : "Preparing experience..."}
          </p>

          <div className="w-32 bg-dark-brown/10 rounded-full h-1 mx-auto">
            <div
              className="bg-dark-brown h-1 rounded-full transition-all duration-500"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>

          {/* Service Worker status indicator */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="mt-3 text-xs text-dark-brown/50">
              SW: {isServiceWorkerReady ? '✓' : '⏳'} | 
              Controlled: {isControlled ? '✓' : '✗'}
            </div>
          )} */}
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

        {/* Preload critical images */}
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

        {/* Prefetch next navigation images */}
        {nextImages.map((src, index) => (
          <link
            key={`prefetch-${index}`}
            rel="prefetch"
            href={src}
            as="image"
            type={src.endsWith(".svg") ? "image/svg+xml" : "image/webp"}
          />
        ))}

        {/* DNS optimization */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
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

        {/* Multi-level loading indicators */}
        {!allImagesLoaded && isReady && (
          <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
            {isServiceWorkerReady && (
              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;
