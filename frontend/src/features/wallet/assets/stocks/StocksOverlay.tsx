/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Overlay from "@/components/ui/overlay/Overlay";
import Balance from "@/components/ui/balance/Balance";
import useBalance from "@/hooks/useBalance";
import Button from "@/components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  setDepositModalOpen,
  setReceiveModalOpen,
  setSendModalOpen,
  setSwapModalOpen,
} from "@/redux/modalReducers";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import AssetCardList from "@/features/wallet/assets/cards/AssetCardList";
import { RootState } from "@/redux/store";
import LineChart from "@/components/ui/line-chart/LineChart";
import { useState } from "react";
import { Key, useSelect } from "react-aria";
import {
  selectAssetsBalanceUSDByGroup,
  selectAssetsByGroup,
  toggleGroupOverlay,
} from "../assetsSlice";
import WalletOverlay from "../../WalletOverlay";

const lineChartData = [
  {
    id: "stocksData",
    color: "var(--clr-green-400)",
    data: [
      {
        x: "2024-01-15",
        y: 28,
      },
      {
        x: "2024-03-10",
        y: 76,
      },
      {
        x: "2024-06-25",
        y: 101,
      },
      {
        x: "2024-09-07",
        y: 213,
      },
      {
        x: "2024-11-22",
        y: 222,
      },
      {
        x: "2025-02-14",
        y: 161,
      },
      {
        x: "2025-05-05",
        y: 78,
      },
      {
        x: "2025-07-19",
        y: 245,
      },
      {
        x: "2025-08-30",
        y: 68,
      },
      {
        x: "2025-10-12",
        y: 77,
      },
      {
        x: "2025-12-03",
        y: 152,
      },
      {
        x: "2024-04-08",
        y: 29,
      },
    ],
  },
];

const StocksOverlay = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.assets.groups["stocks"].overlay.isOpen
  );

  const onOpenChange = (isOpen: boolean) => {
    dispatch(toggleGroupOverlay({ isOpen, groupId: "stocks" }));
  };

  const stocksAssets = useSelector((state: RootState) =>
    selectAssetsByGroup(state, "stocks")
  );

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "stocks")
  );

  const [selectedDateRange, setSelectedDateRange] = useState(
    new Set<Key>(["1D"])
  );

  return (
    <>
      <WalletOverlay
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Stocks"
        balance={balanceUSD}
      >
        <section
          css={css`
            margin-block-start: var(--size-400);
          `}
        >
          <LineChart
            data={lineChartData}
            selectedDateRange={selectedDateRange}
            onDateRangeSelectionChange={(key) => setSelectedDateRange(key)}
          />
        </section>
        <section
          css={css`
            margin-block-start: var(--size-500);
            margin-inline: var(--size-250);
            margin-block-end: var(--size-250);
          `}
        >
          <AssetCardList assets={stocksAssets} showOptions={true} />
        </section>
      </WalletOverlay>
    </>
  );
};

export default StocksOverlay;
