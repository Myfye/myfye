/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback } from "react";
import btcCoinIcon from "@/assets/svgs/coins/btc-coin.svg";
import solCoinIcon from "@/assets/svgs/coins/sol-coin.svg";
import usdCoinIcon from "@/assets/svgs/coins/usd-coin.svg";
import euroCoinIcon from "@/assets/svgs/coins/eur-coin.svg";
import usdyCoinIcon from "@/assets/svgs/coins/usdy-coin.svg";

type CoinType = "btc" | "sol" | "usdt" | "eurc" | "usdy";
type Currency = "usd" | "eur" | "btc" | "sol";

const Coin = ({ type = "usdt" }: { type: CoinType }) => {
  const getCoinImageSrc = useCallback(
    (type: CoinType) => {
      switch (type) {
        case "btc": {
          return btcCoinIcon;
        }
        case "sol": {
          return solCoinIcon;
        }
        case "usdt": {
          return usdCoinIcon;
        }
        case "eurc": {
          return euroCoinIcon;
        }
        case "usdy": {
          return usdyCoinIcon;
        }
        default: {
          return usdCoinIcon;
        }
      }
    },
    [type]
  );
  return (
    <div
      className="coin-wrapper | aspect-ratio-square"
      css={css`
        border-radius: var(--border-radius-circle);
        width: var(--size-600);
        overflow: hidden;
      `}
    >
      <img
        src={getCoinImageSrc(type)}
        css={css`
          object-fit: cover;
          width: 100%;
          height: 100%;
        `}
      />
    </div>
  );
};

export default Coin;
