import useBalance from "@/hooks/useBalance";
import { ResponsivePie } from "@nivo/pie";
import { useMemo } from "react";

const balanceStyle = {
  fontWeight: "500",
  fontFamily: "Inter",
  fill: "var(--clr-text)",
  fontSize: 18,
};
const netWorthStyle = {
  fontWeight: "normal",
  fontFamily: "Inter",
  fill: "var(--clr-text-weaker)",
  fontSize: 14,
};

const Title = ({ centerX, centerY }) => {
  const { totalBalanceInUSD } = useBalance();

  const formattedBalance = useMemo(
    () =>
      new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency: "usd",
      }).format(totalBalanceInUSD),
    [totalBalanceInUSD]
  );

  return (
    <>
      <text
        textAnchor="middle"
        x={centerX}
        y={centerY - 4}
        style={balanceStyle}
      >
        {formattedBalance}
      </text>
      <text
        textAnchor="middle"
        x={centerX}
        y={centerY + 21}
        style={netWorthStyle}
      >
        Net worth
      </text>
    </>
  );
};

const PieChart = ({ data }) => (
  <ResponsivePie
    data={data}
    layers={["arcs", "arcLinkLabels", "arcLabels", "legends", Title]}
    margin={{ top: 30, right: 90, bottom: 60, left: 0 }}
    valueFormat=" >-$"
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    colors={[...data.map((item) => item.color)]}
    enableArcLinkLabels={false}
    enableArcLabels={false}
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
        anchor: "right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 0,
        itemWidth: 100,
        itemHeight: 18,
        itemTextColor: "#999",
        itemDirection: "left-to-right",
        itemOpacity: 1,
        symbolSize: 18,
        symbolShape: "circle",
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
