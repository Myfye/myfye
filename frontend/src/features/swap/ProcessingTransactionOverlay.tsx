import { css } from "@emotion/react";
import HeadlessOverlay from "@/shared/components/ui/overlay/HeadlessOverlay";
import Button from "@/shared/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { toggleOverlay, unmount } from "./swapSlice";
import { RootState } from "@/redux/store";
import { useEffect, useMemo, useState } from "react";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import success from "@/assets/lottie/success.json";
import fail from "@/assets/lottie/fail.json";
import { useLottie } from "lottie-react";
import { SwapTransactionStatus } from "./types";
import ProgressBar from "@/shared/components/ui/progress_bar/ProgressBar";

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
        // Check if the selling asset is SOL or WSOL
        const isSellingSolana = transaction.sell.abstractedAssetId === "sol" || 
                               transaction.sell.abstractedAssetId === "w_sol";
        
        return (
          <span
            css={css`
              display: inline-block;
              padding-block-end: calc(1em * var(--line-height-caption));
            `}
          >
            {isSellingSolana 
              ? "Error processing swap. Try selling less Solana to pay for the blockchain fee." 
              : "Error processing swap. Please try again."}
          </span>
        );
      }
      default: {
        return `${transaction.buy.abstractedAssetId} will be deposited into your wallet once the transaction is complete.`;
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

  const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((value) => (value += 5));
    }, 1000);
    if (value >= 100) return clearInterval(interval);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <HeadlessOverlay isOpen={isOpen} onOpenChange={handleOpen} zIndex={zIndex}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--size-250);
          height: 100dvh;
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
            <UIAnimation transactionStatus={transaction.status} />
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
                {transaction.status === "success" && (
                  <span
                    css={css`
                      display: inline-block;
                      padding-block-end: calc(1em * var(--line-height-caption));
                    `}
                  >
                    Coins have been deposited into your wallet.
                  </span>
                )}
                {transaction.status === "fail" && (
                  <span
                    css={css`
                      display: inline-block;
                      padding-block-end: calc(1em * var(--line-height-caption));
                    `}
                  >
                    Error processing swap. Please try again.
                  </span>
                )}
              </p>
            </hgroup>
            <div
              css={css`
                margin-block-start: var(--size-400);
                width: 80%;
                margin-inline: auto;
              `}
            >
              {(transaction.status === "signed" ||
                transaction.status === "idle") && <ProgressBar value={value} />}
            </div>
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
              <Button
                isDisabled={!transaction.id}
                href={`https://solscan.io/tx/${transaction.id}`}
                expand
                color="neutral"
              >
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

const UIAnimation = ({
  transactionStatus,
}: {
  transactionStatus: SwapTransactionStatus;
}) => {
  const options = useMemo(() => {
    switch (transactionStatus) {
      case "success": {
        return {
          loop: false,
          animationData: success,
          autoplay: true,
        };
      }
      case "fail": {
        return {
          loop: false,
          animationData: fail,
          autoplay: true,
        };
      }
      default: {
        return {
          loop: true,
          animationData: leafLoading,
          autoplay: true,
        };
      }
    }
  }, [transactionStatus]);

  const { View } = useLottie(options);

  return <>{View}</>;
};
