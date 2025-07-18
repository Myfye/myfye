import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  useMotionValue,
} from "motion/react";
import { ReactNode } from "react";

import { css } from "@emotion/react";

import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react";

import Button from "@/shared/components/ui/button/Button";
import Header from "@/shared/components/layout/nav/header/Header";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

const MotionDialog = motion(Dialog);
const MotionDialogPanel = motion(DialogPanel);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

interface OverlayProps extends HTMLMotionProps<"div"> {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  zIndex?: number;
  children?: ReactNode;
}
const Overlay = ({
  isOpen,
  onOpenChange,
  title,
  zIndex = 1000,
  children,
  ...restProps
}: OverlayProps) => {
  const w = window.innerWidth;
  const x = useMotionValue(w);

  return (
    <>
      <AnimatePresence>
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
                background-color: var(--clr-surface);
                position: absolute;
                bottom: 0;
                width: 100%;
                will-change: transform;
                height: 100lvh;
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
              {...restProps}
            >
              <div
                css={css`
                  display: grid;
                  grid-template-rows: auto 1fr;
                  height: 100lvh;
                  max-width: var(--app-max-width);
                  width: 100vw;
                `}
              >
                <Header>
                  <Button
                    iconOnly
                    icon={CaretLeftIcon}
                    onPress={() => onOpenChange(false)}
                    variant="transparent"
                  />
                  {title && (
                    <DialogTitle
                      as="h1"
                      css={css`
                        font-weight: var(--fw-active);
                        font-size: var(--fs-medium);
                        line-height: var(--line-height-heading);
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                      `}
                    >
                      {title}
                    </DialogTitle>
                  )}
                </Header>
                <main
                  className="overlay-scroll"
                  css={css`
                    overflow-y: auto;
                    container: overlay-main / size;
                  `}
                >
                  {children}
                </main>
              </div>
            </MotionDialogPanel>
          </MotionDialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default Overlay;
