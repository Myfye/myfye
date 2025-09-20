import HighchartsReact, {
  HighchartsReactRefObject,
} from "highcharts-react-official";
import Highcharts from "highcharts";
import { css } from "@emotion/react";
import "./style.css";
import { useEffect, useRef } from "react";

Highcharts.AST.allowedTags.push("svg");
Highcharts.AST.allowedAttributes.push("viewBox");

const APY = 0.041;
const PRINCIPAL = 1000;

const monthlyRate = Math.pow(1 + APY, 1 / 12) - 1;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getMonthsArr = () => {
  const date = new Date();
  date.setDate(1);
  const monthsArr = [];
  for (let i = 0; i <= 11; i++) {
    date.setMonth(date.getMonth() + 1);
    monthsArr.push(months[date.getMonth()] + " " + date.getFullYear());
  }
  return monthsArr;
};

const xAxisValues = getMonthsArr();

const yAxisValues = Array.from({ length: 12 }, (_, i) => i + 1).map(
  (val) => Math.round(1e2 * PRINCIPAL * Math.pow(1 + monthlyRate, val)) / 1e2
);

const options = {
  title: {
    text: "You earn at 4.1% APY",
    useHTML: true,
    align: "left",
    style: {
      fontSize: "var(--fs-medium)",
      fontWeight: "var(--fw-heading)",
      fontFamily: "var(--font-family)",
      color: "var(--clr-text)",
    },
  },
  series: [
    {
      data: yAxisValues,
      type: "column",
    },
  ],
  plotOptions: {
    column: {
      animation: {
        defer: 100,
      },
      pointWidth: 18,
      borderRadius: 6,
      stickyTracking: true,
    },
  },
  xAxis: {
    categories: xAxisValues,
    lineWidth: 0,
    gridLineWidth: 0,
    tickWidth: 0,
    labels: {
      enabled: false,
    },
    title: {
      text: "USD Amount",
    },
  },
  yAxis: {
    className: "earn-value",
    min: 1000,
    lineWidth: 0,
    gridLineWidth: 0,
    tickWidth: 0,
    labels: {
      enabled: false,
    },
    title: {
      text: "Month",
    },
  },
  chart: {
    backgroundColor: "var(--clr-surface-raised)",
    borderColor: "transparent",
    className: "earn-column-chart",
    margin: 0,
    spacing: [0, 0, 0, 0],
    height: 200,
  },
  credits: {
    enabled: false,
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    useHTML: true,
    shadow: false,
    className: "column-tooltip",
    distance: 10,
    followTouchMove: true,
    formatter: function () {
      const point = this;
      return `<span class="point-label">
      <span class="date">${point.category}</span>
      <br/>
      <span class="amount">
      <span>${new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency: "usd",
      }).format(point.y ?? 0)}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#f4f6f9" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm37.66-101.66a8,8,0,0,1-11.32,11.32L136,107.31V168a8,8,0,0,1-16,0V107.31l-18.34,18.35a8,8,0,0,1-11.32-11.32l32-32a8,8,0,0,1,11.32,0Z"></path></svg>
           </span>
      </span>`;
    },
  },
} satisfies Highcharts.Options;

const ColumnChart = () => {
  const ref = useRef<HighchartsReactRefObject>(null!);
  // useEffect(() => {
  //   const highlightPoint = (e: TouchEvent | MouseEvent) => {
  //     // Find coordinates within the chart
  //     const event = ref.current.chart.pointer.normalize(e);

  //     // Get the hovered point
  //     const point = ref.current.chart.series[0].searchPoint(event, true);

  //     if (point) console.log(point);
  //   };

  //   const unfocusChart = (e: TouchEvent | MouseEvent) => {};

  //   document.addEventListener("mousemove", highlightPoint);
  //   document.addEventListener("touchmove", highlightPoint);
  //   document.addEventListener("touchstart", highlightPoint);
  //   document.addEventListener("touchend", unfocusChart);
  // }, []);
  return (
    <HighchartsReact ref={ref} highcharts={Highcharts} options={options} />
  );
};

export default ColumnChart;
