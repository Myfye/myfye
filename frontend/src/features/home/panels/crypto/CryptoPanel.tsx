/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import CoinCardList from "@/features/coins/coin-card/CoinCardList";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCoinSummaryOverlayOpen } from "@/redux/overlayReducers";

const CryptoPanel = ({}) => {
  const dispatch = useDispatch();

  // Blockchain Data
  const solBalance = useSelector(
    (state: any) => state.userWalletData.solBalance
  );
  const btcSolBalance = useSelector(
    (state: any) => state.userWalletData.btcSolBalance
  );
  const priceOfSOLinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfSOLinUSDC
  );
  const priceOfBTCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfBTCinUSDC
  );

  // UI Balances
  const solBalanceInUSD = solBalance * priceOfSOLinUSDC;
  const btcBalanceInUSD = btcSolBalance * priceOfBTCinUSDC;

  const totalBalance = useMemo(
    () => btcBalanceInUSD + solBalanceInUSD,
    [btcBalanceInUSD, solBalanceInUSD]
  );

  const coins = useMemo(
    () => [
      {
        title: "Bitcoin",
        currency: "btc",
        type: "btcSol",
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
