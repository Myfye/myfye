import { HTMLAttributes, ReactNode, useRef } from "react";
import {
  animate,
  motion,
  MotionProps,
  PanInfo,
  useMotionValue,
  useTransform,
} from "motion/react";
import { css } from "@emotion/react";
import BarsRotateFadeLoader from "@/shared/components/ui/loading/spinners/BarsRotateFadeLoader";

interface PullToRefreshProps extends HTMLAttributes<HTMLDivElement> {
  onRefreshStart?: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
  onRefreshEnd?: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
  onRefresh?: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => Promise<void> | void;
  height?: string;
  children: ReactNode;
}

const inertiaTransition = {
  type: "inertia" as const,
  bounceStiffness: 300,
  bounceDamping: 40,
  timeConstant: 300,
};

const MAX_PULL_HEIGHT = 50;

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};
const MotionBarsRotateFadeLoader = motion(BarsRotateFadeLoader);

const PullToRefresh = ({
  onRefreshStart,
  onRefreshEnd,
  onRefresh,
  children,
  height = "auto",
  ...restProps
}: PullToRefreshProps) => {
  const ref = useRef<HTMLDivElement>(null!);
  const scrollY = useMotionValue(0);
  const opacity = useTransform(scrollY, [0, MAX_PULL_HEIGHT], [0, 1]);

  return (
    <div
      css={css`
        position: relative;
        height: ${height};
        isolation: isolate;
      `}
    >
      <motion.div
        ref={ref}
        className={`pull-to-refresh ${
          restProps.className ? restProps.className : ""
        }`}
        style={{ y: scrollY }}
        transition={staticTransition}
        dragDirectionLock
        drag="y"
        dragConstraints={{
          top: 0,
          bottom: MAX_PULL_HEIGHT,
        }}
        onDragStart={(...args) => {
          const [e, info] = args;
          onRefreshStart && onRefreshStart(...args);
        }}
        onDragEnd={async (...args) => {
          const [e, info] = args;
          if (info.offset.y >= MAX_PULL_HEIGHT) {
            onRefresh && (await onRefresh(...args));
          }
          animate(scrollY, 0, { ...inertiaTransition, min: 0, max: 0 });
        }}
        dragElastic={0.1}
        whileTap={{ cursor: "grabbing" }}
        css={css`
          position: relative;
          height: ${height};
          overflow: hidden;
          z-index: 1;
        `}
        {...(restProps as HTMLAttributes<HTMLDivElement> & MotionProps)}
      >
        {children}
      </motion.div>
      <MotionBarsRotateFadeLoader
        ref={(node) => {
          if (!node) return;
          node.style.top = `${
            MAX_PULL_HEIGHT / 2 - node.getBoundingClientRect().height / 2
          }px`;
        }}
        style={{ opacity }}
        fill="var(--clr-black)"
        width={32}
        height={32}
        css={css`
          position: absolute;
          inset: 0;
          margin: auto;
          bottom: auto;
          z-index: 0;
        `}
      />
    </div>
  );
};

export default PullToRefresh;
