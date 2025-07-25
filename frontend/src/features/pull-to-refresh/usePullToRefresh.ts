import {
  animate,
  spring,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTime,
  useTransform,
} from "motion/react";
import { RefObject, useEffect, useRef, useState } from "react";

export type UsePullToRefreshParams = {
  onRefresh?: () => void | Promise<void>;
  onRefreshStart?: () => void;
  onRefreshEnd?: () => void;
  ref: RefObject<HTMLElement>;
  pullThreshold?: number;
  isScrolling?: boolean;
};

export const PULL_THRESHOLD = 128;

export const usePullToRefresh = ({
  onRefreshStart,
  onRefresh,
  onRefreshEnd,
  ref,
  pullThreshold = PULL_THRESHOLD,
  isScrolling,
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

  const currentDirection = useRef<"x" | "y" | null>(null);
  const currentScrollLeft = useRef<number | null>(null);
  const [elWidth, setElWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setElWidth(el.getBoundingClientRect().width);
  });

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

      currentScrollLeft.current = el.scrollLeft;

      const [touch] = e.targetTouches;

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

      currentDirection.current = null;
      setStartPoint(screenY);
      startClientPoint.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const pull = (e: TouchEvent) => {
      const el = ref.current;
      if (!el) return;

      const [touch] = e.targetTouches;

      const offset = {
        x: touch.clientX - startClientPoint.current.x,
        y: touch.clientY - startClientPoint.current.y,
      };

      const next = {
        x: startClientPoint.current.x + offset.x,
        y: startClientPoint.current.y + offset.y,
      };

      currentDirection.current = getCurrentDirection(offset);

      if (isScrolling && currentDirection.current === "x") {
        setRefresh(false);
        return;
      }

      if (!canRefresh) return;

      // for home page
      // makes sense to abstract later on to another event listener so it's only tied to the home page, but this will do for now
      if (el.scrollLeft !== currentScrollLeft.current) {
        const ratio = el.scrollLeft / elWidth;
        currentScrollLeft.current =
          elWidth * 3 * (ratio < 0.5 ? 0 : Math.round(ratio * 3) / (3 * 3));
        el.scrollLeft = currentScrollLeft.current;
      }

      el.classList.add("no-scroll");

      const { screenY } = touch;

      const pullLength =
        startPoint < screenY ? Math.abs(screenY - startPoint) : 0;
      pullChange.set(pullLength);
    };

    const endPull = async (e: TouchEvent) => {
      const el = ref.current;

      if (!canRefresh || !el) return;

      currentScrollLeft.current = null;
      currentDirection.current = null;

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

/**
 * Based on an x/y offset determine the current drag direction. If both axis' offsets are lower
 * than the provided threshold, return `null`.
 *
 * @param offset - The x/y offset from origin.
 * @param lockThreshold - (Optional) - the minimum absolute offset before we can determine a drag direction.
 */
function getCurrentDirection(
  offset: { x: number; y: number },
  lockThreshold = 10
) {
  let direction: "x" | "y" | null = null;

  if (Math.abs(offset.y) > lockThreshold) {
    direction = "y";
  } else if (Math.abs(offset.x) > lockThreshold) {
    direction = "x";
  }

  return direction;
}

export function applyConstraints(
  point: number,
  { min, max }: { min: number; max: number }
): number {
  if (min !== undefined && point < min) {
    // If we have a min point defined, and this is outside of that, constrain
    point = Math.max(point, min);
  } else if (max !== undefined && point > max) {
    // If we have a max point defined, and this is outside of that, constrain
    point = Math.min(point, max);
  }

  return point;
}
