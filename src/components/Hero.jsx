// components/Hero.jsx - Improved version

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

  // Extract all image sources that need preloading
  const imageSources = useMemo(() => {
    const sources = [];
    productList.forEach((product) => {
      sources.push(product.image);
      sources.push(product.firstSampleImgPath);
      sources.push(product.secondSampleImgPath);
    });
    // Add other critical images
    sources.push("/images/logo.svg");
    sources.push("/images/profile.svg");
    sources.push("/images/remove.svg");
    sources.push("/images/arrowleft.svg");
    sources.push("/images/minus.svg");
    sources.push("/images/plus.svg");
    return sources;
  }, []);

  const { allImagesLoaded, loadingProgress } = useImagePreloader(imageSources);

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

  // Only initialize animations after images are loaded
  useInitialAnimations(currentImageRef, titleRef, allImagesLoaded);

  const currentProduct = getProductAt(0);

  // Wait for images to load before showing content
  useEffect(() => {
    if (allImagesLoaded && currentProduct) {
      // Small delay to ensure DOM is fully ready
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [allImagesLoaded, currentProduct]);

  // Loading state
  if (!isReady) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-milk">
        <div className="text-center">
          <div className="w-32 h-32 border-4 border-caramel-lite border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-dark-brown font-sans">
            Loading... {Math.round(loadingProgress)}%
          </p>
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
        {imageSources.slice(0, 6).map((src, index) => (
          <link
            key={index}
            rel="preload"
            as="image"
            href={src}
            type={src.endsWith(".svg") ? "image/svg+xml" : "image/webp"}
          />
        ))}
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
      </div>
    </>
  );
};

export default Hero;
