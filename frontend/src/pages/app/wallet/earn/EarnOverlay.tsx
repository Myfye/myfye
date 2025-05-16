import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectAssetsBalanceUSDByGroup,
  toggleGroupOverlay,
} from "../../../../features/assets/assetsSlice";
import { css } from "@emotion/react";
import WalletOverlay from "../_components/WalletOverlay";
import Card from "@/shared/components/ui/card/Card";
import { ChartLineUp } from "@phosphor-icons/react";
import Button from "@/shared/components/ui/button/Button";
import EarnBreakdownModal from "./EarnBreakdownModal";
import { useState } from "react";
import PieChart from "../_components/PieChart";

const pieChartData = [
  {
    name: "First Citizens - Bank Deposits",
    y: 0.7,
    color: "var(--clr-green-500)",
  },
  {
    name: "StoneX - US T-Bills",
    y: 0.16,
    color: "var(--clr-blue-300)",
  },
  {
    name: "Morgan Stanley - Bank Deposits",
    y: 0.06,
    color: "var(--clr-blue-500)",
  },
  {
    name: "StoneX - Cash & Equivalents",
    y: 0.06,
    color: "var(--clr-blue-700)",
  },
  {
    name: "Morgan Stanley - US T-Notes",
    y: 0.05,
    color: "var(--clr-green-700)",
  },
  {
    name: "StoneX - US T-Notes",
    y: 0.03,
    color: "var(--clr-blue-400)",
  },
  {
    name: "First Citizens - Cash & Cash Deposits",
    y: 0.02,
    color: "var(--clr-green-400)",
  },
  {
    name: "Morgan Stanley - Cash & Cash Deposits",
    y: 0,
    color: "var(--clr-green-300)",
  },
];

const EarnOverlay = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.assets.groups["earn"].overlay.isOpen
  );

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleGroupOverlay({ isOpen, groupId: "earn" }));
  };

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "earn")
  );

  const [isBreakdownOpen, setBreakdownOpen] = useState(false);

  const handleBreakdownOpen = (isOpen: boolean) => {
    setBreakdownOpen(isOpen);
  };

  const pieChartOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      height: 320,
      width: 300,
      backgroundColor: "transparent",
      spacingBottom: 0,
      spacingLeft: 16,
      spacingRight: 0,
      spacingTop: 4,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    plotOptions: {
      pie: {
        borderWidth: 2,
        center: ["28%", "30%"],
        showInLegend: true,
        innerSize: "60%",
        size: "60%",
        depth: 45,
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          {
            enabled: false,
          },
        ],
      },
    },
    title: {
      text: "<span class='earn-breakdown-title-main'>Earn</br>Breakdown</span>",
      floating: true,
      x: -64.5,
      y: 92,
      style: {
        fontSize: "17px",
        fontWeight: "600",
        fontFamily: "Inter",
        color: "var(--clr-text)",
      },
    },
    tooltip: {
      enabled: true,
      pointFormat: "Balance: <b>${point.y:.2f}</b>",
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [
      // @ts-ignore
      {
        name: "Earn breakdown",
        colorByPoint: true,
        data: pieChartData,
      },
    ],
  };

  return (
    <>
      <WalletOverlay
        isOpen={isOpen}
        onOpenChange={handleOpen}
        balance={balanceUSD}
        title="Earn"
        groupId="earn"
      >
        <section
          css={css`
            margin-inline: var(--size-250);
            margin-block-start: var(--size-300);
          `}
        >
          <div
            className="pie-chart-container"
            css={css`
              position: relative;
            `}
          >
            <div
              className="button-wrapper"
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: absolute;
                inset: 0;
                margin: auto;
                left: auto;
                right: var(--size-150);
                z-index: 1;
              `}
            >
              <Button
                size="x-small"
                color="neutral"
                onPress={() => void setBreakdownOpen(true)}
              >
                View breakdown
              </Button>
            </div>
            <div
              css={css`
                padding: var(--size-150);
                border-radius: var(--border-radius-medium);
                background-color: var(--clr-surface-raised);
                height: 14.75rem;
                position: relative;
                isolation: isolate;
              `}
            >
              <PieChart options={pieChartOptions} />
            </div>
          </div>
        </section>
        <section
          css={css`
            margin-block-start: var(--size-400);
            padding-inline: var(--size-250);
          `}
        >
          <Card
            title={
              <span
                css={css`
                  display: flex;
                  flex-direction: column;
                  align-items: start;
                `}
              >
                <span>US Dollar Yield</span>
                <span
                  css={css`
                    margin-block-start: var(--size-025);
                    margin-block-end: var(--size-050);
                    font-size: var(--fs-x-small);
                    color: var(--clr-primary);
                    font-weight: var(--fw-default);
                  `}
                >
                  7.00%&nbsp;
                  <span
                    css={css`
                      color: var(--clr-text-weaker);
                    `}
                  >
                    APY
                  </span>
                </span>
              </span>
            }
            caption="Earn yield by depositing money into a lending and borrowing protocol."
            icon={ChartLineUp}
          />
        </section>
      </WalletOverlay>
      <EarnBreakdownModal
        data={pieChartData}
        isOpen={isBreakdownOpen}
        onOpenChange={handleBreakdownOpen}
      />
    </>
  );
};

export default EarnOverlay;
