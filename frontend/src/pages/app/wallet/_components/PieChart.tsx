import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PieChart = ({ options }: { options: Highcharts.Options }) => (
  <HighchartsReact highcharts={Highcharts} options={options} />
);

export default PieChart;
