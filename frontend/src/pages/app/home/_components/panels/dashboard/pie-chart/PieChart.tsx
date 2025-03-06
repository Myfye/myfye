import { ResponsivePie } from "@nivo/pie";

const PieChart = ({ data }) => (
  <ResponsivePie
    data={data}
    margin={{ top: 30, right: 0, bottom: 60, left: 0 }}
    valueFormat=" >-$"
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    colors={[...data.map((item) => item.color)]}
    enableArcLinkLabels={false}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: "color" }}
    arcLabel={(e) =>
      new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency: `usd`,
      }).format(e.value)
    }
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
      from: "color",
      modifiers: [["darker", 2]],
    }}
    legends={[
      {
        anchor: "bottom",
        direction: "row",
        justify: false,
        translateX: 0,
        translateY: 48,
        itemsSpacing: 0,
        itemWidth: 100,
        itemHeight: 18,
        itemTextColor: "var(--clr-text-neutral)",
        itemDirection: "left-to-right",
        itemOpacity: 1,
        symbolSize: 20,
        symbolShape: "circle",
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "var(--clr-text)",
            },
          },
        ],
      },
    ]}
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
);

export default PieChart;
