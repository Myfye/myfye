import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useState } from "react";

import { css } from "@emotion/react";

import QrReader from "../QRReader";
import Button from "@/shared/components/ui/button/Button";
import {
  CaretLeft as CaretLeftIcon,
  Copy as CopyIcon,
  QuestionMark as QuestionMarkIcon,
  X as XIcon,
} from "@phosphor-icons/react";
import QRCode from "../QRCode";
import { useDispatch, useSelector } from "react-redux";
import { setQRCodeModalOpen } from "@/redux/modalReducers";
import Header from "../../../shared/components/layout/nav/header/Header";
import { RootState } from "@/redux/store";
import {
  toggleModal as toggleSendModal,
  updateUser,
} from "@/features/send/sendSlice";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import QrScanner from "qr-scanner";

const MotionDialog = motion(Dialog);
const MotionDialogBackdrop = motion(DialogBackdrop);
const MotionDialogPanel = motion(DialogPanel);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const QRCodeModal = () => {
  const isOpen = useSelector((state: RootState) => state.QRCodeModal.isOpen);
  const onOpenChange = (isOpen: boolean) => {
    dispatch(setQRCodeModalOpen(isOpen));
  };
  let h = window.innerHeight;
  let y = useMotionValue(h);
  let bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  let bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;
  const dispatch = useDispatch();

  const [isQRCodeVisible, setQRCodeVisible] = useState(false);

  const pubKey = useSelector(
    (state: RootState) => state.userWalletData.solanaPubKey
  );

  const onScanSuccess = ({ data }: QrScanner.ScanResult) => {
    dispatch(setQRCodeModalOpen(false));
    dispatch(toggleSendModal({ isOpen: true }));
    // Fetch user
    dispatch(updateUser(null));
  };

  const onScanFail = (err: unknown) => {
    console.log(err);
  };

  return (
    <>
      <AnimatePresence
        onExitComplete={() => {
          setQRCodeVisible(false);
        }}
      >
        {isOpen && (
          <MotionDialog
            open
            onClose={() => onOpenChange(false)}
            css={css`
              position: fixed;
              inset: 0;
              margin: auto;
              z-index: var(--z-index-modal);
              margin-inline: auto;
              max-width: 420px;
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
            >
              <div
                css={css`
                  display: grid;
                  grid-template-rows: auto 1fr;
                  overflow-y: auto;
                  position: relative;
                  width: 100%;
                  height: 100svh;
                `}
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
                      <DialogTitle
                        as="h1"
                        className="heading-x-large"
                        css={css`
                          color: var(--clr-text-on-primary);
                          text-align: center;
                        `}
                      >
                        {isQRCodeVisible ? "Receive tokens" : "Send tokens"}
                      </DialogTitle>
                      <p
                        css={css`
                          color: var(--clr-text-on-primary);
                          text-align: center;
                          margin-block-start: var(--size-150);
                          font-size: var(--fs-medium);
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
                        margin-block-end: var(--size-300);
                        max-width: 35ch;
                        margin-inline: auto;
                        word-break: break-all;
                        white-space: normal;
                        font-size: var(--fs-medium);
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
              </div>
            </MotionDialogPanel>
          </MotionDialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default QRCodeModal;
