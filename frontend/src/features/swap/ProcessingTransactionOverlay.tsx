/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import HeadlessOverlay from "@/components/ui/overlay/HeadlessOverlay";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { toggleOverlay, unmount } from "./swapSlice";
import { RootState } from "@/redux/store";

import btcIcon from "@/assets/svgs/coins/btc-coin.svg";
import solIcon from "@/assets/svgs/coins/sol-coin.svg";
import eurcCoin from "@/assets/svgs/coins/eur-coin.svg";
import usdCoin from "@/assets/svgs/coins/usd-coin.svg";
import usdyCoin from "@/assets/svgs/coins/usdy-coin.svg";

const ProcessingTransactionOverlay = ({ zIndex = 1000 }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.swap.overlays.processingTransaction.isOpen
  );
  const handleOpen = (e: boolean) => {
    toggleOverlay({ type: "processingTransaction", isOpen: e });
  };

  const buyInfo = useSelector((state: RootState) => state.swap.buy);
  const sellInfo = useSelector((state: RootState) => state.swap.sell);

  return (
    <HeadlessOverlay isOpen={isOpen} onOpenChange={handleOpen} zIndex={zIndex}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          padding: var(--size-250);
          height: 100svh;
        `}
      >
        <section
          css={css`
            margin-block-start: auto;
          `}
        >
          <DotLottieReact
            src="src/assets/lottie/leaf-loader.lottie"
            loop
            autoplay
          />
        </section>
        <section
          css={css`
            margin-block-start: var(--size-600);
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
              Swapping
            </h1>
            <p
              className="heading-large"
              css={css`
                color: var(--clr-text);
                text-align: center;
              `}
            >
              You're swapping $2.00 {buyInfo.coin} for USD on Base
            </p>
            <p
              className="caption"
              css={css`
                margin-block-start: var(--size-200);
                color: var(--clr-text-weak);
                text-align: center;
              `}
            >
              This transaction may take a few minutes on the blockchain, then it
              will arrive in your wallet
            </p>
          </hgroup>
        </section>
        <section
          css={css`
            margin-block-start: var(--size-600);
          `}
        >
          <menu
            css={css`
              display: flex;
              flex-direction: column;
              gap: var(--control-gap-medium);
            `}
          >
            <li>
              <Button
                expand
                onPress={() => {
                  dispatch(unmount());
                }}
              >
                Done
              </Button>
            </li>
            <li>
              <Button expand color="neutral" href="/">
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
