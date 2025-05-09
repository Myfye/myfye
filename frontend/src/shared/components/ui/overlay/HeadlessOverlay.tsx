import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { Modal, ModalOverlay } from "react-aria-components";
import { ReactNode, useId } from "react";

import { css } from "@emotion/react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// Wrap React Aria modal components so they support motion values.
const MotionDialog = motion(Dialog);
const MotionDialogPanel = motion(DialogPanel);
const MotionDialogBackdrop = motion(DialogBackdrop);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const HeadlessOverlay = ({
  isOpen,
  onOpenChange,
  backgroundColor = "var(--clr-surface)",
  zIndex = 1000,
  children,
  onExitComplete,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  backgroundColor?: string;
  zIndex?: number;
  children: ReactNode;
  onExitComplete?: () => void;
  onEnterComplete?: () => void;
}) => {
  let w = window.innerWidth;
  let x = useMotionValue(w);

  return (
    <>
      <AnimatePresence onExitComplete={onExitComplete}>
        {isOpen && (
          <MotionDialog
            open
            onClose={() => onOpenChange(false)}
            css={css`
              position: fixed;
              inset: 0;
              z-index: ${zIndex};
              max-width: 420px;
              margin-inline: auto;
              isolation: isolate;
            `}
          >
            <MotionDialogPanel
              css={css`
                background-color: ${backgroundColor};
                position: absolute;
                bottom: 0;
                width: 100%;
                will-change: transform;
                height: 100dvh;
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
                  display: grid;
                  grid-template-rows: auto 1fr;
                  height: 100dvh;
                  max-width: var(--app-max-width);
                  width: 100vw;
                `}
              >
                {children}
              </div>
            </MotionDialogPanel>
          </MotionDialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeadlessOverlay;
