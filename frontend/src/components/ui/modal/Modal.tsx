import {
  animate,
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import {
  Dialog,
  Heading,
  Modal as AriaModal,
  ModalOverlay,
} from "react-aria-components";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "@/components/ui/button/Button";
import { Bank, Copy, Wallet, X } from "@phosphor-icons/react";
import ModalButton from "../../app/modals/buttons/ModalButton";
import QRCode from "../../app/qr-code/QRCode";
import { useSelector } from "react-redux";

// Wrap React Aria modal components so they support framer-motion values.
const MotionModal = motion(AriaModal);
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

const Modal = ({
  isOpen,
  onOpenChange,
  height = 400,
  title = "",
  zIndex = 1000,
  children,
  ...restProps
}) => {
  const top = window.innerHeight - height > 0 ? window.innerHeight - height : 0;
  const h = Math.min(window.innerHeight, height);
  const y = useMotionValue(h);
  const bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  const bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

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
              z-index: ${zIndex};
              isolation: isolate;
            `}
            style={{ backgroundColor: bg as any }}
          >
            <MotionModal
              css={css`
                display: grid;
                grid-template-rows: auto 1fr;
                position: absolute;
                inset: 0;
                top: auto;
                margin-inline: auto;
                max-width: var(--app-max-width);
                width: 100%;
                border-radius: var(--border-radius-medium);
                border-radius-bottom-left: 0;
                border-radius-bottom-right: 0;
                box-shadow: var(--box-shadow-modal);
                will-change: transform;
                background-color: var(--clr-surface);
                z-index: 1;
              `}
              initial={{ y: h }}
              animate={{ y: 0 }}
              exit={{ y: h }}
              transition={staticTransition}
              style={{
                y: y,
                top: top,
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
              {...restProps}
            >
              <div
                css={css`
                  display: grid;
                  grid-template-rows: auto 1fr;
                  height: ${height}px;
                  gap: var(--size-200);
                `}
              >
                <div
                  data-drag-affordance
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
                  aria-labelledby={id}
                  css={css`
                    display: grid;
                    grid-template-rows: auto 1fr;
                  `}
                >
                  <header
                    css={css`
                      position: relative;
                      padding-inline: var(--size-200);
                    `}
                  >
                    <p
                      className="heading-medium"
                      css={css`
                        text-align: center;
                      `}
                      id={id}
                    >
                      {title}
                    </p>
                    <Button
                      onPress={() => onOpenChange(false)}
                      iconOnly
                      variant="transparent"
                      icon={X}
                      css={css`
                        position: absolute;
                        inset: 0;
                        top: var(--size-200);
                        left: auto;
                        right: var(--size-100);
                        margin: auto;
                      `}
                    ></Button>
                  </header>
                  <main
                    css={css`
                      container: modal-content / size;
                    `}
                  >
                    {children}
                  </main>
                </Dialog>
              </div>
            </MotionModal>
          </MotionModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
