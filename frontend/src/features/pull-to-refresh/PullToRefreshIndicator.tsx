import BarsRotateFadeLoader from "@/shared/components/ui/loading/spinners/BarsRotateFadeLoader";
import { css } from "@emotion/react";
import { createPortal } from "react-dom";
import { Ref } from "react";
import { motion, MotionProps, MotionValue } from "motion/react";

type PullToRefreshIndicatorProps = {
  ref?: Ref<HTMLDivElement>;
  top?: string | number;
  dur?: string;
  rotate?: MotionValue<number>;
} & MotionProps;

const PullToRefreshIndicator = ({
  ref,
  top,
  rotate,
  ...restProps
}: PullToRefreshIndicatorProps) => {
  return (
    <>
      <motion.div
        {...restProps}
        className="pull-indicator"
        ref={ref}
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          inset: 0;
          margin-inline: auto;
          bottom: auto;
          z-index: 0;
          opacity: 0;
        `}
      >
        <BarsRotateFadeLoader style={{ rotate }} />
      </motion.div>
    </>
  );
};

export default PullToRefreshIndicator;
