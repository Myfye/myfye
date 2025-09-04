import { selectAssetsBalanceUSDByGroup } from "@/features/assets/assetsSlice";
import DonutChart3D from "./DonutChart3D";
import { css } from "@emotion/react";
import logo from "@/assets/logo/myfye_logo.svg";
import { useAppSelector } from "@/redux/hooks";

const Portfolio = () => {
  const cashBalanceUSD = useAppSelector((state) =>
    selectAssetsBalanceUSDByGroup(state, "cash")
  );
  const earnBalanceUSD = useAppSelector((state) =>
    selectAssetsBalanceUSDByGroup(state, "earn")
  );
  const cryptoBalanceUSD = useAppSelector((state) =>
    selectAssetsBalanceUSDByGroup(state, "crypto")
  );
  const stocksBalanceUSD = useAppSelector((state) =>
    selectAssetsBalanceUSDByGroup(state, "stocks")
  );

  const pieChartData = (() => {
    const data = [];
    if (cashBalanceUSD > 0) {
      const cashData = {
        name: "Cash",
        y: cashBalanceUSD,
        color: "var(--clr-green-400)",
      };
      data.push(cashData);
    }
    if (earnBalanceUSD > 0) {
      const earnData = {
        name: "Earn",
        y: earnBalanceUSD,
        color: "var(--clr-purple-400)",
      };
      data.push(earnData);
    }
    if (cryptoBalanceUSD > 0) {
      const cryptoData = {
        name: "Crypto",
        y: cryptoBalanceUSD,
        color: "#BD8B58",
      };
      data.push(cryptoData);
    }
    if (stocksBalanceUSD > 0) {
      const stocksData = {
        name: "Stocks",
        y: stocksBalanceUSD,
        color: "var(--clr-blue-300)",
      };
      data.push(stocksData);
    }
    return data;
  })();

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
      x: 10,
      y: -60,
      width: 120,
      itemMarginTop: 4,
      itemMarginBottom: 4,
      itemStyle: {
        fontSize: "13px",
        fontFamily: "Inter",
        color: "var(--clr-text)",
      },
      useHTML: true,
      labelFormatter: function () {
        return (
          "<span class='legend'>" +
          "<span class='currency'>" +
          `<span>${this.name} ${Math.round(this.percentage)}%</span>` +
          "</span>" +
          "<span class='balance'>" +
          new Intl.NumberFormat("en-EN", {
            style: "currency",
            currency: "usd",
          }).format(this.y) +
          "</span>" +
          "<span>"
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
      css={css`
        padding: var(--size-150);
        background-color: var(--clr-surface-raised);
        border-radius: var(--border-radius-medium);
        overflow: hidden;
        height: 16.5rem;
      `}
    >
      <h2
        className="heading-large"
        css={css`
          display: flex;
          align-items: center;
          gap: 0.375em;
          color: var(--clr-text);
          padding-inline: var(--size-050);
          height: 2.375rem;
        `}
      >
        <img
          src={logo}
          alt="Myfye"
          css={css`
            width: auto;
            height: calc(1.4em * var(--line-height-heading));
            transform: translateY(-0.2rem);
          `}
        />
        <span>Portfolio</span>
      </h2>
      <DonutChart3D options={donutChartOptions} />
    </div>
  );
};
export default Portfolio;
