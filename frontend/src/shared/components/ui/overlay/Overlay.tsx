import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  useMotionValue,
} from "motion/react";
import { ReactNode, useEffect, useId, useRef } from "react";

import { css } from "@emotion/react";

import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react";

import Button from "@/shared/components/ui/button/Button";
import Header from "@/shared/components/layout/nav/header/Header";

import { Dialog, DialogPanel } from "@headlessui/react";
import { createPortal } from "react-dom";

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

  const titleId = useId();

  const overlayRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {createPortal(
              <>
                <motion.div
                  ref={overlayRef}
                  tabIndex={0}
                  aria-labelledby={title && titleId}
                  aria-label={!title ? "Page" : title}
                  role="region"
                  css={css`
                    position: fixed;
                    inset: 0;
                    z-index: ${zIndex};
                    max-width: var(--app-max-width);
                    margin-inline: auto;
                    isolation: isolate;
                  `}
                >
                  <motion.div
                    css={css`
                      position: absolute;
                      inset: 0;
                      bottom: auto;
                      width: 100%;
                      will-change: transform;
                      height: ${window.innerHeight}px; // TODO test with 100svh
                      z-index: 1;
                      background-color: var(--clr-surface);
                    `}
                    initial={{ x: w }}
                    animate={{ x: 0 }}
                    exit={{ x: w }}
                    transition={staticTransition}
                    style={{
                      x,
                      left: 0,
                      paddingRight: window.screen.width,
                    }}
                    {...restProps}
                  >
                    <div
                      css={css`
                        display: grid;
                        grid-template-rows: auto 1fr;
                        height: ${window.innerHeight}px; // TODO test with 100svh
                        max-width: var(--app-max-width);
                        width: 100vw;
                        position: relative;
                      `}
                    >
                      <Header color="var(--clr-surface)">
                        <Button
                          iconOnly
                          icon={CaretLeftIcon}
                          onPress={() => onOpenChange(false)}
                          variant="transparent"
                        />
                        {title && (
                          <h1
                            id={titleId}
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
                      <main
                        className="overlay-scroll"
                        css={css`
                          container: overlay-main / size;
                          overflow-y: auto;
                        `}
                      >
                        {children}
                      </main>
                    </div>
                  </motion.div>
                </motion.div>
              </>,
              document.querySelector<HTMLDivElement>(
                "#screens"
              ) as HTMLDivElement
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Overlay;
