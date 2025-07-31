const Header = ({
  currentProduct,
  getButtonBackground,
  btnBackgroundRef1,
  btnBackgroundRef2,
}) => {
  return (
    <div className="flex-between w-full z-10 px-10 md:px-20 pt-5">
      <div className="w-[15vw] md:w-[5vw] aspect-[3/2]">
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
            transition: "none",
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
            transition: "none",
          }}
        >
          <img src="/images/profile.svg" alt="profile" className="w-5 h-5" />
        </div>
        <div className="flex-center bg-white text-sm p-3 rounded-full cursor-pointer">
          <img src="/images/remove.svg" alt="remove" className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default Header;
