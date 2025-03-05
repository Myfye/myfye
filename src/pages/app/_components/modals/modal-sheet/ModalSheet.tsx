import {
  animate,
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useId, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import { X } from "@phosphor-icons/react";

// Wrap React Aria modal components so they support framer-motion values.
const MotionModal = motion(Modal);
const MotionModalOverlay = motion(ModalOverlay);

const inertiaTransition = {
  type: "inertia" as const,
  bounceStiffness: 300,
  bounceDamping: 40,
  timeConstant: 300,
};

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const SHEET_MARGIN = 34;

const ModalSheet = ({ title, description }) => {
  let [isOpen, setOpen] = useState(false);
  let h = window.innerHeight - SHEET_MARGIN;
  let y = useMotionValue(h);
  let bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  let bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  const id = useId();

  return (
    <>
      <Button onPress={() => setOpen(true)}>Open sheet</Button>
      <AnimatePresence>
        {isOpen && (
          <MotionModalOverlay
            // Force the modal to be open when AnimatePresence renders it.
            isOpen
            onOpenChange={setOpen}
            css={css`
              position: fixed;
              inset: 0;
              z-index: var(--z-index-overlay);
            `}
            style={{ backgroundColor: bg as any }}
          >
            <MotionModal
              css={css`
                position: absolute;
                bottom: 0;
                width: 100%;
                border-radius: var(--border-radius-medium);
                box-shadow: var(--box-shadow-modal);
                will-change: transform;
              `}
              initial={{ y: h }}
              animate={{ y: 0 }}
              exit={{ y: h }}
              transition={staticTransition}
              style={{
                y,
                top: SHEET_MARGIN,
                // Extra padding at the bottom to account for rubber band scrolling.
                paddingBottom: window.screen.height,
              }}
              drag="y"
              dragConstraints={{ top: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
                  setOpen(false);
                } else {
                  animate(y, 0, { ...inertiaTransition, min: 0, max: 0 });
                }
              }}
            >
              {/* drag affordance */}
              <div
                css={css`
                  margin-inline: auto;
                  width: var(--size-400);
                  height: var(--size-100);
                  background-color: var(--clr-surface-lowered);
                `}
              />
              <Dialog
                css={css`
                  padding: var(--size-300) var(--size-300);
                `}
                aria-labelledby={id}
              >
                <div
                  css={css`
                    display: flex;
                    justify-content: flex-end;
                  `}
                >
                  <Button
                    onPress={() => setOpen(false)}
                    iconOnly
                    variant="transparent"
                    icon={X}
                  ></Button>
                </div>
                <p className="heading-x-large" id={id}>
                  {title}
                </p>
                {children}
              </Dialog>
            </MotionModal>
          </MotionModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalSheet;
