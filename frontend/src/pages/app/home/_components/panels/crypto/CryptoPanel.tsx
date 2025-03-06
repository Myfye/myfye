/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import CoinCardList from "../../CoinCardList";
import btcCoinIcon from "@/assets/svgs/coins/btc-coin.svg";
import solCoinIcon from "@/assets/svgs/coins/sol-coin.svg";
import BalanceTitle from "../../BalanceTitle";
import { useMemo } from "react";

const CryptoPanel = ({ btcBalanceInUSD, solBalanceInUSD }) => {
  const totalBalance = useMemo(
    () => btcBalanceInUSD + solBalanceInUSD,
    [btcBalanceInUSD, solBalanceInUSD]
  );

  const coins = useMemo(
    () => [
      {
        title: "Bitcoin",
        currency: "btc",
        type: "btc",
        balance: btcBalanceInUSD,
        img: btcCoinIcon,
      },
      {
        title: "Solana",
        currency: "sol",
        type: "sol",
        balance: solBalanceInUSD,
        img: solCoinIcon,
      },
    ],
    [btcBalanceInUSD, solBalanceInUSD]
  );

  return (
    <div className="crypto-panel" css={css``}>
      <section className="balance-container">
        <BalanceTitle balance={totalBalance} />
      </section>
      <section className="coins-container">
        <CoinCardList coins={coins} />
      </section>
    </div>
  );
};

export default CryptoPanel;
