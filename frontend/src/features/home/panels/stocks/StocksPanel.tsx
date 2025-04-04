/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import CoinCardList from "@/features/coins/coin-card/CoinCardList";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import { useDispatch, useSelector } from "react-redux";
import { setCoinSummaryOverlayOpen } from "@/redux/overlayReducers";

const StocksPanel = ({}) => {
  const dispatch = useDispatch();

  const onCoinSelect = (coin) => {
    console.log(coin);
    dispatch(setCoinSummaryOverlayOpen(true));
  };

  const coins = [
    {
      title: "Bitcoin",
      currency: "btc",
      type: "btcSol",
      balance: 4349,
    },
    {
      title: "Solana",
      currency: "sol",
      type: "sol",
      balance: 44323,
    },
  ];

  return (
    <div className="crypto-panel" css={css``}>
      <section
        className="balance-container"
        css={css`
          margin-block-start: var(--size-250);
          padding: 0 var(--size-250);
        `}
      >
        <BalanceTitle balance={13329.32} />
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

export default StocksPanel;
