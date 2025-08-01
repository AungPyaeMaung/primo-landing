const ProductInfo = ({
  currentProduct,
  titleRef,
  infoRef,
  descriptionRef,
  btnRef,
}) => {
  return (
    <div className="flex flex-col items-center md:items-start justify-between gap-5 w-full md:w-xs text-wrap">
      <div className="relative overflow-hidden">
        {" "}
        {/* Add overflow-hidden to prevent clipped text from showing */}
        <span
          ref={titleRef}
          className="inline-block text-5xl md:w-[11rem] inset-0 self-center md:self-start"
        >
          {currentProduct.name}
        </span>
      </div>
      <div className="relative md:w-[19.5rem]">
        <div
          ref={infoRef}
          id="basic-info"
          className="flex-between inset-0 font-light gap-5"
        >
          <span id="name">{currentProduct.flavour}</span>
          <span id="new-price" className="!text-milk-yellow">
            {currentProduct.newPrice}
          </span>
          <span id="old-price" className="line-through !text-milk-yellow">
            {currentProduct.oldPrice}
          </span>
        </div>
      </div>
      <div className="relative md:h-[5rem]">
        <p
          ref={descriptionRef}
          id="description"
          className="font-light inset-0 text-milk-yellow"
        >
          {currentProduct.description}
        </p>
      </div>
      <div
        ref={btnRef}
        id="order-btn"
        className="flex-center bg-white text-black text-sm w-[70%] h-12 rounded-3xl cursor-pointer mt-7 mb-5 md:mb-0"
      >
        Add to cart
      </div>
    </div>
  );
};

export default ProductInfo;
