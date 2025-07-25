import {
  animate,
  MotionValue,
  spring,
  useMotionValue,
  useTime,
  useTransform,
} from "motion/react";
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
  const startClientPoint = useRef({
    x: 0,
    y: 0,
  });

  const time = useTime();

  const baseRotationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Spinner animation params
  const rotate = useTransform(pullChange, (x) => {
    if (isRefreshing) {
      if (startTimeRef.current === null) {
        startTimeRef.current = time.get();
        baseRotationRef.current = x;
      }

      const elapsed = time.get() - startTimeRef.current;
      const rotation = (elapsed / 5) % 360;

      return (baseRotationRef.current + rotation) % 360;
    } else {
      startTimeRef.current = null;
      baseRotationRef.current = null;

      return x;
    }
  });
  const opacity = useTransform(pullChange, [0, PULL_THRESHOLD], [0, 1]);

  const pullMargin = useTransform(pullChange, (x) => x / 3.118);

  useEffect(() => {
    // Only can refresh if at the top of scroll
    const pullStart = (e: TouchEvent) => {
      const el = ref.current;
      if (!el) return;

      if (el.classList.contains("no-scroll-y")) return;

      if (el.scrollTop === 0) {
        setRefresh(true);
      } else {
        setRefresh(false);
      }

      if (!canRefresh) return;

      const [touch] = e.targetTouches;
      const { screenY } = touch;

      setStartPoint(screenY);
      startClientPoint.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const pull = (e: TouchEvent) => {
      const el = ref.current;
      if (!canRefresh || !el || el?.classList.contains("no-scroll-y")) return;

      const [touch] = e.targetTouches;

      const delta = {
        x: touch.clientX - startClientPoint.current.x,
        y: touch.clientY - startClientPoint.current.y,
      };

      const direction = Math.abs(delta.x) > Math.abs(delta.y) ? "x" : "y";

      if (direction === "x") return;

      el.classList.add("no-scroll");

      const { screenY } = touch;

      const pullLength =
        startPoint < screenY ? Math.abs(screenY - startPoint) : 0;
      pullChange.set(pullLength);
    };

    const endPull = async (e: TouchEvent) => {
      const el = ref.current;
      if (!canRefresh || !el || el?.classList.contains("no-scroll-y")) return;

      setStartPoint(0);

      if (pullChange.get() < pullThreshold) {
        await animate(pullChange, 0, { type: spring, bounce: 0.1 });
      } else {
        // if more than or equal to pullThreshold, call the refresh function and then animate back to pullThreshold
        if (onRefreshStart) onRefreshStart();
        setRefreshing(true);
        await animate(pullChange, pullThreshold, { type: spring, bounce: 0.1 });
        if (onRefresh) await onRefresh();
        await animate(pullChange, 0, { type: spring, bounce: 0.1 });
        // Once the animation has completed, end refreshing state and make it so that a user can scroll again
        setRefreshing(false);
        if (onRefreshEnd) onRefreshEnd();
      }

      // Once refresh is completed, make it so the user can scroll again
      el.classList.remove("no-scroll");
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
    pullMargin,
    spinnerParams: {
      rotate,
      opacity,
    },
  };
};
