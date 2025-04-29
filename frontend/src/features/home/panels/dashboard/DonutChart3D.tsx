import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-3d";

const DonutChart3D = ({ options }: { options: Highcharts.Options }) => (
  <HighchartsReact highcharts={Highcharts} options={options} />
);

export default DonutChart3D;
