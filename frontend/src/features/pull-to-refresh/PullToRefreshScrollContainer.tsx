import { motion, MotionValue } from "motion/react";
import { ReactNode, RefObject } from "react";

type Props = {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  pullMargin: MotionValue<number>;
};
const PullToRefreshScrollContainer = ({ pullMargin, children, ref }: Props) => {
  return (
    <motion.div className="no-scrollbar" ref={ref} style={{ y: pullMargin }}>
      {children}
    </motion.div>
  );
};

export default PullToRefreshScrollContainer;
