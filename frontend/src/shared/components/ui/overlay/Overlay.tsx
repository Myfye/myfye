import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  useMotionValue,
} from "motion/react";
import { ReactNode, RefObject, useId, useRef } from "react";

import { css } from "@emotion/react";

import { CaretLeft as CaretLeftIcon, XIcon } from "@phosphor-icons/react";

import Button from "@/shared/components/ui/button/Button";
import Header from "@/shared/components/layout/nav/header/Header";

import { createPortal } from "react-dom";
import { useOverlay } from "./useOverlay";
import Portal from "../portal/Portal";
import { cn } from "cn-utility";

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

export interface OverlayProps extends HTMLMotionProps<"div"> {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  title?: string;
  zIndex?: number;
  children?: ReactNode;
  initialFocus?: RefObject<HTMLElement>;
  color?: string;
  onExit?: () => void;
  isBackDisabled?: boolean;
  hideTitle?: boolean;
  direction?: "vertical" | "horizontal";
}

export type LocalOverlayProps = Omit<OverlayProps, "isOpen" | "onOpenChange">;

const Overlay = ({
  isOpen,
  onOpenChange,
  title,
  zIndex = 1000,
  children,
  initialFocus,
  color = "var(--clr-surface)",
  onExit,
  hideTitle,
  isBackDisabled = false,
  direction = "horizontal",
  ...restProps
}: OverlayProps) => {
  const dim =
    direction === "horizontal" ? window.innerWidth : window.innerHeight;
  const transformAmount = useMotionValue(dim);

  const titleId = useId();

  const overlayRef = useRef<HTMLDivElement | null>(null);

  useOverlay({ isOpen, onOpenChange, ref: overlayRef, initialFocus });

  return (
    <>
      <Portal containerId="screens">
        <AnimatePresence onExitComplete={onExit}>
          {isOpen && (
            <motion.div
              {...restProps}
              ref={overlayRef}
              tabIndex={0}
              aria-labelledby={title ? undefined : restProps["aria-labelledby"]}
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
                  background-color: ${color};
                `}
                initial={{
                  x: direction === "horizontal" ? dim : undefined,
                  y: direction === "vertical" ? dim : undefined,
                }}
                animate={{
                  x: direction === "horizontal" ? 0 : undefined,
                  y: direction === "vertical" ? 0 : undefined,
                }}
                exit={{
                  x: direction === "horizontal" ? dim : undefined,
                  y: direction === "vertical" ? dim : undefined,
                }}
                transition={staticTransition}
                style={{
                  x: direction === "horizontal" ? transformAmount : undefined,
                  y: direction === "vertical" ? transformAmount : undefined,
                  left: direction === "horizontal" ? 0 : undefined,
                  top: direction === "vertical" ? 0 : undefined,
                  paddingRight:
                    direction === "horizontal"
                      ? window.screen.width
                      : undefined,
                  paddingBottom:
                    direction === "vertical" ? window.screen.height : undefined,
                }}
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
                  <Header color={color}>
                    {direction === "horizontal" && (
                      <Button
                        iconOnly
                        icon={CaretLeftIcon}
                        onPress={() => onOpenChange && onOpenChange(false)}
                        color="transparent"
                        isDisabled={isBackDisabled}
                      />
                    )}
                    {title && (
                      <h1
                        className={cn(hideTitle && "visually-hidden")}
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
                    {direction === "vertical" && (
                      <Button
                        iconOnly
                        icon={XIcon}
                        onPress={() => onOpenChange && onOpenChange(false)}
                        color="transparent"
                        isDisabled={isBackDisabled}
                      />
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
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

export default Overlay;
