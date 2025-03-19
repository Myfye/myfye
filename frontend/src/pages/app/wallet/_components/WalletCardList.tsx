import {
  Coins as CryptoIcon,
  PiggyBank as EarnIcon,
  ChartLineUp as StocksIcon,
  Wallet as WalletIcon,
} from "@phosphor-icons/react";
import WalletCard from "./WalletCard";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import useBalance from "@/hooks/useBalance";
import { useMemo } from "react";

const WalletCardList = ({ ...restProps }) => {
  const { cryptoBalanceInUSD, cashBalanceInUSD } = useBalance();
  const cards = useMemo(
    () => [
      {
        label: "Crypto",
        id: "crypto",
        balance: cryptoBalanceInUSD,
        percentChange: 0.0492,
        icon: CryptoIcon,
      },
      {
        label: "Earn",
        id: "earn",
        balance: cashBalanceInUSD,
        percentChange: -0.0212,
        icon: EarnIcon,
      },
      { label: "Stocks", id: "stocks", precentChange: 0, icon: StocksIcon },
      {
        label: "Wallet Info",
        id: "wallet_info",
        percentChange: 0,
        icon: WalletIcon,
      },
    ],
    [cryptoBalanceInUSD, cashBalanceInUSD]
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
          <li className="wallet-card" css={css``}>
            <WalletCard
              title={card.label}
              icon={card.icon}
              balance={card.balance}
              percentChange={card.percentChange}
              key={`wallet-card-${i}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default WalletCardList;
