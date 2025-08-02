// Custom hook for background utilities

import { useCallback } from "react";
import { bgColorMap, gradientMap } from "../../constants";

export const useBackgroundUtils = () => {
  const getButtonBackground = useCallback((bgColorClass) => {
    return bgColorMap[bgColorClass] || bgColorMap.default;
  }, []);

  const getBackgroundGradient = useCallback(
    (bgColorClass, gradientType = "product-halo") => {
      const colors =
        gradientMap[bgColorClass] || gradientMap["caramel-background"];

      const gradientTypes = {
        "product-focused": `
        radial-gradient(circle 700px at center, ${colors.from}80, transparent 60%),
        radial-gradient(circle 1000px at center, ${colors.accent}40, transparent 70%),
        ${colors.to}
      `,
        "product-glow": `
        radial-gradient(circle 800px at 50% 45%, ${colors.from}90, transparent 20%),
        radial-gradient(circle 1000px at 50% 45%, ${colors.accent}30, transparent 40%),
        ${colors.to}
      `,
        spotlight: `
        radial-gradient(circle 1000px at center, ${colors.from}95, transparent 80%),
        ${colors.to}
      `,
        "ambient-light": `
        radial-gradient(circle 220px at 48% 42%, ${colors.from}60, transparent 90%),
        radial-gradient(circle 120px at 52% 48%, ${colors.accent}40, transparent 100%),
        ${colors.to}
      `,
        "product-halo": `
        radial-gradient(circle 700px at center, ${colors.from}85, transparent 75%),
        radial-gradient(circle 800px at center, ${colors.from}25, transparent 85%),
        ${colors.to}
      `,
        radial: `radial-gradient(circle at 30% 20%, ${colors.from}, ${colors.to})`,
        linear: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
        default: `
        radial-gradient(circle 200px at center, ${colors.from}80, transparent 60%),
        radial-gradient(circle 300px at center, ${colors.accent}40, transparent 70%),
        ${colors.to}
      `,
      };

      return gradientTypes[gradientType] || gradientTypes.default;
    },
    []
  );

  return { getButtonBackground, getBackgroundGradient };
};
