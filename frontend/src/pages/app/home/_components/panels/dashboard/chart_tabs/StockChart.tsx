import Highcharts from "highcharts/highstock";
import "highcharts/modules/data";
import HighchartsReact from "highcharts-react-official";

const StockChart = ({ options }: { options: Highcharts.Options }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={options}
    constructorType="stockChart"
  />
);

export default StockChart;
