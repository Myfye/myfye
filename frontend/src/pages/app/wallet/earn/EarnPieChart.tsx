import { formatAmountWithCurrency } from "@/shared/utils/currencyUtils";
import Highcharts, { PointOptionsObject } from "highcharts";
import HighchartsReact from "highcharts-react-official";

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
] satisfies PointOptionsObject[];

const options = {
  chart: {
    className: "earn-pie-chart",
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
    useHTML: true,
    shadow: false,
    className: "pie-chart-tooltip",
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
    enabled: false,
  },
  series: [
    {
      name: "Earn breakdown",
      type: "pie",
      data: pieChartData,
    },
  ],
} satisfies Highcharts.Options;

const EarnPieChart = () => {
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default EarnPieChart;
