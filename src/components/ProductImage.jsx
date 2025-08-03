// components/ProductImage.jsx - Improved version
import React, { useState, useCallback } from "react";

const ProductImage = ({ currentProduct, currentImageRef }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
    console.warn(`Failed to load product image: ${currentProduct.image}`);
  }, [currentProduct.image]);

  return (
    <div id="brand" className="relative col-center mx-5 mt-10 md:-mt-10">
      <div className="inset-0 size-[60vh] md:size-[52vw] z-10 relative">
        {/* Loading placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/10 rounded-lg">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error placeholder */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/10 rounded-lg">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">📦</div>
              <p>Product image unavailable</p>
            </div>
          </div>
        )}

        {/* Main product image */}
        <img
          ref={currentImageRef}
          src={currentProduct.image}
          alt={currentProduct.name}
          width="800"
          height="600"
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="eager" // Force eager loading for critical images
          decoding="sync" // Synchronous decoding for immediate display
        />
      </div>
      {/* Logo with proper loading */}
      <img
        id="main-logo"
        src="/images/logo.svg"
        alt="logo"
        width="200"
        height="50"
        className="absolute left-1/2 -translate-x-1/2 w-[70vw] max-w-lg md:w-[75vw] md:max-w-3xl h-auto"
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};

export default ProductImage;
