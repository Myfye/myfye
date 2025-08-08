import { useEffect, useRef } from "react";

interface UseNumberPadParams {
  onStartDelete?: (input: string) => void;
  onUpdateAmount?: (input: string) => void;
  onUpdatePresetAmount?: (presetAmount: null) => void;
  formattedAmount?: string;
}

export const useNumberPad = ({
  onStartDelete,
  formattedAmount,
  onUpdateAmount,
  onUpdatePresetAmount,
}: UseNumberPadParams) => {
  const intervalDelete = useRef<NodeJS.Timeout | null>(null);
  const delayDelete = useRef<NodeJS.Timeout | null>(null);

  const startDelete = (input: string) => {
    intervalDelete.current = setInterval(() => {
      onStartDelete && onStartDelete(input);
    }, 50);
  };

  const stopDelete = () => {
    if (intervalDelete.current) {
      clearInterval(intervalDelete.current);
    }
    if (delayDelete.current) {
      clearTimeout(delayDelete.current);
    }
  };

  const onNumberPressStart = (input: string) => {
    if (input === "delete") {
      onUpdateAmount && onUpdateAmount(input);
      delayDelete.current = setTimeout(() => {
        startDelete(input);
      }, 200);
    }
  };

  const onNumberPress = (input: string) => {
    onUpdatePresetAmount && onUpdatePresetAmount(null);
    if (input === "delete") return;
    onUpdateAmount && onUpdateAmount(input);
  };

  const onNumberPressEnd = () => {
    stopDelete();
  };

  useEffect(() => {
    if (formattedAmount === "") stopDelete();
  }, [formattedAmount]);

  return {
    onNumberPressStart,
    onNumberPress,
    onNumberPressEnd,
  };
};
