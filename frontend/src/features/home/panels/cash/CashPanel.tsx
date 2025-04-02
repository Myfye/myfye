import CoinCardList from "../../../coins/coin-card/CoinCardList";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { addCurrentCoin } from "@/redux/coinReducer";
import { useSelector } from "react-redux";

const CashPanel = ({}) => {
  const dispatch = useDispatch();

  // Blockchain Data
  const usdcSolBalance = useSelector(
    (state: any) => state.userWalletData.usdcSolBalance
  );
  const usdtSolBalance = useSelector(
    (state: any) => state.userWalletData.usdtSolBalance
  );
  const eurcSolBalance = useSelector(
    (state: any) => state.userWalletData.eurcSolBalance
  );
  const usdySolBalance = useSelector(
    (state: any) => state.userWalletData.usdySolBalance
  );
  const priceOfUSDYinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfUSDYinUSDC
  );
  const priceOfEURCinUSDC = useSelector(
    (state: any) => state.userWalletData.priceOfEURCinUSDC
  );

  // UI Balances
  const usdBalance = usdtSolBalance + usdcSolBalance;
  const usdyBalanceInUSD = usdySolBalance * priceOfUSDYinUSDC;
  const eurcBalanceInUSD = eurcSolBalance * priceOfEURCinUSDC;

  const totalBalance = useMemo(
    () => usdBalance + usdyBalanceInUSD + eurcBalanceInUSD,
    [usdBalance, usdyBalanceInUSD, eurcBalanceInUSD]
  );

  const coins = useMemo(
    () => [
      {
        title: "US Dollar",
        currency: "usd",
        type: "usdt",
        balance: usdBalance,
      },
      {
        title: "Euro",
        currency: "eur",
        type: "eurc",
        balance: usdySolBalance,
      },
      {
        title: "US Treasury Bonds",
        currency: "usd",
        type: "usdy",
        balance: usdyBalanceInUSD,
      },
    ],
    [usdBalance, usdyBalanceInUSD, eurcBalanceInUSD]
  );

  return (
    <div className="cash-panel">
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
        <CoinCardList coins={coins} showOptions={true} />
      </section>
    </div>
  );
};

export default CashPanel;
