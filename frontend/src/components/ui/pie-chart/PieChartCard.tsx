import { css } from "@emotion/react";
import PieChart from "./PieChart";

const PieChartCard = ({ children, ...restProps }) => {
  return (
    <div
      className="pie-chart-card"
      css={css`
        position: relative;
        padding: var(--size-150);
        border-radius: var(--border-radius-medium);
        background-color: var(--clr-surface-raised);
      `}
    >
      <PieChart {...restProps} />
      {children}
    </div>
  );
};

export default PieChartCard;
