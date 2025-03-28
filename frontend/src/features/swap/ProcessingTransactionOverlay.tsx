/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import HeadlessOverlay from "@/components/ui/overlay/HeadlessOverlay";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { toggleOverlay, unmount } from "./swapSlice";
import { RootState } from "@/redux/store";
import { unmount } from "./swapSlice";

const ProcessingTransactionOverlay = () => {
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
    <HeadlessOverlay isOpen={isOpen} onOpenChange={handleOpen}>
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
            css={css`
              width: var(--size-600);
              height: auto;
            `}
            src="@/assets/lottie/leaf-loading.lottie"
            loop
            autoplay
          />
        </section>
        <section
          css={css`
            margin-block-start: var(--size-800);
          `}
        >
          <hgroup>
            <h1
              className="heading-x-large"
              css={css`
                color: var(--clr-text);
              `}
            >
              Swapping
            </h1>
            <p
              className="heading-large"
              css={css`
                color: var(--clr-text);
              `}
            >
              You're swapping $2.00 {buyInfo.coin} for CBBTC on Base
            </p>
            <p
              css={css`
                color: var(--clr-text-weak);
              `}
            >
              This transaction may take a few minutes on the blockchain, then it
              will arrive in your wallet
            </p>
          </hgroup>
        </section>
        <section>
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
              <Button expand variant="neutral" href="/"></Button>
            </li>
          </menu>
        </section>
      </div>
    </HeadlessOverlay>
  );
};

export default ProcessingTransactionOverlay;
