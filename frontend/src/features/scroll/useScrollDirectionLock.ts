import { RefObject, useEffect, useRef } from "react";

interface UseScrollDirectionLockParams {
  container: RefObject<HTMLElement>;
}

type ScrollDirection = "x" | "y";
type Point = { x: number; y: number };

export const useScrollDirectionLock = ({
  container,
}: UseScrollDirectionLockParams) => {
  const originPoint = useRef<Point>({ x: 0, y: 0 });
  const currentDirection = useRef<ScrollDirection | null>(null);
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      currentDirection.current = null;
      const [touch] = e.targetTouches;
      originPoint.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouch = (e: TouchEvent) => {
      const el = container.current;
      if (!el) return;
      const [touch] = e.targetTouches;
      const offset = {
        x: touch.clientX - originPoint.current.x,
        y: touch.clientY - originPoint.current.y,
      };

      if (currentDirection.current === null) {
        currentDirection.current = getCurrentDirection(offset);
        currentDirection.current &&
          updateScrollLock(el, currentDirection.current);
        return;
      }
    };

    const handleTouchEnd = () => {
      const el = container.current;
      if (!el) return;
      // reset all
      currentDirection.current = null;
      originPoint.current = { x: 0, y: 0 };
      updateScrollLock(el, currentDirection.current);
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouch);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchmove", handleTouch);
      document.addEventListener("touchend", handleTouchEnd);
    };
  }, []);
  return currentDirection;
};

/**
 * Based on an x/y offset determine the current drag direction. If both axis' offsets are lower
 * than the provided threshold, return `null`.
 *
 * @param offset - The x/y offset from origin.
 * @param lockThreshold - (Optional) - the minimum absolute offset before we can determine a drag direction.
 */
function getCurrentDirection(offset: Point, lockThreshold = 10) {
  let direction: ScrollDirection | null = null;

  if (Math.abs(offset.y) > lockThreshold) {
    direction = "y";
  } else if (Math.abs(offset.x) > lockThreshold) {
    direction = "x";
  }

  return direction;
}

function updateScrollLock(
  scrollEl: HTMLElement,
  direction: ScrollDirection | null,
  originPoint?: Point
) {
  if (direction === "y") {
    scrollEl.classList.add("no-scroll-x");
    scrollEl.setAttribute("data-scroll-lock", "y");
    if (originPoint) scrollEl.scrollTop = originPoint.y;
  } else if (direction === "x") {
    scrollEl.classList.add("no-scroll-y");
    scrollEl.setAttribute("data-scroll-lock", "x");
    if (originPoint) scrollEl.scrollLeft = originPoint.x;
  } else {
    scrollEl.classList.remove("no-scroll-x");
    scrollEl.classList.remove("no-scroll-y");
    scrollEl.setAttribute("data-scroll-lock", "none");
  }
}
