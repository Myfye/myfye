import {
  animate,
  AnimatePresence,
  motion,
  MotionValue,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";

import { css } from "@emotion/react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { VisuallyHidden } from "react-aria";
import { ModalProps } from "./Modal";

// Wrap React Aria modal components so they support framer-motion values.
const MotionDialogBackdrop = motion(DialogBackdrop);
const MotionDialog = motion(Dialog);
const MotionDialogPanel = motion(DialogPanel);

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

const checkMotionValue = (val: any): val is MotionValue<number> =>
  val instanceof MotionValue;

const HeadlessModal = ({
  isOpen,
  onOpenChange,
  height = 400,
  title = "",
  zIndex = 1000,
  onExit,
  color = "var(--clr-surface)",
  ref,
  children,
  ...restProps
}: ModalProps & { color?: string }) => {
  const isMotionValue = checkMotionValue(height);
  const top = isMotionValue
    ? useTransform(height, (x) =>
        window.innerHeight - x > 0 ? window.innerHeight - x : 0
      )
    : window.innerHeight - height > 0
    ? window.innerHeight - height
    : 0;
  const h = isMotionValue
    ? useTransform(height, (x) => Math.min(window.innerHeight, x))
    : Math.min(window.innerHeight, height);
  const y = useMotionValue(checkMotionValue(h) ? h.get() : h);
  const bgOpacity = useTransform(
    y,
    [0, checkMotionValue(h) ? h.get() : h],
    [0.4, 0]
  );
  const bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  const [initialY, setInitialY] = useState(checkMotionValue(h) ? h.get() : h);

  useEffect(() => {
    const unsubH = () => {
      if (!checkMotionValue(h) || !checkMotionValue(height)) return;
      h.on("change", (x) => {
        if (x !== height.get()) return;
        setInitialY(x);
      });
    };
    return () => {
      unsubH();
    };
  }, [h, setInitialY, height]);

  return (
    <>
      <AnimatePresence onExitComplete={onExit}>
        {isOpen && (
          <MotionDialog
            open
            onClose={() => onOpenChange(false)}
            css={css`
              isolation: isolate;
              position: fixed;
              inset: 0;
              z-index: ${zIndex};
            `}
          >
            <MotionDialogBackdrop
              style={{ backgroundColor: bg }}
              css={css`
                position: absolute;
                width: 100%;
                height: 100%;
              `}
            />
            <MotionDialogPanel
              {...restProps}
              css={css`
                display: grid;
                font-family: var(--font-family);
                grid-template-rows: auto 1fr;
                position: absolute;
                inset: 0;
                top: auto;
                margin-inline: auto;
                max-width: var(--app-max-width);
                width: 100%;
                border-radius: var(--border-radius-medium);
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                box-shadow: var(--box-shadow-modal);
                will-change: transform;
                background-color: ${color};
                z-index: 1;
              `}
              initial={{ y: initialY }}
              animate={{ y: 0 }}
              exit={{ y: initialY }}
              transition={staticTransition}
              style={{
                y: y,
                top: top,
                // Extra padding at the bottom to account for rubber band scrolling.
                paddingBottom: window.screen.height,
              }}
              drag="y"
              dragConstraints={{ top: 0 }}
              onDragStart={(e) => {
                e.stopImmediatePropagation();
              }}
              onDrag={(e) => {
                e.stopImmediatePropagation();
              }}
              onDragEnd={(e, { offset, velocity }) => {
                e.stopImmediatePropagation();
                if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
                  onOpenChange(false);
                } else {
                  animate(y, 0, { ...inertiaTransition, min: 0, max: 0 });
                }
              }}
            >
              <motion.div
                style={{
                  height: h,
                }}
                css={css`
                  display: grid;
                  grid-template-rows: auto 1fr;
                  gap: var(--size-200);
                `}
              >
                <div
                  data-drag-affordance
                  css={css`
                    margin-inline: auto;
                    width: var(--size-800);
                    height: var(--size-050);
                    background-color: var(--clr-neutral-300);
                    margin-block-start: var(--size-100);
                    border-radius: var(--border-radius-pill);
                  `}
                />
                <div
                  css={css`
                    display: grid;
                    grid-template-rows: auto 1fr;
                    gap: var(--size-300);
                  `}
                >
                  <VisuallyHidden>
                    <header>
                      <h1>{title}</h1>
                    </header>
                  </VisuallyHidden>
                  <main
                    css={css`
                      container: modal-content / size;
                    `}
                  >
                    {children}
                  </main>
                </div>
              </motion.div>
            </MotionDialogPanel>
          </MotionDialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeadlessModal;
