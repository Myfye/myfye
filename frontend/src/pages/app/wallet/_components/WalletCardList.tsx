import {
  Coins as CryptoIcon,
  PiggyBank as EarnIcon,
  Money as CashIcon,
  ChartLineUp as StocksIcon,
  Wallet as WalletIcon,
} from "@phosphor-icons/react";
import WalletCard from "./WalletCard";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import useBalance from "@/hooks/useBalance";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  setCryptoSummaryOverlayOpen,
  setEarnSummaryOverlayOpen,
} from "@/redux/overlayReducers";

const WalletCardList = ({ ...restProps }) => {
  const { cryptoBalanceInUSD, cashBalanceInUSD, usdyBalanceInUSD } =
    useBalance();
  const dispatch = useDispatch();
  const cards = useMemo(
    () => [
      ,
      {
        label: "Cash",
        id: "cash",
        balance: cashBalanceInUSD,
        percentChange: -0.012,
        icon: CashIcon,
        action: () => dispatch(setCryptoSummaryOverlayOpen(true)),
      },
      {
        label: "Earn",
        id: "earn",
        balance: usdyBalanceInUSD,
        percentChange: -0.0212,
        icon: EarnIcon,
        action: () => dispatch(setEarnSummaryOverlayOpen(true)),
      },
      {
        label: "Crypto",
        id: "crypto",
        balance: cryptoBalanceInUSD,
        percentChange: 0.0492,
        icon: CryptoIcon,
        action: () => dispatch(setCryptoSummaryOverlayOpen(true)),
      },
      { label: "Stocks", id: "stocks", precentChange: 0, icon: StocksIcon },
      {
        label: "Wallet Info",
        id: "wallet_info",
        percentChange: 0,
        icon: WalletIcon,
      },
    ],
    [cryptoBalanceInUSD, cashBalanceInUSD, usdyBalanceInUSD]
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
