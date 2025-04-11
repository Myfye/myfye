import { ResponsivePie } from "@nivo/pie";
import { css } from "@emotion/react";

const EarnBreakdownModalPieChart = ({ data }) => (
  <div
    className="pie-chart-wrapper"
    css={css`
      width: 100%;
      height: 13rem;
      position: relative;
    `}
  >
    <ResponsivePie
      data={data}
      layers={["arcs", "arcLinkLabels", "arcLabels", "legends"]}
      margin={{ top: 4, right: 0, bottom: 4, left: 0 }}
      valueFormat={" >-.0%"}
      innerRadius={0.55}
      padAngle={0.7}
      cornerRadius={4}
      activeOuterRadiusOffset={4}
      colors={[...data.map((item) => item.color)]}
      enableArcLinkLabels={false}
      enableArcLabels={false}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLinkLabel={(datum) => `${datum.id} ${datum.value}`}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      theme={{
        background: "var(--clr-surface)",
        text: {
          fontSize: 12,
          fill: "var(--clr-text)",
          fontFamily: "var(--font-family)",
          fontWeight: "var(--fw-active)",
        },
      }}
    />
  </div>
);

export default EarnBreakdownModalPieChart;
