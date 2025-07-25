import { MotionValue, useTime, useTransform } from "motion/react";
import { useRef } from "react";

interface UsePullToRefreshRotateParams {
  isRefreshing: Boolean;
  pullChange: MotionValue<number>;
}
