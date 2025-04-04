/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import HeadlessOverlay from "@/components/ui/overlay/HeadlessOverlay";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { toggleOverlay, unmount } from "./swapSlice";
import { RootState } from "@/redux/store";
import { useEffect, useMemo, useRef, useState } from "react";

const ProcessingTransactionOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.swap.overlays.processingTransaction.isOpen
  );
  const handleOpen = (e: boolean) => {
    toggleOverlay({ type: "processingTransaction", isOpen: e });
  };

  const transaction = useSelector((state: RootState) => state.swap.transaction);
  const caption = useMemo(() => {
    switch (transaction.status) {
      case "success": {
        return (
          <span
            css={css`
              display: inline-block;
              padding-block-end: calc(1em * var(--line-height-caption));
            `}
          >
            Coins have been deposited into your wallet.
          </span>
        );
      }
      case "fail": {
        return (
          <span
            css={css`
              display: inline-block;
              padding-block-end: calc(1em * var(--line-height-caption));
            `}
          >
            Error processing swap. Please try again.
          </span>
        );
      }
      default: {
        return `${transaction.buy.coinId} will be deposited into your wallet once the transaction is complete.`;
      }
    }
  }, [transaction]);

  const heading = useMemo(() => {
    switch (transaction.status) {
      case "success": {
        return "Swap complete!";
      }
      case "fail": {
        return "Swap error";
      }
      default: {
        return "Swapping...";
      }
    }
  }, [transaction]);

  const lottie = useMemo(() => {
    switch (transaction.status) {
      case "success": {
        return (
          <DotLottieReact
            src="src/assets/lottie/success.lottie"
            autoplay
            width="100%"
            height="100%"
          />
        );
      }
      case "fail": {
        return (
          <DotLottieReact
            src="src/assets/lottie/error.lottie"
            autoplay
            width="100%"
            height="100%"
          />
        );
      }
      default: {
        return (
          <DotLottieReact
            src="src/assets/lottie/leaf-loader.lottie"
            autoplay
            loop={true}
            width="100%"
            height="100%"
          />
        );
      }
    }
  }, [transaction]);

  return (
    <HeadlessOverlay isOpen={isOpen} onOpenChange={handleOpen} zIndex={zIndex}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--size-250);
          height: 100svh;
        `}
      >
        <section
          css={css`
            margin-block-start: auto;
          `}
        >
          <div
            css={css`
              width: 12rem;
              aspect-ratio: 1;
              margin-inline: auto;
            `}
          >
            {lottie}
          </div>
          <section
            css={css`
              margin-block-start: var(--size-200);
            `}
          >
            <hgroup>
              <h1
                className="heading-x-large"
                css={css`
                  color: var(--clr-text);
                  text-align: center;
                  margin-block-end: var(--size-200);
                `}
              >
                {heading}
              </h1>
              <p
                className="caption"
                css={css`
                  margin-block-start: var(--size-200);
                  color: var(--clr-text-weaker);
                  text-align: center;
                `}
              >
                {caption}
              </p>
            </hgroup>
          </section>
        </section>
        <section
          css={css`
            margin-block-start: auto;
            width: 100%;
          `}
        >
          <menu
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--controls-gap-medium);
            `}
          >
            <li>
              <Button
                isDisabled={
                  transaction.status === "signed" ||
                  transaction.status === "idle"
                }
                expand
                onPress={() => {
                  dispatch(unmount());
                }}
              >
                Done
              </Button>
            </li>
            <li>
              <Button expand color="neutral">
                View transaction
              </Button>
            </li>
          </menu>
        </section>
      </div>
    </HeadlessOverlay>
  );
};

export default ProcessingTransactionOverlay;
