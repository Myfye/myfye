/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SwapCoinSummary from "./SwapCoinSummary";
import { toggleOverlay } from "./swapSlice";
import { swap } from "./SwapService";

const ConfirmSwapOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.swap.overlays.confirmSwap.isOpen
  );

  const wallet = useSelector((state: RootState) => state.userWalletData);

  const transaction = useSelector((state: RootState) => state.swap.transaction);

  const handleOpen = (e: boolean) => {
    dispatch(toggleOverlay({ type: "confirmSwap", isOpen: e }));
  };

  const handleSwapConfirmation = () => {
    dispatch(
      toggleOverlay({
        type: "processingTransaction",
        isOpen: true,
      })
    );
    swap(
      wallet,
      wallet.pubKey,
      transaction.buy.amount,
      transaction.buy.coinId,
      transaction.sell.coinId
    );
  };
  return (
    <>
      <Overlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
        title="Confirm Swap"
        zIndex={zIndex}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100%;
          `}
        >
          <section
            css={css`
              margin-block-start: var(--size-400);
              margin-inline: var(--size-250);
            `}
          >
            <SwapCoinSummary />
          </section>
          <section
            css={css`
              margin-inline: var(--size-250);
              margin-block-start: var(--size-400);
            `}
          >
            <ul
              css={css`
                width: 100%;
                color: var(--clr-text);
                line-height: var(--line-height-tight);
                > * + * {
                  margin-block-start: var(--size-200);
                }
              `}
            >
              <li
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <span className="heading-small">CBBTC contract</span>
                <span
                  css={css`
                    margin-inline-start: auto;
                    color: var(--clr-text);
                  `}
                >
                  0xcbb7...3bf
                </span>
              </li>
              <li
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <span className="heading-small">Slippage tolerance</span>{" "}
                <span
                  css={css`
                    color: var(--clr-text);
                  `}
                >
                  3%
                </span>
              </li>
              <li
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <span className="heading-small">Coinbase fee</span>{" "}
                <span
                  css={css`
                    color: var(--clr-text);
                  `}
                >
                  $0.02
                </span>
              </li>
              <li
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <span className="heading-small">Network fee</span>{" "}
                <span
                  css={css`
                    color: var(--clr-text);
                  `}
                >
                  $0.09 - $0.10
                </span>
              </li>
            </ul>
          </section>
          <section
            css={css`
              margin-block-start: auto;
              margin-bottom: var(--size-250);
              margin-inline: var(--size-250);
            `}
          >
            <menu
              css={css`
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--control-gap-medium);
              `}
            >
              <li>
                <Button
                  expand
                  color="neutral"
                  onPress={() =>
                    void dispatch(
                      toggleOverlay({ type: "confirmSwap", isOpen: false })
                    )
                  }
                >
                  Cancel
                </Button>
              </li>
              <li>
                <Button expand onPress={handleSwapConfirmation}>
                  Confirm
                </Button>
              </li>
            </menu>
          </section>
        </div>
      </Overlay>
    </>
  );
};

export default ConfirmSwapOverlay;
