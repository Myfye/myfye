import { RefObject, useEffect, useRef, useState } from "react";

interface UseModalParams {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  ref?: RefObject<HTMLElement | null>;
  initialFocus?: RefObject<HTMLElement>;
}
export const useModal = ({
  isOpen,
  onOpenChange,
  ref,
  initialFocus,
}: UseModalParams) => {
  const prevFocusEl = useRef<Element | null>(null!);

  useEffect(() => {
    // TODO focus goes to body after close. need to update this for a11y
    const focusEl = initialFocus?.current;
    prevFocusEl.current = document.activeElement;

    if (isOpen && focusEl) {
      focusEl.focus();
    }

    return () => {
      focusEl?.blur();

      // focus on previous active element
      if (prevFocusEl instanceof HTMLElement) prevFocusEl?.focus();
    };
  }, [isOpen]);

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

        el.addEventListener("keydown", handleTabKeyPress);

        return () => {
          el.removeEventListener("keydown", handleTabKeyPress);
        };
      }
    }
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      const el = ref?.current;
      if (!isOpen || !onOpenChange || !el) return;
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    const el = ref?.current;
    if (!el) return;
    el.addEventListener("keydown", handleEscapeKeyPress);
    return () => void el.removeEventListener("keydown", handleEscapeKeyPress);
  }, [isOpen, onOpenChange]);
};
