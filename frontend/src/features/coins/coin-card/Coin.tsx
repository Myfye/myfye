/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback } from "react";
import btcCoinIcon from "@/assets/svgs/coins/btc-coin.svg";
import solCoinIcon from "@/assets/svgs/coins/sol-coin.svg";
import usdCoinIcon from "@/assets/svgs/coins/usd-coin.svg";
import euroCoinIcon from "@/assets/svgs/coins/eur-coin.svg";
import usdyCoinIcon from "@/assets/svgs/coins/usdy-coin.svg";
import microsoftCoinIcon from "@/assets/svgs/coins/microsoft.svg";
import appleCoinIcon from "@/assets/svgs/coins/apple.svg";
import googleCoinIcon from "@/assets/svgs/coins/google.png";

type CoinType =
  | "btcSol"
  | "sol"
  | "usdtSol"
  | "eurcSol"
  | "usdySol"
  | "google"
  | "microsoft"
  | "apple";

const Coin = ({ type = "usdtSol" }: { type: CoinType }) => {
  const getCoinImageSrc = useCallback(
    (type: CoinType) => {
      switch (type) {
        case "btcSol": {
          return btcCoinIcon;
        }
        case "sol": {
          return solCoinIcon;
        }
        case "usdtSol": {
          return usdCoinIcon;
        }
        case "eurcSol": {
          return euroCoinIcon;
        }
        case "usdySol": {
          return usdyCoinIcon;
        }
        case "apple": {
          return appleCoinIcon;
        }
        case "microsoft": {
          return microsoftCoinIcon;
        }
        case "google": {
          return googleCoinIcon;
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
