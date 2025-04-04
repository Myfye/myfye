import {
  Coins as CryptoIcon,
  PiggyBank as EarnIcon,
  Money as CashIcon,
  ChartLineUp as StocksIcon,
} from "@phosphor-icons/react";
import WalletCard from "./WalletCard";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import useBalance from "@/hooks/useBalance";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setOverlayOpen as setCashOverlayOpen } from "./cash/cashSlice";
import { setOverlayOpen as setEarnOverlayOpen } from "./earn/earnSlice";
import { setOverlayOpen as setStocksOverlayOpen } from "./stocks/stocksSlice";
import { setOverlayOpen as setCryptoOverlayOpen } from "./crypto/cryptoSlice";
import { RootState } from "@/redux/store";

const WalletCardList = ({ ...restProps }) => {
  const { cryptoBalanceInUSD, usdyBalanceInUSD } = useBalance();

  const usdtSolBalance = useSelector(
    (state: RootState) => state.userWalletData.usdtSolBalance
  );

  const usdcSolBalance = useSelector(
    (state: RootState) => state.userWalletData.usdcSolBalance
  );

  const cashBalance = useMemo(
    () => usdtSolBalance + usdcSolBalance,
    [usdtSolBalance, usdcSolBalance]
  );

  const dispatch = useDispatch();
  const cards = useMemo(
    () => [
      ,
      {
        label: "Cash",
        id: "cash",
        balance: cashBalance,
        percentChange: -0.012,
        icon: CashIcon,
        action: () => dispatch(setCashOverlayOpen(true)),
      },
      {
        label: "Earn",
        id: "earn",
        balance: usdyBalanceInUSD,
        percentChange: -0.0212,
        icon: EarnIcon,
        action: () => dispatch(setEarnOverlayOpen(true)),
      },
      {
        label: "Crypto",
        id: "crypto",
        balance: cryptoBalanceInUSD,
        percentChange: 0.0492,
        icon: CryptoIcon,
        action: () => dispatch(setCryptoOverlayOpen(true)),
      },
      {
        label: "Stocks",
        id: "stocks",
        balance: 0,
        precentChange: 0.0292,
        icon: StocksIcon,
        action: () => dispatch(setStocksOverlayOpen(true)),
      },
    ],
    [cryptoBalanceInUSD, cashBalance, usdyBalanceInUSD]
  );
  return (
    <div className="wallet-card-list-container" {...restProps}>
      <ul
        className="wallet-card-list"
        css={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--size-200);
        `}
      >
        {cards.map((card, i) => (
          <li className="wallet-card-wrapper" key={`wallet-card-wrapper-${i}`}>
            <WalletCard
              title={card.label}
              icon={card.icon}
              balance={card.balance}
              percentChange={card.percentChange}
              onPress={() => {
                if (card.action) card.action();
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default WalletCardList;
