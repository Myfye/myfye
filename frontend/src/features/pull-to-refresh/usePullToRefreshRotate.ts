import { MotionValue, useTime, useTransform } from "motion/react";
import { useRef } from "react";

interface UsePullToRefreshRotateParams {
  isRefreshing: Boolean;
  pullChange: MotionValue<number>;
}

export const usePullToRefreshRotate = ({
  isRefreshing,
  pullChange,
}: UsePullToRefreshRotateParams) => {
  const time = useTime();

  const baseRotationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

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
  return rotate;
};
