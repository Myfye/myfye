/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import HeadlessOverlay from "@/components/ui/overlay/HeadlessOverlay";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Button from "@/components/ui/button/Button";
import { useDispatch } from "react-redux";

const ProcessingTransactionOverlay = () => {
  const dispatch = useDispatch();
  return (
    <HeadlessOverlay>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          padding: var(--size-250);
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
              You're swapping $2.00 USDC for CBBTC on Base
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
                  dispatch;
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
