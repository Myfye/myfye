import { formatAmountWithCurrency } from "@/shared/utils/currencyUtils";
import { css } from "@emotion/react";
import Highcharts, { Point } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-3d";

export type PieChart3DProps = {
  name: string;
  data: Highcharts.PointOptionsObject[];
};

const generateOptions = ({
  name,
  data,
}: PieChart3DProps): Highcharts.Options => {
  const options = {
    chart: {
      className: "pie-chart-3d",
      type: "pie",
      width: 320,
      height: 300,
      backgroundColor: "transparent",
      spacing: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
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
      text: `<span class='visually-hidden'>Myfye ${name}</span>`,
      useHTML: true,
    },
    tooltip: {
      useHTML: true,
      shadow: false,
      className: "pie-chart-3d-tooltip",
      formatter: function () {
        const point = this;
        return `<span class="point-label">
        <span class="name">${point.name}</span>
        <br/>
        <span class="amount">
        <span>${formatAmountWithCurrency(point.y ?? 0)}</span>
      `;
      },
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
        if (this instanceof Point) {
          return (
            "<span class='legend'>" +
            "<span class='currency'>" +
            `<span>${this.name} ${Math.round(this?.percentage ?? 0)}%</span>` +
            "</span>" +
            "<span class='balance'>" +
            formatAmountWithCurrency(this?.y ?? 0) +
            "</span>" +
            "<span>"
          );
        } else {
          return "";
        }
      },
    },
    series: [
      {
        type: "pie",
        name,
        data,
      },
    ],
  } satisfies Highcharts.Options;
  return options;
};

const PieChart3D = ({ name, data }: PieChart3DProps) => {
  const options = generateOptions({ name, data });
  return (
    <div
      className="pie-chart-3d-wrapper"
      css={css`
        height: 200px;
        overflow: hidden;
      `}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChart3D;
