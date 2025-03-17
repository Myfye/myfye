import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { useId } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react";

import Button from "@/components/ui/button/Button";

// Wrap React Aria modal components so they support motion values.
const MotionModal = motion(Modal);
const MotionModalOverlay = motion(ModalOverlay);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const Overlay = ({ isOpen, onOpenChange, children }) => {
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
              z-index: var(--z-index-overlay);
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
              <Dialog
                css={css`
                  display: grid;
                  grid-template-rows: 4rem 1fr;
                  height: 100svh;
                  max-width: var(--app-max-width);
                  width: 100vw;
                `}
                aria-labelledby={id}
              >
                <header
                  css={css`
                    width: 100%;
                    align-content: center;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      padding-inline: var(--size-250);
                      position: relative;
                    `}
                  >
                    <Button
                      iconOnly
                      icon={CaretLeftIcon}
                      onPress={() => onOpenChange(false)}
                      variant="transparent"
                      css={css`
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        margin-block: auto;
                        left: var(--size-100);
                      `}
                    ></Button>
                    <h1 className="heading-medium">Select Coin</h1>
                  </div>
                </header>
                <main
                  css={css`
                    padding: 0 var(--size-250);
                  `}
                >
                  {children}
                </main>
              </Dialog>
            </MotionModal>
          </MotionModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Overlay;
