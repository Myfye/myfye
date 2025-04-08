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

import QrReader from "./QRReader";
import Button from "@/components/ui/button/Button";
import {
  CaretLeft as CaretLeftIcon,
  Copy as CopyIcon,
  QuestionMark as QuestionMarkIcon,
  X as XIcon,
} from "@phosphor-icons/react";
import QRCode from "./QRCode";
import { useDispatch, useSelector } from "react-redux";
import { setQRCodeModalOpen, setSendModalOpen } from "@/redux/modalReducers";
import Header from "../../components/app/layout/header/Header";
import { RootState } from "@/redux/store";

// Wrap React Aria modal components so they support motion values.
const MotionModal = motion(Modal);
const MotionModalOverlay = motion(ModalOverlay);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const QRCodeModal = ({
  isOpen = false,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) => {
  let h = window.innerHeight;
  let y = useMotionValue(h);
  let bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  let bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;
  const dispatch = useDispatch();

  const [isQRCodeVisible, setQRCodeVisible] = useState(false);

  const pubKey = useSelector(
    (state: RootState) => state.userWalletData.solanaPubKey
  );

  const wallet = useSelector((state: RootState) => state.userWalletData);

  useEffect(() => {
    console.log(wallet);
  }, [wallet]);

  const id = useId();

  const onScanSuccess = ({ data }) => {
    dispatch(setQRCodeModalOpen(false));
    dispatch(setSendModalOpen(true));
  };

  const onScanFail = (err) => {
    console.log(err);
  };

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
                height: 100svh;
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
                  grid-template-rows: auto 1fr;
                  height: 100svh;
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
                    <QrReader
                      onScanFail={onScanFail}
                      onScanSuccess={onScanSuccess}
                    />
                  </section>
                )}
                <Header>
                  {isQRCodeVisible ? (
                    <>
                      <Button
                        iconOnly
                        icon={CaretLeftIcon}
                        color="transparent-invert"
                        onPress={() => setQRCodeVisible(false)}
                      ></Button>
                      <Button
                        iconOnly
                        icon={QuestionMarkIcon}
                        color="transparent-invert"
                        onPress={() => onOpenChange(false)}
                      ></Button>
                    </>
                  ) : (
                    <Button
                      iconOnly
                      icon={XIcon}
                      color="transparent-invert"
                      onPress={() => onOpenChange(false)}
                      css={css`
                        margin-left: auto;
                      `}
                    ></Button>
                  )}
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
                        {isQRCodeVisible ? "Receive tokens" : "Send tokens"}
                      </p>
                      <p
                        css={css`
                          color: var(--clr-text-on-accent);
                          text-align: center;
                          margin-block-start: var(--size-200);
                        `}
                      >
                        {isQRCodeVisible
                          ? "Share this wallet address to receive tokens"
                          : "Scan a QR Code to send tokens to another wallet"}
                      </p>
                    </hgroup>
                  </section>
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
                        margin-block-end: var(--size-400);
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
