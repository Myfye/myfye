import { Point } from "highcharts";
import { Series } from "highcharts";

export function walletPieChartLabelFormatter(this: Point | Series) {
  if (this instanceof Series) return "";
  return (
    "<span class='legend'>" +
    "<span class='currency'>" +
    `<span>${this.name} ${Math.round(this?.percentage ?? 0)}%</span>` +
    "</span>" +
    "<span class='balance'>" +
    new Intl.NumberFormat("en-EN", {
      style: "currency",
      currency: "usd",
    }).format(this?.y ?? 0) +
    "</span>" +
    "<span>"
  );
}
