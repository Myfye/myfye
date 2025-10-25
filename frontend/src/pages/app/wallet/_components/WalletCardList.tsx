import {
  CoinsIcon as CryptoIcon,
  PiggyBankIcon as EarnIcon,
  MoneyIcon as CashIcon,
  ChartLineUpIcon as StocksIcon,
} from "@phosphor-icons/react";
import WalletCard from "./WalletCard";

import { css } from "@emotion/react";
import { useDispatch } from "react-redux";

import {
  selectAssetsBalanceUSDByGroup,
  selectAssetsGroupsArray,
  toggleGroupOverlay,
} from "../../../../features/assets/stores/assetsSlice";
import { AssetGroup } from "../../../../features/assets/types/types";
import { useAppSelector } from "@/redux/hooks";

const WalletCardList = () => {
  const dispatch = useDispatch();
  const assetsGroups = useAppSelector((state) => {
    const groups = selectAssetsGroupsArray(state);
    return groups.map((group) => ({
      ...group,
      balanceUSD: selectAssetsBalanceUSDByGroup(state, group.id),
    }));
  });

  const getCardIcon = (groupId: AssetGroup["id"]) => {
    switch (groupId) {
      case "cash": {
        return CashIcon;
      }
      case "crypto": {
        return CryptoIcon;
      }
      case "earn": {
        return EarnIcon;
      }
      case "stocks": {
        return StocksIcon;
      }
      default: {
        throw new Error("Invalid group id");
      }
    }
  };

  const cards = assetsGroups
    .filter((group) => group.id !== "retirement")
    .map((group) => ({
      title: group.label,
      balance: group.balanceUSD,
      percentChange: group.percentChange,
      icon: getCardIcon(group.id),
      action: () =>
        dispatch(toggleGroupOverlay({ groupId: group.id, isOpen: true })),
    }));

  return (
    <div className="wallet-card-list">
      <ul
        css={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--size-200);
        `}
      >
        {cards.map((card, i) => (
          <WalletCard
            key={`wallet-card-wrapper-${i}`}
            title={card.title}
            icon={card.icon}
            balance={card.balance}
            percentChange={card.percentChange}
            onPress={() => {
              card.action();
            }}
          />
        ))}
      </ul>
    </div>
  );
};
export default WalletCardList;
