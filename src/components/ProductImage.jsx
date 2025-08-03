import React from "react";

const ProductImage = ({ currentProduct, currentImageRef }) => {
  return (
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
  );
};

export default ProductImage;
