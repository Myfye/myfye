import { css } from "@emotion/react";
import {
  motion,
  MotionProps,
  MotionValue,
  useAnimationFrame,
  useMotionValue,
} from "motion/react";
import { Ref, SVGAttributes } from "react";

type BarsRotateFadeLoaderProps = {
  ref?: Ref<SVGSVGElement>;
  width?: number;
  height?: number;
} & MotionProps;

const BarsRotateFadeLoader = ({
  ref,
  height = 24,
  width = 24,
  ...restProps
}: BarsRotateFadeLoaderProps) => {
  return (
    <motion.svg
      {...restProps}
      width={width}
      height={height}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2400 2400"
    >
      <g
        stroke-width="200"
        stroke-linecap="round"
        stroke="currentColor"
        fill="none"
        id="spinner"
      >
        <line x1="1200" y1="600" x2="1200" y2="100" />
        <line opacity="0.5" x1="1200" y1="2300" x2="1200" y2="1800" />
        <line opacity="0.917" x1="900" y1="680.4" x2="650" y2="247.4" />
        <line opacity="0.417" x1="1750" y1="2152.6" x2="1500" y2="1719.6" />
        <line opacity="0.833" x1="680.4" y1="900" x2="247.4" y2="650" />
        <line opacity="0.333" x1="2152.6" y1="1750" x2="1719.6" y2="1500" />
        <line opacity="0.75" x1="600" y1="1200" x2="100" y2="1200" />
        <line opacity="0.25" x1="2300" y1="1200" x2="1800" y2="1200" />
        <line opacity="0.667" x1="680.4" y1="1500" x2="247.4" y2="1750" />
        <line opacity="0.167" x1="2152.6" y1="650" x2="1719.6" y2="900" />
        <line opacity="0.583" x1="900" y1="1719.6" x2="650" y2="2152.6" />
        <line opacity="0.083" x1="1750" y1="247.4" x2="1500" y2="680.4" />
      </g>
    </motion.svg>
  );
};

export default BarsRotateFadeLoader;
