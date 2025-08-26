import usePointRenderedValue from "modules/common/hooks/usePointRenderedValue";
import { usePoint } from "modules/common/redux/points";
import React, { useState } from "react";

export const useFXImageSet = (modeXid: string) => {
  const BASE_PATH = "/data/ahu/";
  const [isCooling, setCooling] = useState(false);
  const point = usePoint(null, modeXid);
  const [size] = useState([95, 134]);
  const renderedValue = usePointRenderedValue(point && point.uuid ? point.uuid : null);

  React.useEffect(() => {
    const nextCooling = renderedValue.toLowerCase().includes("chł");
    renderedValue && setCooling(nextCooling);
  }, [renderedValue]);

  const IMAGES: Record<string, string[]> = {
    COOLING: ["CX0.png", "CX1.png", "CX2.png", "CX3.png", "CX4.png", "CX5.png"],
    HEATING: ["CHF0.png", "CHF1.png", "CHF2.png", "CHF3.png", "CHF4.png", "CHF5.png", "CHF6.png", "CHF7.png"],
  };

  const imageSet = (isCooling ? IMAGES.COOLING : IMAGES.HEATING).map((file) => `${BASE_PATH}${file}`);

  return {
    imageSet,
    width: size[0],
    height: size[1],
  };
};
