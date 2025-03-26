/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import CoinCardList from "@/components/ui/coin-card/CoinCardList";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { setCoinSummaryOverlayOpen } from "@/redux/overlayReducers";

const CryptoPanel = ({ btcBalanceInUSD, solBalanceInUSD }) => {
  const totalBalance = useMemo(
    () => btcBalanceInUSD + solBalanceInUSD,
    [btcBalanceInUSD, solBalanceInUSD]
  );

  const dispatch = useDispatch();

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

  const onCoinSelect = (coin) => {
    console.log(coin);
    dispatch(setCoinSummaryOverlayOpen(true));
  };

  return (
    <div className="crypto-panel" css={css``}>
      <section
        className="balance-container"
        css={css`
          margin-block-start: var(--size-250);
          padding: 0 var(--size-250);
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
        <CoinCardList
          coins={coins}
          showOptions={true}
          onCoinSelect={onCoinSelect}
        />
      </section>
    </div>
  );
};

export default CryptoPanel;
