import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import AssetCardList from "@/features/assets/cards/AssetCardList";
import { RootState } from "@/redux/store";
import {
  selectAbstractedAssetBalanceUSD,
  selectAbstractedAssetsWithBalanceByGroup,
  selectAssetsBalanceUSDByGroup,
  toggleGroupOverlay,
} from "../../../../features/assets/assetsSlice";
import WalletOverlay from "../_components/WalletOverlay";
import Button from "@/shared/components/ui/button/Button";
import Section from "@/shared/components/ui/section/Section";
import PieChart from "../_components/PieChart";
import { setDepositModalOpen } from "@/redux/modalReducers";
import { Series } from "highcharts";
import { walletPieChartLabelFormatter } from "../utils";

const CashOverlay = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.assets.groups["cash"].overlay.isOpen
  );

  const handleOpen = (isOpen: boolean) => {
    dispatch(toggleGroupOverlay({ isOpen, groupId: "cash" }));
  };

  const assets = useSelector((state: RootState) =>
    selectAbstractedAssetsWithBalanceByGroup(state, "cash")
  );

  const usdBalance = useSelector((state: RootState) =>
    selectAbstractedAssetBalanceUSD(state, "us_dollar")
  );

  const euroBalanceUSD = useSelector((state: RootState) =>
    selectAbstractedAssetBalanceUSD(state, "euro")
  );

  const balanceUSD = useSelector((state: RootState) =>
    selectAssetsBalanceUSDByGroup(state, "cash")
  );

  const pieChartData = (() => {
    const data = [];
    if (usdBalance > 0) {
      const cashData = {
        name: "US Dollar",
        y: usdBalance,
        color: "var(--clr-green-400)",
      };
      data.push(cashData);
    }
    if (euroBalanceUSD > 0) {
      const earnData = {
        name: "Euro",
        y: euroBalanceUSD,
        color: "var(--clr-blue-400)",
      };
      data.push(earnData);
    }
    return data;
  })();

  const pieChartOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      height: 320,
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
        innerSize: "33.33%",
        size: "60%",
        depth: 45,
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: { enabled: false },
      },
    },
    title: {
      text: "<span class='visually-hidden'>Myfye Portfolio</span>",
      useHTML: true,
    },
    tooltip: {
      enabled: true,
      pointFormat: "Balance: <b>${point.y:.2f}</b>",
    },
    credits: {
      enabled: false,
    },
    legend: {
      backgroundColor: "transparent",
      enabled: true,
      floating: true,
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      useHTML: true,
      x: 2,
      y: -60,
      width: 120,
      itemMarginTop: 4,
      itemMarginBottom: 4,
      itemStyle: {
        fontSize: "13px",
        fontFamily: "Inter",
        color: "var(--clr-text)",
      },
      labelFormatter: walletPieChartLabelFormatter,
    },
    series: [
      // @ts-ignore
      {
        name: "Portfolio Summary",
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
        title="Cash"
        balance={balanceUSD}
        groupId="cash"
      >
        {pieChartData.length > 0 && (
          <section
            css={css`
              margin-block-start: var(--size-400);
              padding-inline: var(--size-250);
            `}
          >
            <div
              className="pie-chart-card"
              css={css`
                padding: var(--size-150);
                background-color: var(--clr-surface-raised);
                height: 16rem;
                border-radius: var(--border-radius-medium);
              `}
            >
              <h2
                className="heading-medium"
                css={css`
                  padding-block-end: var(--size-100);
                `}
              >
                Portfolio Summary
              </h2>
              <PieChart options={pieChartOptions} />
            </div>
          </section>
        )}
        {pieChartData.length === 0 && (
          <section
            css={css`
              display: grid;
              place-items: center;
              width: 100%;
              height: 16rem;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
              `}
            >
              <p className="heading-large">Hold cash. Get paid.</p>
              <p
                className="caption"
                css={css`
                  color: var(--clr-text-weaker);
                  margin-block-start: var(--size-100);
                `}
              >
                Get started by making a USD/Euro deposit
              </p>
              <div
                css={css`
                  margin-block-start: var(--size-300);
                `}
              >
                <Button
                  onPress={() => void dispatch(setDepositModalOpen(true))}
                >
                  Deposit cash
                </Button>
              </div>
            </div>
          </section>
        )}
        <Section
          title="Assets"
          css={css`
            margin-block-start: var(--size-400);
            padding-inline: var(--size-250);
            padding-block-end: var(--size-250);
          `}
        >
          <AssetCardList assets={assets} showOptions={true} />
        </Section>
      </WalletOverlay>
    </>
  );
};

export default CashOverlay;
