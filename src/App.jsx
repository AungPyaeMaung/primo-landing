import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { productList } from "../constants";

const App = () => {
  useGSAP(() => {
    gsap.from("#main-logo", {
      xPercent: 200,
      duration: 0.8,
      scrub: true,
      ease: "power1.out",
    });

    gsap.from("#main-product", {
      yPercent: -200,
      duration: "0.9",
      scrub: true,
      ease: "power1.out",
    });

    gsap.from("#title", {
      yPercent: 30,
      opacity: 0,
      duration: "1",
      scrub: true,
      ease: "power1.out",
    });
    gsap.from(
      "#basic-info",
      {
        yPercent: 70,
        opacity: 0,
        duration: "1",
        scrub: true,
        ease: "power1.out",
      },
      "-=0.8"
    );
    gsap.from("#price", {
      yPercent: 50,
      opacity: 0,
      duration: "1",
      scrub: true,
      ease: "power1.out",
    });
    gsap.from(
      "#description",
      {
        yPercent: 30,
        opacity: 0,
        duration: "1",
        scrub: true,
        ease: "power1.out",
      },
      "-=0.8"
    );
    gsap.from(
      "#order-btn",
      {
        yPercent: 50,
        opacity: 0,
        duration: "1",
        scrub: true,
        ease: "power1.out",
      },
      "<"
    );

    gsap.from(
      "#name",
      {
        yPercent: 50,
        opacity: 0,
        duration: "0.5",
        scrub: true,
        ease: "power1.out",
      },
      "-=0.9"
    );

    gsap.from(
      "#new-price",
      {
        yPercent: 50,
        opacity: 0,
        duration: "0.5",
        scrub: true,
        ease: "power1.out",
      },
      "-=0.8"
    );

    gsap.from(
      "#old-price",
      {
        yPercent: 50,
        opacity: 0,
        duration: "0.5",
        scrub: true,
        ease: "power1.out",
      },
      "-=0.7"
    );
    gsap.from(
      "#arrowleft",
      {
        yPercent: 20,
        opacity: 0,
        duration: "0.5",
        scrub: true,
        ease: "power1.out",
      },
      "-=0.9"
    );
    gsap.from(
      "#arrowright",
      {
        yPercent: 20,
        opacity: 0,
        duration: "0.5",
        scrub: true,
        ease: "power1.out",
      },
      "-=0.7"
    );
    gsap.from(
      "#sample-1",
      {
        yPercent: 20,
        opacity: 0,
        duration: "0.3",
        scrub: true,
        ease: "power1.out",
      },
      "-=0.8"
    );
    gsap.from(
      "#sample-2",
      {
        yPercent: 20,
        opacity: 0,
        duration: "0.3",
        scrub: true,
        ease: "power1.out",
      },
      "-=0.7"
    );

    gsap.from(
      "#counter",
      {
        yPercent: 50,
        opacity: 0,
        duration: "0.5",
        scrub: true,
        ease: "power1.out",
      },
      "-=0.7"
    );
  });
  return (
    <div className="h-full md:min-h-[100dvh] w-full flex flex-col items-center relative overflow-hidden">
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
      {productList.map((product, index) => (
        <div key={index} className="w-full">
          <div className="relative flex items-center justify-center mt-5">
            <img
              id="main-product"
              src={product.mainImgPath}
              alt={product.name}
              className="w-[42vw] md:w-[28vw] z-10"
            />
            <div className="absolute top-1/2 left-1/2 -translate-1/2 w-[60vw] md:w-[65vw]">
              <img
                id="main-logo"
                src="/images/logo.svg"
                alt="logo"
                className="w-full"
              />
            </div>
          </div>
          <div className="md:absolute md:bottom-12 flex flex-col-reverse justify-center items-center md:flex-row md:justify-between w-full z-10 px-10 md:px-20 gap-5 text-white">
            <div className="flex flex-col items-start justify-between gap-5 w-full md:w-xs text-wrap">
              <span id="title" className="text-5xl">
                {product.name}
              </span>
              <div id="basic-info" className="flex-between font-light gap-5">
                <span id="name">Guava Favour</span>
                <span id="new-price" className="!text-milk-yellow">
                  {product.newPrice}
                </span>
                <span id="old-price" className="line-through !text-milk-yellow">
                  {product.oldPrice}
                </span>
              </div>
              <p id="description" className="font-light text-milk-yellow">
                {product.description}
              </p>
              <div
                id="order-btn"
                className="flex-center bg-white text-black text-sm w-[70%] h-12 rounded-3xl cursor-pointer"
              >
                Add to cart
              </div>
            </div>
            <span
              id="price"
              className="font-semibold text-4xl self-center md:mr-30 md:self-end"
            >
              {product.newPrice}
            </span>
            <div className="flex flex-col justify-between items-center md:self-end gap-2">
              <div className="flex flex-col items-center md:items-end gap-5 mb-10">
                <div className="flex-between gap-3">
                  <div
                    id="arrowleft"
                    className="flex-center text-sm p-3 rounded-full cursor-pointer border-white border"
                  >
                    <img src="/images/arrowleft.svg" className="w-7 h-7" />
                  </div>
                  <div
                    id="arrowright"
                    className="flex-center text-sm p-3 rounded-full cursor-pointer border-white border rotate-180"
                  >
                    <img src="/images/arrowleft.svg" className="w-7 h-7" />
                  </div>
                </div>
                <div className="flex-between gap-2">
                  <img
                    id="sample-1"
                    src={product.firstSampleImgPath}
                    className="w-20 h-20 rounded-2xl"
                  />
                  <img
                    id="sample-2"
                    src={product.secondSampleImgPath}
                    className="w-20 h-20 rounded-2xl"
                  />
                </div>
              </div>
              <div id="counter" className="flex-between gap-5">
                <div className="flex-center text-sm p-3 rounded-xl cursor-pointer border-white border">
                  <img src="/images/minus.svg" className="w-3 h-3" />
                </div>
                <span className="font-semibold text-4xl">2</span>
                <div className="flex-center text-sm p-3 rounded-xl cursor-pointer border-white border">
                  <img src="/images/plus.svg" className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
