import { css } from "@emotion/react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/data";
import mockData from "@/assets/mock_stock_data.csv?url";

export type StockChartProps = {
  name: string;
  data?: string;
};

const generateOptions = ({
  name,
  data,
}: StockChartProps): Highcharts.Options => {
  const options = {
    chart: {
      className: "stock-chart",
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
        x: 0,
        y: 8,
      },
      outside: false,
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
    title: {
      text: `<span class='visually-hidden'>Myfye ${name}</span>`,
      useHTML: true,
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
    colors: ["var(--clr-primary)"],
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
  } satisfies Highcharts.Options;
  return options;
};

const StockChart = ({ name, data }: StockChartProps) => {
  const options = generateOptions({ name, data });
  return (
    <div
      className="stock-chart-wrapper"
      css={css`
        overflow: hidden;
      `}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType="stockChart"
      />
    </div>
  );
};

export default StockChart;
