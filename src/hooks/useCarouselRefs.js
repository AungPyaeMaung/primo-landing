import { useRef } from "react";

// Custom hook for managing carousel refs
export const useCarouselRefs = () => {
  return {
    currentImageRef: useRef(null),
    titleRef: useRef(null),
    productSampleRef: useRef(null),
    infoRef: useRef(null),
    descriptionRef: useRef(null),
    backgroundRef: useRef(null),
    btnRef: useRef(null),
    priceRef: useRef(null),
    btnBackgroundRef1: useRef(null),
    btnBackgroundRef2: useRef(null),
    sizeRef1: useRef(null),
    sizeRef2: useRef(null),
  };
};
