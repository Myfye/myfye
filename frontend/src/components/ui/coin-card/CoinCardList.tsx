import CoinCard from "./CoinCard";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const CoinCardList = ({ coins, showOptions = false }) => {
  return (
    <ul
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: var(--size-300);
      `}
    >
      {coins.map((coin, i) => (
        <li
          className="coin-card-wrapper"
          css={css`
            display: block;
            width: 100%;
          `}
          key={`coin-card-${i}`}
        >
          <CoinCard
            title={coin.title}
            type={coin.type}
            currency={coin.currency}
            balance={coin.balance}
            showOptions={showOptions}
          />
        </li>
      ))}
    </ul>
  );
};

export default CoinCardList;
