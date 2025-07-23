import { animate, MotionValue, spring, useMotionValue } from "motion/react";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export type UsePullToRefreshParams = {
  onRefresh?: () => void | Promise<void>;
  onRefreshStart?: () => void;
  onRefreshEnd?: () => void;
  ref: RefObject<HTMLElement>;
  pullThreshold?: number;
};

export const PULL_THRESHOLD = 128;

export const usePullToRefresh = ({
  onRefreshStart,
  onRefresh,
  onRefreshEnd,
  ref,
  pullThreshold = PULL_THRESHOLD,
}: UsePullToRefreshParams) => {
  const [startPoint, setStartPoint] = useState(0);
  const pullChange = useMotionValue(0);
  const [isRefreshing, setRefreshing] = useState(false);
  const [canRefresh, setRefresh] = useState(false);

  useEffect(() => {
    const pullStart = (e: TouchEvent) => {
      const el = ref.current;
      if (!el) return;

      if (el.scrollTop === 0) {
        setRefresh(true);
      } else {
        setRefresh(false);
      }

      const { screenY } = e.targetTouches[0];
      setStartPoint(screenY);
    };

    const pull = (e: TouchEvent) => {
      if (!canRefresh) return;
      /**
       * get the current user touch event data
       */
      const touch = e.targetTouches[0];
      /**
       * get the touch position on the screen's Y axis
       */
      const { screenY } = touch;
      /**
       * The length of the pull
       *
       * if the start touch position is lesser than the current touch position, calculate the difference, which gives the `pullLength`
       *
       * This tells us how much the user has pulled
       */
      const pullLength =
        startPoint < screenY ? Math.abs(screenY - startPoint) : 0;
      pullChange.set(pullLength);
    };

    const endPull = async (e: TouchEvent) => {
      if (!canRefresh) return;
      setStartPoint(0);

      if (pullChange.get() < pullThreshold) {
        await animate(pullChange, 0, { type: spring, bounce: 0.1 });
        return;
      }

      // if more than or equal to pullThreshold, call the refresh function and then animate back to pullThreshold
      if (onRefreshStart) onRefreshStart();
      setRefreshing(true);
      await animate(pullChange, pullThreshold, { type: spring, bounce: 0.1 });
      if (onRefresh) await onRefresh();
      await animate(pullChange, 0, { type: spring, bounce: 0.1 });
      setRefreshing(false);
      if (onRefreshEnd) onRefreshEnd();
    };

    window.addEventListener("touchstart", pullStart);
    window.addEventListener("touchmove", pull);
    window.addEventListener("touchend", endPull);
    return () => {
      window.removeEventListener("touchstart", pullStart);
      window.removeEventListener("touchmove", pull);
      window.removeEventListener("touchend", endPull);
    };
  });
  return {
    startPoint,
    pullChange,
    isRefreshing,
  };
};
