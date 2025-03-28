/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import HeadlessOverlay from "@/components/ui/overlay/HeadlessOverlay";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Button from "@/components/ui/button/Button";

const ProcessingTransactionOverlay = () => {
  return (
    <HeadlessOverlay backgroundColor="var(--clr-accent)">
      <div>
        <section>
          <DotLottieReact
            src="@/assets/lottie/leaf-loading.lottie"
            loop
            autoplay
          />
        </section>
        <section>
          <hgroup>
            <h1>Swapping</h1>
            <p>You're swapping $2.00 USDC for CBBTC on Base</p>
            <p>
              This transaction may take a few minutes on the blockchain, then it
              will arrive in your wallet
            </p>
          </hgroup>
        </section>
        <section>
          <menu>
            <li>
              <Button expand></Button>
            </li>
            <li>
              <Button expand href="/"></Button>
            </li>
          </menu>
        </section>
      </div>
    </HeadlessOverlay>
  );
};

export default ProcessingTransactionOverlay;
