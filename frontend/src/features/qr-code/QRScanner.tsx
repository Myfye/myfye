import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useId, useState } from "react";

import { css } from "@emotion/react";

import QrReader from "./QRReader";
import Button from "@/shared/components/ui/button/Button";
import { X } from "@phosphor-icons/react";
import Header from "../../shared/components/layout/nav/header/Header";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const MotionDialog = motion(Dialog);
const MotionDialogBackdrop = motion(DialogBackdrop);
const MotionDialogPanel = motion(DialogPanel);

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
          <MotionDialog
            open
            onClose={() => onOpenChange(false)}
            css={css`
              position: fixed;
              inset: 0;
              z-index: ${zIndex};
              max-width: 420px;
              margin-inline: auto;
            `}
          >
            <MotionDialogBackdrop
              style={{ backgroundColor: bg as any }}
              css={css`
                width: 100%;
                height: 100%;
              `}
            />
            <MotionDialogPanel
              css={css`
                background-color: var(--clr-black);
                position: absolute;
                bottom: 0;
                width: 100%;
                box-shadow: var(--box-shadow-modal);
                will-change: transform;
                height: 100vh;
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
              <div
                css={css`
                  display: grid;
                  grid-template-rows: auto 1fr;
                  height: 100vh;
                  overflow-y: auto;
                  position: relative;
                `}
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
                      <DialogTitle
                        as="h1"
                        className="heading-x-large"
                        css={css`
                          color: var(--clr-text-on-primary);
                          text-align: center;
                        `}
                      >
                        Scan QR Code
                      </DialogTitle>
                      <p
                        className="caption"
                        css={css`
                          color: var(--clr-text-on-primary);
                          text-align: center;
                          margin-block-start: var(--size-150);
                        `}
                      >
                        Scan a QR Code to copy a user's wallet
                      </p>
                    </hgroup>
                  </section>
                </div>
              </div>
            </MotionDialogPanel>
          </MotionDialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default QRScanner;
