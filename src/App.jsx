const App = () => {
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center relative overflow-hidden">
      <div className="flex-between w-full z-10 px-10 md:px-20 pt-5">
        <img
          src="/images/logo.svg"
          alt="logo"
          className="w-[15vw] md:w-[5vw]"
        />
        <div className="flex-center gap-2">
          <div className="flex-center bg-white text-black text-sm w-24 h-10 rounded-3xl cursor-pointer">
            Products
          </div>
          <div className="flex-center bg-[#771208] text-white text-sm w-24 h-10 rounded-3xl cursor-pointer">
            Contact
          </div>
        </div>
        <div className="flex-center gap-4">
          <div className="flex-center bg-[#771208] text-sm p-3 rounded-full cursor-pointer">
            <img src="/images/profile.svg" alt="profile" className="w-5 h-5" />
          </div>
          <div className="flex-center bg-white text-sm p-3 rounded-full cursor-pointer">
            <img src="/images/remove.svg" alt="remove" className="w-5 h-5" />
          </div>
        </div>
      </div>
      {/* Main orange radial gradient background matching the image */}
      <div className="absolute inset-0 caramel-background" />
      <div className="relative flex items-center justify-center mt-5">
        <img
          src="/images/caramel.png"
          alt="caramel"
          className="w-[42vw] md:w-[28vw] z-10"
        />
        <div className="absolute top-1/2 left-1/2 -translate-1/2 w-[60vw] md:w-[65vw]">
          <img src="/images/logo.svg" alt="logo" className="w-full" />
        </div>
      </div>
      <div className="flex justify-between w-full z-10 px-10 md:px-20 -mt-60 text-white">
        <div className="flex flex-col items-start justify-between gap-5">
          <span className="text-5xl">
            Caramel
            <br />
            Crave
          </span>
          <div className="flex-between font-light gap-5">
            <span>Guava Favour</span>
            <span>$79.50</span>
            <span className="line-through">$89.50</span>
          </div>
          <p className="font-light">
            Experience the perfect blend of fresh, juicy <br />
            oranges in every sip! Our orange smoothie is <br />
            packed with natural vitamins, a burst of citrus <br />
            flavor, and no added preservatives.
          </p>
          <div className="flex-center bg-white text-black text-sm w-[70%] h-12 rounded-3xl cursor-pointer">
            Add to cart
          </div>
        </div>
        <span className="font-semibold text-4xl self-end">$79.50</span>
      </div>
    </div>
  );
};

export default App;
