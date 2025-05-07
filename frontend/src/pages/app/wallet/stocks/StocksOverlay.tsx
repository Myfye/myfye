import { css } from "@emotion/react";

import { useDispatch, useSelector } from "react-redux";
import AssetCardList from "@/features/assets/cards/AssetCardList";
import { RootState } from "@/redux/store";
import LineChart from "@/shared/components/ui/line-chart/LineChart";
import { useState } from "react";
import { Key } from "react-aria";
import {
  selectAbstractedAssetsWithBalanceByGroup,
  selectAssetsBalanceUSDByGroup,
  toggleGroupOverlay,
} from "../../../../features/assets/assetsSlice";
import WalletOverlay from "../_components/WalletOverlay";
import Switch from "@/shared/components/ui/switch/Switch";
import Section from "@/shared/components/ui/section/Section";

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

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleGroupOverlay({ isOpen, groupId: "stocks" }));
  };

  const assets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByGroup(state, "stocks")
  );

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "stocks")
  );

  const [selectedDateRange, setSelectedDateRange] = useState(
    new Set<Key>(["1D"])
  );

  const [selected, setSelected] = useState(false);

  const onSelectedChange = (e: boolean) => {
    setSelected(e);
  };

  return (
    <>
      <WalletOverlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
        title="Stocks"
        balance={balanceUSD}
        groupId="stocks"
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

        <Section
          title="Assets"
          css={css`
            margin-block-start: var(--size-400);
            padding-inline: var(--size-250);
          `}
          action={
            <div
              className="wrapper"
              css={css`
                width: fit-content;
              `}
            >
              <Switch selected={selected} onChange={onSelectedChange}>
                <span
                  css={css`
                    font-weight: var(--fw-active);
                  `}
                >
                  Show shares?
                </span>
              </Switch>
            </div>
          }
        >
          <AssetCardList
            assets={assets}
            showOptions={true}
            showBalanceUSD={selected ? false : true}
            showCurrencySymbol={selected ? false : true}
          />
        </Section>
      </WalletOverlay>
    </>
  );
};

export default StocksOverlay;
