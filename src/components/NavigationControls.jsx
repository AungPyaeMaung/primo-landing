const NavigationControls = ({
  currentProduct,
  goToPrev,
  goToNext,
  isAnimating,
  productSampleRef,
}) => {
  return (
    <div className="flex flex-col justify-between items-center md:self-end gap-2">
      <div className="flex flex-col items-center md:items-end gap-5 mb-10">
        <div className="flex-between gap-3">
          <div
            onClick={goToPrev}
            disabled={isAnimating}
            id="arrowleft"
            className="flex-center text-sm p-3 rounded-full cursor-pointer border-white md:border-slate-500 xl:border-white border"
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
            className="flex-center text-sm p-3 rounded-full cursor-pointer border-white md:border-slate-500 xl:border-white border rotate-180"
          >
            <img
              alt="arrowright"
              src="/images/arrowleft.svg"
              className="w-7 h-7"
            />
          </div>
        </div>
        <div className="relative">
          <div ref={productSampleRef} className="inset-0 flex-between gap-2">
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
      </div>
      <div id="counter" className="flex-between gap-5">
        <div className="flex-center text-sm p-3 rounded-xl cursor-pointer border-white border">
          <img alt="minus-button" src="/images/minus.svg" className="w-3 h-3" />
        </div>
        <span className="font-semibold text-4xl">2</span>
        <div className="flex-center text-sm p-3 rounded-xl cursor-pointer border-white border">
          <img alt="plus-button" src="/images/plus.svg" className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export default NavigationControls;
