import useBalance from "@/hooks/useBalance";
import { ResponsivePie } from "@nivo/pie";
import { useMemo } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "../button/Button";

const headingStyle = {
  fontWeight: "500",
  fontFamily: "Inter",
  fill: "var(--clr-text)",
  fontSize: 18,
};
const captionStyle = {
  fontWeight: "normal",
  fontFamily: "Inter",
  fill: "var(--clr-text-weaker)",
  fontSize: 14,
};
const heading2Style = {
  fontWeight: "500",
  fontFamily: "Inter",
  fill: "var(--clr-text)",
  fontSize: 16,
};

const BalanceTitle = ({ centerX, centerY }) => {
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
        style={headingStyle}
      >
        {formattedBalance}
      </text>
      <text
        textAnchor="middle"
        x={centerX}
        y={centerY + 18}
        style={captionStyle}
      >
        Net worth
      </text>
    </>
  );
};

const EarnTitle = ({ centerX, centerY }) => {
  return (
    <>
      <text
        textAnchor="middle"
        x={centerX}
        y={centerY - 5}
        style={heading2Style}
      >
        Earn
      </text>
      <text
        textAnchor="middle"
        x={centerX}
        y={centerY + 17}
        style={heading2Style}
      >
        Breakdown
      </text>
    </>
  );
};

const PieChart = ({ type, data }) => (
  <div
    className="pie-chart-wrapper"
    css={css`
      width: 100%;
      height: 16rem;
      overflow: visible;
      position: relative;
    `}
  >
    <ResponsivePie
      data={data}
      layers={[
        "arcs",
        "arcLinkLabels",
        "arcLabels",
        "legends",
        type === "earn" ? EarnTitle : BalanceTitle,
      ]}
      margin={{ top: 24, right: 160, bottom: 24, left: 0 }}
      valueFormat={type === "earn" ? " >-.0%" : " >-$"}
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
      arcLabel={(e) => {
        return type === "earn"
          ? String(e.value)
          : String(
              new Intl.NumberFormat("en-EN", {
                style: "currency",
                currency: `usd`,
              }).format(e.value)
            );
      }}
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
          translateX: type === "earn" ? 0 : 130,
          translateY: 0,
          itemsSpacing: 8,
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
    <div
      className="button-wrapper"
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
        inset: 0;
        margin: auto;
        left: auto;
        right: var(--size-200);
      `}
    >
      {type === "earn" && (
        <Button size="small" color="neutral">
          View data
        </Button>
      )}
    </div>
  </div>
);

export default PieChart;
