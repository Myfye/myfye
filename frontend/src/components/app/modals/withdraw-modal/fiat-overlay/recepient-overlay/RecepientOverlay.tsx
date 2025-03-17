import { AnimatePresence, motion, useMotionValue } from "motion/react";
import {
  Dialog,
  Input,
  Label,
  Modal,
  ModalOverlay,
  SearchField,
  Button as AriaButton,
} from "react-aria-components";
import { useId } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react";

import ContactList from "../../../../../ui/contact-card/ContactCardList";
import Button from "@/components/ui/button/Button";

// Wrap React Aria modal components so they support motion values.
const MotionModal = motion(Modal);
const MotionModalOverlay = motion(ModalOverlay);

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const RecepientOverlay = ({ isOpen, onOpenChange, onOpen, onClose, coin }) => {
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
              z-index: 3000;
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
                  height: 100dvh;
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
                      onPress={onClose}
                      variant="transparent"
                      css={css`
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        margin-block: auto;
                        left: var(--size-100);
                      `}
                    ></Button>
                    <h1 className="heading-medium">Choose recepient</h1>
                  </div>
                </header>
                <div
                  className="content"
                  css={css`
                    margin-block-start: var(--size-500);
                    padding: 0 var(--size-250);
                    padding-bottom: var(--size-250);
                  `}
                >
                  <SearchField>
                    <Label className="visually-hidden">Search</Label>
                    <div
                      className="wrapper"
                      css={css`
                        display: grid;
                        grid-template-columns: 1fr auto;
                      `}
                    >
                      <Input placeholder="Search" />
                      <AriaButton>✕</AriaButton>
                    </div>
                  </SearchField>
                  <ContactList
                    contacts={[
                      { name: "Eli", walletAddress: "Testing123" },
                      { name: "Gavin", walletAddress: "Testing123" },
                    ]}
                  />
                </div>
              </Dialog>
            </MotionModal>
          </MotionModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default RecepientOverlay;
