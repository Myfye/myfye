import { assertIsNode } from "@/shared/utils/typeUtils";
import {
  animate,
  spring,
  useMotionValue,
  useTime,
  useTransform,
} from "motion/react";
import { RefObject, useEffect, useRef, useState } from "react";

export type UsePullToRefreshParams = {
  onRefresh?: () => void | Promise<void>;
  onRefreshStart?: () => void;
  onRefreshEnd?: () => void;
  container: RefObject<HTMLElement>;
  pullThreshold?: number;
};

export const PULL_THRESHOLD = 128;

export const usePullToRefresh = ({
  onRefreshStart,
  onRefresh,
  onRefreshEnd,
  container,
  pullThreshold = PULL_THRESHOLD,
}: UsePullToRefreshParams) => {
  const [startPoint, setStartPoint] = useState(0);
  const pullChange = useMotionValue(0);
  const [isRefreshing, setRefreshing] = useState(false);
  const [canRefresh, setRefresh] = useState(false);

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

      // TODO handle time between async calls
      const elapsed = time.get() - startTimeRef.current;
      const rotation = (elapsed / 5) % 360;

      return baseRotationRef.current
        ? (baseRotationRef.current + rotation) % 360
        : x;
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
      const el = container.current;
      if (!el) return;

      const [touch] = e.targetTouches;
      assertIsNode(touch.target);

      // Prevent drag if current active element is not the ref or a child of the ref
      if (!el.contains(touch.target) && touch.target !== el) {
        setRefresh(false);
        return;
      }

      if (el.scrollTop === 0) {
        setRefresh(true);
      } else {
        setRefresh(false);
        return;
      }

      const { screenY } = touch;

      setStartPoint(screenY);
    };

    const pull = (e: TouchEvent) => {
      const el = container.current;
      if (!el) return;

      const scrollLock = el.dataset.scrollLock;
      if (scrollLock && scrollLock === "x") return;

      const [touch] = e.targetTouches;

      if (!canRefresh) return;

      const { screenY } = touch;

      const pullLength =
        startPoint < screenY ? Math.abs(screenY - startPoint) : 0;
      pullChange.set(pullLength);
    };

    const endPull = async (e: TouchEvent) => {
      const el = container.current;

      if (!canRefresh || !el) return;

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
    };

    document.addEventListener("touchstart", pullStart);
    document.addEventListener("touchmove", pull);
    document.addEventListener("touchend", endPull);
    return () => {
      document.removeEventListener("touchstart", pullStart);
      document.removeEventListener("touchmove", pull);
      document.removeEventListener("touchend", endPull);
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
