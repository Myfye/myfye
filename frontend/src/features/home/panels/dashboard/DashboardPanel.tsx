import Button from "@/shared/components/ui/button/Button";
import {
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  ArrowLineDown as ArrowLineDownIcon,
  ArrowLineUp as ArrowLineUpIcon,
  ArrowsDownUp,
} from "@phosphor-icons/react";

import { css } from "@emotion/react";
import CTACarousel from "./cta-carousel/CTACarousel";
import { useMemo } from "react";
import {
  setDepositModalOpen,
  setWithdrawModalOpen,
} from "@/redux/modalReducers";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAssetsBalanceUSD,
  selectAssetsBalanceUSDByGroup,
} from "@/features/assets/assetsSlice";
import { RootState } from "@/redux/store";
import { toggleModal as toggleSendModal } from "@/features/send/sendSlice";
import { toggleModal as toggleReceiveModal } from "@/features/receive/receiveSlice";
import { toggleModal as toggleSwapModal } from "@/features/swap/swapSlice";
import DonutChart3D from "./DonutChart3D";
import BalanceCard from "@/shared/components/ui/balance/BalanceCard";
const DashboardPanel = ({}) => {
  const dispatch = useDispatch();

  const balanceUSD = useSelector(selectAssetsBalanceUSD);

  const cashBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "cash")
  );
  const earnBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "earn")
  );
  const cryptoBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "crypto")
  );
  const stocksBalanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "stocks")
  );

  const pieChartData = useMemo(() => {
    const data = [];
    if (cashBalanceUSD > 0 || earnBalanceUSD > 0) {
      // const cashData = {
      //   name: "Cash",
      //   data: [cashBalanceUSD + earnBalanceUSD],
      //   color: "var(--clr-green-400)",
      // };
      const cashData = {
        name: "Cash",
        y: cashBalanceUSD + earnBalanceUSD,
        color: "var(--clr-green-400)",
      };
      data.push(cashData);
    }
    if (cryptoBalanceUSD > 0) {
      // const cryptoData = {
      //   name: "Crypto",
      //   data: [cryptoBalanceUSD],
      //   color: "var(--clr-pie-chart-btc)",
      // };
      const cryptoData = {
        name: "Crypto",
        y: cryptoBalanceUSD,
        color: "var(--clr-blue-400)",
      };
      data.push(cryptoData);
    }
    if (stocksBalanceUSD > 0) {
      // const stocksData = {
      //   name: "Stocks",
      //   data: [stocksBalanceUSD],
      //   color: "var(--clr-pie-chart-btc)",
      // };
      const stocksData = {
        name: "Stocks",
        y: stocksBalanceUSD,
        color: "var(--clr-purple-300)",
      };
      data.push(stocksData);
    }
    return [
      { name: "Cash", y: 105.32, color: "var(--clr-green-400)" },
      { name: "Crypto", y: 28.85, color: "var(--clr-purple-400)" },
      { name: "Stocks", y: 57.01, color: "var(--clr-blue-400)" },
    ];
  }, [cashBalanceUSD, earnBalanceUSD, cryptoBalanceUSD, stocksBalanceUSD]);

  const donutChartOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      width: 320,
      height: 300,
      backgroundColor: "transparent",
      spacingBottom: 0,
      spacingLeft: 6,
      spacingRight: 0,
      spacingTop: 4,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      options3d: {
        enabled: true,
        alpha: 20,
      },
    },
    plotOptions: {
      pie: {
        center: ["28%", "40%"],
        showInLegend: true,
        innerSize: "33.33%",
        size: "60%",
        depth: 45,
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          {
            enabled: true,
            distance: -32,
            format: "{point.percentage:.1f}%",
            style: {
              fontSize: "16px",
              textOutline: "none",
              opacity: 1,
              color: "var(--clr-white)",
              textOverflow: "none",
            },
            filter: {
              operator: ">",
              property: "percentage",
              value: 1,
            },
          },
        ],
      },
    },
    title: {
      text: "MyFye Portfolio",
      align: "left",
      style: {
        fontSize: "var(--fs-x-large)",
        fontWeight: "var(--fw-heading)",
        lineHeight: "var(--line-height-heading)",
        color: "var(--clr-text)",
      },
    },
    tooltip: {
      enabled: true,
      pointFormat: "Balance: <b>${point.y:.2f}</b>",
    },
    legend: {
      backgroundColor: "transparent",
      enabled: true,
      floating: true,
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      x: 12,
      y: -40,
      width: 120,
      itemMarginTop: 4,
      itemMarginBottom: 4,
      itemStyle: {
        fontSize: "12px",
        fontFamily: "Inter",
        color: "var(--clr-text-weak)",
      },
      labelFormatter: function () {
        return (
          this.name +
          " " +
          new Intl.NumberFormat("en-EN", {
            style: "currency",
            currency: "usd",
          }).format(this.y)
        );
      },
    },
    series: [
      // @ts-ignore
      {
        name: "Portfolio",
        colorByPoint: true,
        data: pieChartData,
      },
    ],
  };

  return (
    <div
      className="dashboard-panel"
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        min-height: fit-content;
        height: 100%;
        > * {
          width: 100%;
        }
        padding-bottom: var(--size-150);
      `}
    >
      <section
        css={css`
          margin-block-start: var(--size-200);
          padding-inline: var(--size-250);
        `}
      >
        <BalanceCard balance={balanceUSD}></BalanceCard>
      </section>
      <section
        css={css`
          margin-block-start: var(--size-200);
        `}
      >
        <menu
          className="no-scrollbar"
          css={css`
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: var(--controls-gap-small);
            overflow-x: auto;
            padding-inline: var(--size-250);
          `}
        >
          <li>
            <Button
              size="x-small"
              icon={ArrowsDownUp}
              onPress={() => {
                dispatch(toggleSwapModal({ isOpen: true }));
              }}
            >
              Swap
            </Button>
          </li>
          <li>
            <Button
              size="x-small"
              icon={ArrowCircleUpIcon}
              onPress={() => {
                dispatch(toggleSendModal({ isOpen: true }));
              }}
            >
              Send
            </Button>
          </li>
          <li>
            <Button
              size="x-small"
              icon={ArrowCircleDownIcon}
              onPress={() => {
                dispatch(toggleReceiveModal(true));
              }}
            >
              Receive
            </Button>
          </li>
          <li>
            <Button
              size="x-small"
              icon={ArrowLineUpIcon}
              onPress={() => {
                dispatch(setDepositModalOpen(true));
              }}
            >
              Deposit
            </Button>
          </li>
          <li>
            <Button
              size="x-small"
              icon={ArrowLineDownIcon}
              onPress={() => {
                dispatch(setWithdrawModalOpen(true));
              }}
            >
              Withdraw
            </Button>
          </li>
        </menu>
      </section>
      <section
        css={css`
          margin-block-start: max(var(--size-200), 4vh);
          margin-block-end: auto;
          padding-inline: var(--size-250);
        `}
      >
        {balanceUSD === 0 ? (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin-block-start: var(--size-200);
            `}
          >
            <div
              css={css`
                display: block;
                width: 12rem;
                aspect-ratio: 1;
                background-color: var(--clr-surface);
                border: 1px solid var(--clr-border-neutral);
                border-radius: var(--border-radius-medium);
              `}
            />
            <h2
              className="heading-large"
              css={css`
                margin-block-start: var(--size-400);
              `}
            >
              Get started by depositing funds.
            </h2>
            <Button
              expand
              size="large"
              css={css`
                margin-block-start: var(--size-300);
              `}
            >
              Deposit funds
            </Button>
          </div>
        ) : (
          <div
            className="pie-chart-card"
            css={css`
              padding: var(--size-150);
              background-color: var(--clr-surface-raised);
              border-radius: var(--border-radius-medium);
              overflow: hidden;
              max-height: 16rem;
            `}
          >
            <DonutChart3D options={donutChartOptions} />
          </div>
        )}
      </section>
      <section className="cta-carousel-container">
        <CTACarousel
          slides={[
            {
              title: "Earn up to 4.6% APY with USDY",
              subtitle: "Invest with ONDO US Dollar Yield (USDY)",
              icon: "test",
            },
            { title: "Test", subtitle: "test", icon: "test" },
            { title: "Test", subtitle: "test", icon: "test" },
            { title: "Test", subtitle: "test", icon: "test" },
          ]}
        ></CTACarousel>
      </section>
    </div>
  );
};

export default DashboardPanel;
