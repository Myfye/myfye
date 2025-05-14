import { css } from "@emotion/react";
import logo from "@/assets/logo/myfye_logo.svg";
import StockChart from "./StockChart";

import mockData from "@/assets/mock_stock_data.csv?url";

const PerformanceTab = () => {
  const stockChartOptions: Highcharts.Options = {
    chart: {
      height: 210,
      backgroundColor: "transparent",
      spacingBottom: 0,
      spacingLeft: 6,
      spacingRight: 0,
      spacingTop: 4,
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
    colors: ["var(--clr-green-300)"],
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
    <div
      css={css`
        padding-block-start: var(--size-150);
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
          padding-inline: calc(var(--size-150) + var(--size-050));
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
        <span>Performance</span>
      </h2>
      <StockChart options={stockChartOptions} />
    </div>
  );
};
export default PerformanceTab;
