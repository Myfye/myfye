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
import { useEffect, useId, useRef, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import { X } from "@phosphor-icons/react";
import NumberPad from "@/components/ui/number-pad/NumberPad";

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

const SHEET_HEIGHT = 900;

const SendModal = ({ isOpen, onOpenChange }) => {
  let h = Math.min(window.innerHeight, SHEET_HEIGHT);
  let y = useMotionValue(h);
  let bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  let bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  const id = useId();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <MotionModalOverlay
            // Force the modal to be open when AnimatePresence renders it.
            isOpen
            onOpenChange={onOpenChange}
            css={css`
              position: fixed;
              inset: 0;
              z-index: 9999;
            `}
            style={{ backgroundColor: bg as any }}
          >
            <MotionModal
              css={css`
                position: absolute;
                inset: 0;
                top: auto;
                margin-inline: auto;
                max-width: var(--app-max-width);
                width: 100%;
                border-radius: var(--border-radius-medium);
                box-shadow: var(--box-shadow-modal);
                will-change: transform;
                background-color: var(--clr-surface);
                z-index: var(--z-index-modal);
              `}
              initial={{ y: h }}
              animate={{ y: 0 }}
              exit={{ y: h }}
              transition={staticTransition}
              style={{
                y,
                top: window.innerHeight - SHEET_HEIGHT,
                // Extra padding at the bottom to account for rubber band scrolling.
                paddingBottom: window.screen.height,
              }}
              drag="y"
              dragConstraints={{ top: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
                  onOpenChange(false);
                } else {
                  animate(y, 0, { ...inertiaTransition, min: 0, max: 0 });
                }
              }}
            >
              {/* drag affordance */}
              <div
                css={css`
                  margin-inline: auto;
                  width: var(--size-1000);
                  height: var(--size-075);
                  background-color: var(--clr-neutral-300);
                  margin-block-start: var(--size-200);
                  border-radius: var(--border-radius-pill);
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
                    position: relative;
                  `}
                >
                  <p
                    className="heading-large"
                    css={css`
                      text-align: center;
                    `}
                    id={id}
                  >
                    Send
                  </p>
                  <Button
                    onPress={() => onOpenChange(false)}
                    iconOnly
                    variant="transparent"
                    icon={X}
                    css={css`
                      position: absolute;
                      inset: 0;
                      left: auto;
                      margin: auto;
                    `}
                  ></Button>
                </div>
                <div>
                  <NumberPad />
                </div>
              </Dialog>
            </MotionModal>
          </MotionModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default SendModal;
