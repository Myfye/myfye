import Highcharts from "highcharts/highstock";
import "highcharts/modules/data";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-3d";
import "./stock_chart.css";

const StockChart = ({ options }: { options: Highcharts.Options }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={options}
    constructorType="stockChart"
  />
);

export default StockChart;
