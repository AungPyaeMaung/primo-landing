const productList = [
  {
    name: "Caramel Crave",
    bgColor: "caramel-background",
    flavour: "Salted Caramel Flavour",
    oldPrice: "$89.50",
    newPrice: "$79.50",
    description:
      "Experience the perfect blend of fresh, juicy oranges in every sip! Our orange smoothie is packed with natural vitamins, a burst of citrus flavor, and no added preservatives",
    image: "/images/caramel.webp",
    firstSampleImgPath: "/images/caramel-sample-1.webp",
    secondSampleImgPath: "/images/caramel-sample-2.webp",
  },
  {
    name: "Creamy Coffee",
    bgColor: "chocolate-background",
    flavour: "Mocha Blend Flavour",
    oldPrice: "$94.00",
    newPrice: "$84.00",
    description:
      "Indulge in the rich aroma and smooth taste of our creamy coffee blend. Crafted with premium beans and a touch of sweetness, it's your perfect companion for any time of day.",
    image: "/images/chocolate.webp",
    firstSampleImgPath: "/images/chocolate-sample-1.webp",
    secondSampleImgPath: "/images/chocolate-sample-2.webp",
  },
  {
    name: "Sublime Lime",
    bgColor: "lime-background",
    flavour: "Zesty Lime Flavour",
    oldPrice: "$87.00",
    newPrice: "$77.00",
    description:
      "Refresh your senses with the zesty zing of lime! This smoothie delivers a tangy twist that’s both invigorating and packed with natural antioxidants and vitamin C.",
    image: "/images/lime.webp",
    firstSampleImgPath: "/images/lime-sample-1.webp",
    secondSampleImgPath: "/images/lime-sample-2.webp",
  },
  {
    name: "Mango Mania",
    bgColor: "mango-background",
    oldPrice: "$88.00",
    newPrice: "$78.00",
    flavour: "Tropical Mango",
    description:
      "Bursting with the juicy sweetness of ripe mangoes, this vibrant drink brings tropical sunshine to every sip — creamy, smooth, and irresistibly fruity.",
    image: "/images/mango.webp",
    firstSampleImgPath: "/images/mango-sample-1.webp",
    secondSampleImgPath: "/images/mango-sample-2.webp",
  },
  {
    name: "Berry Bliss",
    bgColor: "berry-background",
    oldPrice: "$91.00",
    newPrice: "$81.00",
    flavour: "Mixed Berries",
    description:
      "A rich blend of strawberries, blueberries, and raspberries, this creamy drink offers a perfect balance of sweet and tangy in every delicious drop.",
    image: "/images/berry.webp",
    firstSampleImgPath: "/images/berry-sample-1.webp",
    secondSampleImgPath: "/images/berry-sample-2.webp",
  },
  {
    name: "Banana Burst",
    bgColor: "banana-background",
    oldPrice: "$86.00",
    newPrice: "$76.00",
    flavour: "Creamy Banana",
    description:
      "Smooth, mellow, and packed with banana goodness, this classic flavour brings a nostalgic, comforting taste that's perfect any time of day.",
    image: "/images/banana.webp",
    firstSampleImgPath: "/images/banana-sample-1.webp",
    secondSampleImgPath: "/images/banana-sample-2.webp",
  },
];

// Map your CSS classes to actual gradient values
const bgColorMap = {
  "caramel-background": "#79311c",
  "chocolate-background": "#38190d",
  "lime-background": "#64770d",
  "mango-background": "#d97706",
  "berry-background": "#be185d",
  "banana-background": "#ca8a04",
};

// Map your CSS classes to actual gradient values
const gradientMap = {
  "caramel-background": {
    from: "#F2B08D", // warm orange
    to: "#B03A0B", // deep burnt orange
    accent: "#fc7039", // vibrant accent
  },
  "chocolate-background": {
    from: "#d2b48c", // light tan
    to: "#5c2814", // dark chocolate
    accent: "#8b4513", // saddle brown accent
  },
  "lime-background": {
    from: "#E9F6B6", // light lime
    to: "#6A8202", // dark slate
    accent: "#E9F6B6", // lime accent
  },
  "mango-background": {
    from: "#fed7aa", // peach
    to: "#c27511", // orange
    accent: "#fdd347", // amber accent
  },
  "berry-background": {
    from: "#fbb6ce", // light pink
    to: "#9f1239", // deep rose
    accent: "#ec4899", // pink accent
  },
  "banana-background": {
    from: "#fef3c7", // light yellow
    to: "#d97706", // amber
    accent: "#f59e0b", // yellow accent
  },
  "tropical-background": {
    from: "#a7f3d0", // light emerald
    to: "#047857", // emerald
    accent: "#10b981", // emerald accent
  },
  "sunset-background": {
    from: "#fed7d7", // light red
    to: "#dc2626", // red
    accent: "#f87171", // red accent
  },
};
export { productList, bgColorMap, gradientMap };
