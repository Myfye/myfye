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

import StockChart from "../../home/components/panels/dashboard/chart_tabs/StockChart";

import mockData from "@/assets/mock_stock_data.csv?url";

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

  const stockChartOptions: Highcharts.Options = {
    chart: {
      height: 210,
      backgroundColor: "transparent",
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    tooltip: {
      hideDelay: 9999999999,
      shape: "rect",
      split: true,
      headerShape: "rect",
      style: {
        backgroundColor: "transparent",
        fill: "transparent",
      },
      shadow: false,
      padding: 0,
      position: {
        x: 15,
        y: 6,
      },
      fixed: true,
      shared: true,
      useHTML: true,
      formatter: function () {
        return `<div class="stock-balance"><span class="balance">${new Intl.NumberFormat(
          "en-EN",
          {
            style: "currency",
            currency: "usd",
          }
        ).format(this.y ?? 0)}</span><span class="date">${new Date(
          this.key
        ).toLocaleDateString("en-EN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}</span></div>`;
      },
    },
    rangeSelector: {
      selected: 0,
      dropdown: "never",
      inputEnabled: false,
      buttons: [
        {
          type: "month",
          count: 1,
          text: "1m",
          title: "View 1 month",
        },
        {
          type: "month",
          count: 3,
          text: "3m",
          title: "View 3 months",
        },
        {
          type: "year",
          count: 1,
          text: "1y",
          title: "View 1 year",
        },
        {
          type: "all",
          text: "All",
          title: "View all",
        },
      ],
      buttonPosition: {
        align: "center",
      },
      buttonSpacing: 6,
      buttonTheme: {
        fill: "none",
        stroke: "none",
        "stroke-width": 0,
        r: 4,
        style: {
          fontSize: "12px",
          color: "var(--clr-primary)",
          fontWeight: "var(--fw-active)",
          fontFamily: "Inter",
        },
        states: {
          hover: {
            fill: "var(--clr-primary)",
            style: {
              color: "var(--clr-white)",
            },
          },
          select: {
            fill: "var(--clr-primary)",
            style: {
              color: "var(--clr-white)",
            },
          },
        },
      },
      floating: true,
      verticalAlign: "bottom",
    },
    colors: ["var(--clr-green-400)"],
    title: {
      text: "<span class='visually-hidden'>Myfye Performance</span>",
      useHTML: true,
    },
    data: {
      csvURL: mockData,
    },
    xAxis: {
      visible: false,
      crosshair: {
        color: "var(--clr-neutral-300)",
      },
    },
    yAxis: {
      visible: false,
    },
    navigator: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
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
            padding-inline: var(--size-250);
          `}
        >
          <div
            css={css`
              padding-block: var(--size-150);
              border-radius: var(--border-radius-medium);
              touch-action: none;
              background-color: var(--clr-surface-raised);
            `}
          >
            <h2
              className="heading-medium"
              css={css`
                padding-block-end: var(--size-100);
                padding-inline: var(--size-150);
              `}
            >
              Portfolio Summary
            </h2>
            <StockChart options={stockChartOptions} />
          </div>
        </section>

        <Section
          title="Assets"
          css={css`
            margin-block-start: var(--size-400);
            padding-inline: var(--size-250);
            margin-block-end: var(--size-200);
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
