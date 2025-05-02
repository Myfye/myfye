import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { useEffect, useId, useState } from "react";

import { css } from "@emotion/react";

import QrReader from "./QRReader";
import Button from "@/shared/components/ui/button/Button";
import { X } from "@phosphor-icons/react";
import Header from "../../shared/components/layout/nav/header/Header";

// Wrap React Aria modal components so they support motion values.
const MotionModal = motion(Modal);
const MotionModalOverlay = motion(ModalOverlay);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const QRScanner = ({
  isOpen = false,
  onOpenChange,
  onScanSuccess,
  onScanFail,
  zIndex = 1000,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onScanSuccess: (e: unknown) => void;
  onScanFail: (err: unknown) => void;
  zIndex: number;
}) => {
  let h = window.innerHeight;
  let y = useMotionValue(h);
  let bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  let bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

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
            `}
            style={{ backgroundColor: bg as any }}
          >
            <MotionModal
              css={css`
                background-color: var(--clr-black);
                position: absolute;
                bottom: 0;
                width: 100%;
                box-shadow: var(--box-shadow-modal);
                will-change: transform;
                height: 100dvh;
                z-index: 1;
              `}
              initial={{ y: h }}
              animate={{ y: 0 }}
              exit={{ y: h }}
              transition={staticTransition}
              style={{
                y,
                top: 0,
                // Extra padding at the bottom to account for rubber band scrolling.
                paddingBottom: window.screen.height,
              }}
            >
              <Dialog
                css={css`
                  display: grid;
                  grid-template-rows: auto 1fr;
                  height: 100dvh;
                  overflow-y: auto;
                  position: relative;
                `}
                aria-labelledby={id}
              >
                <section
                  css={css`
                    position: absolute;
                    z-index: -1;
                    width: 100%;
                    height: 100%;
                  `}
                >
                  <QrReader
                    onScanFail={onScanFail}
                    onScanSuccess={onScanSuccess}
                  />
                </section>
                <Header>
                  <Button
                    iconOnly
                    icon={X}
                    color="transparent-invert"
                    onPress={() => onOpenChange(false)}
                  ></Button>
                </Header>
                <div
                  className="content"
                  css={css`
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 var(--size-250);
                    padding-bottom: var(--size-250);
                  `}
                >
                  <section
                    css={css`
                      margin-block-end: var(--size-400);
                    `}
                  >
                    <hgroup>
                      <p
                        slot="title"
                        className="heading-x-large"
                        id={id}
                        css={css`
                          color: var(--clr-text-on-accent);
                          text-align: center;
                        `}
                      >
                        Scan QR Code
                      </p>
                      <p
                        className="caption"
                        css={css`
                          color: var(--clr-text-on-accent);
                          text-align: center;
                          margin-block-start: var(--size-150);
                        `}
                      >
                        Scan a QR Code to copy a user's wallet
                      </p>
                    </hgroup>
                  </section>
                </div>
              </Dialog>
            </MotionModal>
          </MotionModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default QRScanner;
