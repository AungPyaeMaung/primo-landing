const ProductInfo = ({ currentProduct }) => {
  return (
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
  );
};

export default ProductInfo;
