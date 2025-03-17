import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { useEffect, useId, useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import QrReader from "../../qr-code/QRReader";
import Button from "@/components/ui/button/Button";
import {
  CaretLeft as CaretLeftIcon,
  Copy as CopyIcon,
  QuestionMark as QuestionMarkIcon,
  X as XIcon,
} from "@phosphor-icons/react";
import QRCode from "../../qr-code/QRCode";
import { useDispatch, useSelector } from "react-redux";
import { setQRCodeModalOpen } from "@/redux/modalReducers";

// Wrap React Aria modal components so they support motion values.
const MotionModal = motion(Modal);
const MotionModalOverlay = motion(ModalOverlay);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const QRCodeModal = ({ isOpen = false, onOpenChange }) => {
  let h = window.innerHeight;
  let y = useMotionValue(h);
  let bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  let bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  const [isQRCodeVisible, setQRCodeVisible] = useState(false);

  const pubKey = useSelector((state: any) => state.userWalletData.pubKey);

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
              onAnimationComplete={() => {
                setQRCodeVisible(false);
              }}
            >
              <Dialog
                css={css`
                  display: grid;
                  grid-template-rows: 4rem 1fr;
                  height: 100dvh;
                  overflow-y: auto;
                  position: relative;
                `}
                aria-labelledby={id}
              >
                {!isQRCodeVisible && (
                  <section
                    css={css`
                      position: absolute;
                      z-index: -1;
                      width: 100%;
                      height: 100%;
                    `}
                  >
                    <QrReader />
                  </section>
                )}
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
                        onPress={() => onOpenChange(false)}
                      ></Button>
                    </>
                  ) : (
                    <Button
                      iconOnly
                      icon={XIcon}
                      color="transparent-invert"
                      size="large"
                      onPress={() => onOpenChange(false)}
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
                  {isQRCodeVisible && (
                    <section className="qr-container">
                      <QRCode visible={isQRCodeVisible} data={pubKey} />
                    </section>
                  )}
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
                        max-width: 35ch;
                        margin-inline: auto;
                        word-break: break-all;
                        white-space: normal;
                      `}
                    >
                      {isQRCodeVisible
                        ? pubKey
                        : "Only send money to a wallet you trust"}
                    </p>

                    {isQRCodeVisible ? (
                      <Button
                        expand
                        size="large"
                        color="invert"
                        icon={CopyIcon}
                        onPress={() => {
                          navigator.clipboard.writeText(pubKey);
                          onOpenChange(false);
                          // dispatch toaster to confirm copy
                        }}
                      >
                        Copy Wallet Address
                      </Button>
                    ) : (
                      <Button
                        expand
                        size="large"
                        color="invert"
                        onPress={() => {
                          setQRCodeVisible(true);
                        }}
                      >
                        View QR Code
                      </Button>
                    )}
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

export default QRCodeModal;
