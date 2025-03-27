import Coin from "@/components/ui/coin-card/Coin";
import { ArrowDown } from "@phosphor-icons/react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const SwapCoin = ({ type }) => {
  return (
    <div className="swap-coin">
      <div>
        <Coin type={type}></Coin>
      </div>
      <div></div>
    </div>
  );
};

const SwapCoinSummary = () => {
  return (
    <div
      className="swap-coin-status"
      css={css`
        display: flex;
        flex-direction: column;
        gap: var(--size-150);
      `}
    >
      <section className="sell-coin">
        <div></div>
      </section>
      <section className="icon-wrapper">
        <ArrowDown color="var(--clr-icon)" size={24} />
      </section>
      <section className="buy-coin">
        <div></div>
      </section>
    </div>
  );
};

export default SwapCoinSummary;
