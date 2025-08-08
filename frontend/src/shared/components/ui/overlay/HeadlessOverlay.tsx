import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { Modal, ModalOverlay } from "react-aria-components";
import { ReactNode, useId, useRef } from "react";

import { css } from "@emotion/react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { createPortal } from "react-dom";
import { useOverlay } from "./useOverlay";
import { OverlayProps } from "./Overlay";
import Portal from "../portal/Portal";

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

interface HeadlessOverlayProps extends OverlayProps {
  backgroundColor?: string;
  titleId?: string;
}

const HeadlessOverlay = ({
  isOpen,
  onOpenChange,
  backgroundColor = "var(--clr-surface)",
  zIndex = 1000,
  children,
  initialFocus,
  onExit,
  titleId,
}: HeadlessOverlayProps) => {
  let w = window.innerWidth;
  const x = useMotionValue(w);

  const overlayRef = useRef<HTMLDivElement | null>(null);

  useOverlay({ isOpen, onOpenChange, ref: overlayRef, initialFocus });

  return (
    <>
      <Portal containerId="screens">
        <AnimatePresence onExitComplete={onExit}>
          {isOpen && (
            <motion.div
              aria-labelledby={titleId}
              aria-label={!titleId ? "Page" : undefined}
              ref={overlayRef}
              css={css`
                position: fixed;
                inset: 0;
                z-index: ${zIndex};
                max-width: 420px;
                margin-inline: auto;
                isolation: isolate;
              `}
            >
              <motion.div
                css={css`
                  background-color: ${backgroundColor};
                  position: absolute;
                  bottom: 0;
                  width: 100%;
                  will-change: transform;
                  height: ${window.innerHeight}px;
                  z-index: 1;
                `}
                initial={{ x: w }}
                animate={{ x: 0 }}
                exit={{ x: w }}
                transition={staticTransition}
                style={{
                  x,
                  left: 0,
                  // Extra padding at the right to account for rubber band scrolling.
                  paddingRight: window.screen.width,
                }}
              >
                <div
                  css={css`
                    height: ${window.innerHeight}px;
                    max-width: var(--app-max-width);
                    width: 100vw;
                  `}
                >
                  {children}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

export default HeadlessOverlay;
