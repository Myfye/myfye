/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import CoinCardList from "@/components/ui/coin-card/CoinCardList";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
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
      },
      {
        title: "Solana",
        currency: "sol",
        type: "sol",
        balance: solBalanceInUSD,
      },
    ],
    [btcBalanceInUSD, solBalanceInUSD]
  );

  return (
    <div className="crypto-panel" css={css``}>
      <section
        className="balance-container"
        css={css`
          margin-block-start: var(--size-200);
        `}
      >
        <BalanceTitle balance={totalBalance} />
      </section>
      <section
        css={css`
          margin-block-start: var(--size-400);
          padding: 0 var(--size-250);
        `}
      >
        <CoinCardList coins={coins} showOptions={true} />
      </section>
    </div>
  );
};

export default CryptoPanel;
