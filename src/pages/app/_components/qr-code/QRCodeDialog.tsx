import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useEffect, useId, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import QrReader from "./QRReader";
import Button from "@/components/ui/button/Button";
import {
  CaretLeft as CaretLeftIcon,
  QuestionMark as QuestionMarkIcon,
  Scan as ScanIcon,
  X as XIcon,
} from "@phosphor-icons/react";
import QRCode from "./QRCode";
import { useSelector } from "react-redux";

// Wrap React Aria modal components so they support motion values.
const MotionModal = motion(Modal);
const MotionModalOverlay = motion(ModalOverlay);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const QRCodeDialog = () => {
  let [isOpen, setOpen] = useState(false);
  let h = window.innerHeight;
  let y = useMotionValue(h);
  let bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  let bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  const [isQRCodeVisible, setQRCodeVisible] = useState(false);

  const pubKey = useSelector((state: any) => state.userWalletData.pubKey);

  const id = useId();

  return (
    <>
      <Button
        iconOnly
        icon={ScanIcon}
        onPress={() => setOpen(true)}
        color="transparent"
        data-size="large"
      ></Button>
      <AnimatePresence>
        {isOpen && (
          <MotionModalOverlay
            isOpen
            onOpenChange={setOpen}
            css={css`
              position: fixed;
              inset: 0;
              z-index: var(--z-index-modal);
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
                border-radius: var(--border-radius-medium);
                box-shadow: var(--box-shadow-modal);
                will-change: transform;
                height: 100dvh;
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
                  grid-template-rows: 4rem 1fr;
                  height: 100dvh;
                  overflow-y: auto;
                `}
                aria-labelledby={id}
              >
                <div
                  css={css`
                    display: flex;
                    justify-content: ${isQRCodeVisible
                      ? "space-between"
                      : "flex-end"};
                    align-items: center;
                    height: 4rem;
                    padding: 0 var(--size-100);
                  `}
                >
                  {isQRCodeVisible ? (
                    <>
                      <Button
                        iconOnly
                        icon={CaretLeftIcon}
                        color="transparent-invert"
                        size="large"
                        onPress={() => setQRCodeVisible(false)}
                      ></Button>
                      <Button
                        iconOnly
                        icon={QuestionMarkIcon}
                        color="transparent-invert"
                        size="large"
                        onPress={() => setOpen(false)}
                      ></Button>
                    </>
                  ) : (
                    <Button
                      iconOnly
                      icon={XIcon}
                      color="transparent-invert"
                      size="large"
                      onPress={() => setOpen(false)}
                    ></Button>
                  )}
                </div>
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
                  <hgroup>
                    <p
                      slot="title"
                      className="heading-x-large"
                      id={id}
                      css={css`
                        color: var(--clr-text-on-accent);
                        text-align: center;
                        margin-block-start: var(--size-200);
                      `}
                    >
                      {isQRCodeVisible ? "Receive tokens" : "Send tokens"}
                    </p>
                    <p
                      css={css`
                        color: var(--clr-text-on-accent);
                        text-align: center;
                        margin-block-start: var(--size-200);
                        margin-block-end: var(--size-500);
                      `}
                    >
                      {isQRCodeVisible
                        ? "Share this wallet address to receive tokens"
                        : "Scan a QR Code to send tokens to another wallet"}
                    </p>
                  </hgroup>
                  <section className="qr-container">
                    <QRCode visible={isQRCodeVisible} data={pubKey} />
                    {!isQRCodeVisible && <QrReader />}
                  </section>
                  <section
                    css={css`
                      margin-block-start: var(--size-400);
                      width: 100%;
                    `}
                  >
                    <p
                      css={css`
                        color: var(--clr-neutral-300);
                        text-align: center;
                        margin-block-end: var(--size-500);
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        max-width: 40ch;
                        margin-inline: auto;
                      `}
                    >
                      {isQRCodeVisible
                        ? pubKey
                        : "Only send money to a wallet you trust"}
                    </p>

                    <Button
                      expand
                      size="large"
                      color="invert"
                      onPress={() => {
                        if (isQRCodeVisible)
                          return navigator.clipboard.writeText(pubKey);
                        if (!isQRCodeVisible) setQRCodeVisible(true);
                      }}
                    >
                      {isQRCodeVisible ? "Copy wallet address" : "View QR Code"}
                    </Button>
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

export default QRCodeDialog;
