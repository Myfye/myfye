// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import { ResponsiveLine, Serie } from "@nivo/line";
import { css } from "@emotion/react";
import DateSelect from "./DateSelect";
import { Key } from "react-aria";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const LineChart = ({
  data,
  selectedDateRange,
  onDateRangeSelectionChange,
}: {
  data: readonly Serie[];
  selectedDateRange: Iterable<Key>;
  onDateRangeSelectionChange: (keys: Set<Key>) => void;
}) => {
  return (
    <div className="line-chart-container">
      <div
        className="line-chart-wrapper"
        css={css`
          width: 100%;
          height: 16rem;
          overflow-x: hidden;
        `}
      >
        <ResponsiveLine
          data={data}
          curve="cardinal"
          margin={{ top: 4, right: 0, bottom: 4, left: 0 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          yFormat=" >-.2f"
          colors={[...data.map((item) => item.color)]}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={null}
          enableGridX={false}
          enableGridY={false}
          lineWidth={3}
          enablePoints={false}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabel="data.yFormatted"
          pointLabelYOffset={-12}
          areaOpacity={0}
          enableTouchCrosshair={true}
          crosshairType="x"
          useMesh={true}
          legends={[]}
          motionConfig="default"
          onTouchStart={() => {
            console.log("HI");
            document
              .querySelector(".overlay-scroll")
              ?.classList.add("no-scroll");
          }}
          onTouchEnd={() => {
            document
              .querySelector(".overlay-scroll")
              ?.classList.remove("no-scroll");
          }}
        />
      </div>
      <div
        css={css`
          margin-block-start: var(--size-200);
          padding-inline: var(--size-250);
        `}
      >
        <DateSelect
          selectedDateRange={selectedDateRange}
          onDateRangeSelectionChange={onDateRangeSelectionChange}
        />
      </div>
    </div>
  );
};

export default LineChart;
