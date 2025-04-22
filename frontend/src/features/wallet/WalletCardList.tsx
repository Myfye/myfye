import {
  Coins as CryptoIcon,
  PiggyBank as EarnIcon,
  Money as CashIcon,
  ChartLineUp as StocksIcon,
} from "@phosphor-icons/react";
import WalletCard from "./WalletCard";

import { css } from "@emotion/react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import {
  selectAssetsBalanceUSDByGroup,
  selectAssetsGroupsArray,
  toggleGroupOverlay,
} from "../assets/assetsSlice";
import { AssetGroup } from "../assets/types";

const WalletCardList = ({ ...restProps }) => {
  const dispatch = useDispatch();
  const assetsGroups = useSelector(selectAssetsGroupsArray);
  const cashBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "cash")
  );
  const cryptoBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "crypto")
  );

  const earnBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "earn")
  );

  const stocksBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "stocks")
  );

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

  const getCardBalance = (groupId: AssetGroup["id"]) => {
    switch (groupId) {
      case "cash": {
        return cashBalanceUSD;
      }
      case "crypto": {
        return cryptoBalanceUSD;
      }
      case "earn": {
        return earnBalanceUSD;
      }
      case "stocks": {
        return stocksBalanceUSD;
      }
      default: {
        throw new Error("Invalid group id");
      }
    }
  };

  const cards = useMemo(() => {
    return assetsGroups.map((group) => ({
      title: group.label,
      balance: getCardBalance(group.id),
      percentChange: group.percentChange,
      icon: getCardIcon(group.id),
      action: () =>
        dispatch(toggleGroupOverlay({ groupId: group.id, isOpen: true })),
    }));
  }, [assetsGroups, dispatch, toggleGroupOverlay]);

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
              title={card.title}
              icon={card.icon}
              balance={card.balance}
              percentChange={card.percentChange}
              onPress={card.action}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default WalletCardList;
