import Button from "@/shared/components/ui/button/Button";
import { css } from "@emotion/react";
import {
  ArrowRight,
  DotsThreeVertical,
  Export,
  Scan,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useId } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import MyfyeQRCode from "./MyfyeQRCode";

// Wrap React Aria modal components so they support framer-motion values.
const MotionDialog = motion(Dialog);
const MotionDialogBackdrop = motion(DialogBackdrop);
const MotionDialogPanel = motion(DialogPanel);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const QRCodeModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) => {
  const headingId = useId();
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <MotionDialog
            css={css`
              position: fixed;
              inset: 0;
              margin: auto;
              isolation: isolate;
              width: 100%;
              height: 100svh;
              z-index: var(--z-index-modal);
            `}
            open
            onClose={() => onOpenChange(false)}
          >
            <MotionDialogBackdrop
              initial={{ backgroundColor: "rgb(0 0 0 / 0)" }}
              animate={{ backgroundColor: "rgb(0 0 0 / .4)" }}
              exit={{ backgroundColor: "rgb(0 0 0 / 0)" }}
              transition={staticTransition}
              css={css`
                width: 100%;
                height: 100%;
              `}
            >
              <MotionDialogPanel
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={staticTransition}
                css={css`
                  isolation: isolate;
                  position: absolute;
                  inset: 0;
                  margin: auto;
                  padding: var(--size-300);
                  border-radius: var(--border-radius-large);
                  width: min(25rem, 100% - 2 * var(--size-250));
                  height: fit-content;
                  background-color: var(--clr-white);
                `}
              >
                <div
                  css={css`
                    padding: 0.125rem;
                    background-color: var(--clr-white);
                    border: 1px solid var(--clr-border-neutral);
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translate(-50%, -40%);
                    border-radius: var(--border-radius-circle);
                  `}
                >
                  <div
                    aria-hidden="true"
                    css={css`
                      display: grid;
                      place-items: center;
                      width: 3rem;
                      aspect-ratio: 1;
                      background-color: var(--clr-green-100);
                      border-radius: var(--border-radius-circle);
                      border: 1px solid var(--clr-border-neutral);
                    `}
                  >
                    <Scan size={32} color="var(--clr-primary)" />
                  </div>
                </div>
                <DialogTitle
                  as="h2"
                  className="heading-x-large"
                  css={css`
                    text-align: center;
                    color: var(--clr-text);
                    margin-block-start: var(--size-400);
                  `}
                >
                  Scan QR code
                </DialogTitle>
                <p
                  id={headingId}
                  className="caption"
                  css={css`
                    text-align: center;
                    color: var(--clr-text-weaker);
                    margin-block-start: var(--size-100);
                  `}
                >
                  Scan this code to access MyFye on your mobile device.
                </p>
                <div
                  css={css`
                    margin-block-start: var(--size-150);
                    margin-block-end: var(--size-200);
                  `}
                >
                  <div
                    css={css`
                      width: 12rem;
                      aspect-ratio: 1;
                      margin-inline: auto;
                    `}
                  >
                    <MyfyeQRCode title="Myfye QR Code" />
                  </div>
                </div>
                <section
                  css={css`
                    width: fit-content;
                    margin-inline: auto;
                  `}
                >
                  <p
                    className="heading-small"
                    css={css`
                      text-align: center;
                      margin-block-end: var(--size-200);
                    `}
                  >
                    Add to home screen
                  </p>
                  <section>
                    <p
                      className="heading-x-small"
                      css={css`
                        margin-block-end: var(--size-050);
                      `}
                    >
                      iPhone
                    </p>
                    <ol
                      css={css`
                        display: flex;
                        flex-direction: column;
                        gap: var(--size-025);
                        list-style-type: decimal;
                        list-style-position: inside;
                        font-size: var(--fs-small);
                        color: var(--clr-text);
                        line-height: var(--line-height-body);
                      `}
                    >
                      <li>Scan the QR Code</li>
                      <li>
                        <span
                          css={css`
                            display: inline-flex;
                            align-items: center;
                            gap: var(--size-050);
                          `}
                        >
                          In Safari, press the share button
                          <Export size={18} />
                        </span>
                      </li>
                      <li>Select "Add to home screen"</li>
                    </ol>
                  </section>
                  <section
                    css={css`
                      margin-block-start: var(--size-200);
                    `}
                  >
                    <p
                      className="heading-x-small"
                      css={css`
                        margin-block-end: var(--size-050);
                      `}
                    >
                      Android
                    </p>
                    <ol
                      css={css`
                        display: flex;
                        flex-direction: column;
                        gap: var(--size-025);
                        list-style-type: decimal;
                        list-style-position: inside;
                        font-size: var(--fs-small);
                        color: var(--clr-text);
                        line-height: var(--line-height-body);
                      `}
                    >
                      <li>Scan the QR Code</li>
                      <li>
                        <span
                          css={css`
                            display: inline-flex;
                            align-items: center;
                            gap: var(--size-050);
                          `}
                        >
                          In Chrome, press the settings button
                          <DotsThreeVertical size={18} />
                        </span>
                      </li>
                      <li>Select "Add to home screen"</li>
                    </ol>
                  </section>
                </section>
                <div
                  css={css`
                    margin-block-start: var(--size-600);
                  `}
                >
                  <Button
                    expand
                    onPress={() => void onOpenChange(false)}
                    iconRight={ArrowRight}
                  >
                    Ok, got it
                  </Button>
                </div>
              </MotionDialogPanel>
            </MotionDialogBackdrop>
          </MotionDialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default QRCodeModal;
