import { RefObject, useEffect } from "react";

interface UseOverlayParams {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  ref?: RefObject<HTMLElement | null>;
}
export const useOverlay = ({ isOpen, onOpenChange, ref }: UseOverlayParams) => {
  useEffect(() => {
    if (isOpen) {
      const el = ref?.current;
      if (el) {
        const focusableElements = el.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKeyPress = (e: KeyboardEvent) => {
          if (e.key === "Tab") {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        };

        const handleEscapeKeyPress = (e: KeyboardEvent) => {
          if (e.key === "Escape" && onOpenChange) {
            onOpenChange(false);
          }
        };

        el.addEventListener("keydown", handleTabKeyPress);
        el.addEventListener("keydown", handleEscapeKeyPress);

        return () => {
          el.removeEventListener("keydown", handleTabKeyPress);
          el.removeEventListener("keydown", handleEscapeKeyPress);
        };
      }
    }
  }, [isOpen, onOpenChange]);
};
