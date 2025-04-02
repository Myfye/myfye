import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { ReactNode, useId } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react";

import Button from "@/components/ui/button/Button";
import Header from "@/components/app/layout/header/Header";

// Wrap React Aria modal components so they support motion values.
const MotionModal = motion(Modal);
const MotionModalOverlay = motion(ModalOverlay);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const Overlay = ({
  isOpen,
  onOpenChange,
  title,
  zIndex = 1000,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (e: boolean) => void;
  title?: string;
  zIndex?: number;
  children?: ReactNode;
}) => {
  let w = window.innerWidth;
  let x = useMotionValue(w);

  const id = useId();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <MotionModalOverlay
            isOpen
            onOpenChange={onOpenChange}
            css={css`
              position: fixed;
              inset: 0;
              z-index: ${zIndex};
              max-width: 420px;
              margin-inline: auto;
              isolation: isolate;
            `}
          >
            <MotionModal
              css={css`
                background-color: var(--clr-surface);
                position: absolute;
                bottom: 0;
                width: 100%;
                will-change: transform;
                height: 100svh;
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
              <Dialog
                css={css`
                  display: grid;
                  grid-template-rows: auto 1fr;
                  height: 100svh;
                  max-width: var(--app-max-width);
                  width: 100vw;
                `}
                aria-labelledby={id}
              >
                <Header>
                  <Button
                    iconOnly
                    icon={CaretLeftIcon}
                    onPress={() => onOpenChange(false)}
                    variant="transparent"
                  ></Button>
                  {title && (
                    <h1
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
                    </h1>
                  )}
                </Header>
                <main css={css``}>{children}</main>
              </Dialog>
            </MotionModal>
          </MotionModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Overlay;
