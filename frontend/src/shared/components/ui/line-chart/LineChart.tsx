import { ResponsiveLine, Serie } from "@nivo/line";
import { css } from "@emotion/react";
import DateSelect from "./DateSelect";
import { Key } from "react-aria";

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
    <div
      className="line-chart-container"
      css={css`
        height: 16rem;
        container: line-chart / size;
        display: grid;
        grid-template-rows: 1fr auto;
        overflow-x: hidden;
        gap: var(--size-200);
      `}
    >
      <div className="line-chart-wrapper">
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
            document
              .querySelector(".overlay-scroll")
              ?.classList.add("no-scroll-y");
          }}
          onTouchEnd={() => {
            document
              .querySelector(".overlay-scroll")
              ?.classList.remove("no-scroll-y");
          }}
        />
      </div>
      <div
        css={css`
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
