import BarsRotateFadeLoader from "@/shared/components/ui/loading/spinners/BarsRotateFadeLoader";
import { css } from "@emotion/react";
import { Ref } from "react";
import { motion, MotionProps } from "motion/react";

type PullToRefreshIndicatorProps = {
  ref?: Ref<HTMLDivElement>;
  top?: string | number;
  dur?: string;
} & MotionProps;

const PullToRefreshIndicator = ({
  ref,
  top,
  ...restProps
}: PullToRefreshIndicatorProps) => {
  return (
    <>
      <motion.div
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
        `}
      >
        <BarsRotateFadeLoader {...restProps} />
      </motion.div>
    </>
  );
};

export default PullToRefreshIndicator;
