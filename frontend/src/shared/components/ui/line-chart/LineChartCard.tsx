import { css } from "@emotion/react";

const LineChartCard = ({ children }) => {
  return (
    <div
      className="line-chart-card"
      css={css`
        padding-block: var(--size-150);
        background-color: var(--clr-surface-raised);
        border-radius: var(--border-radius-medium);
      `}
    >
      {children}
    </div>
  );
};

export default LineChartCard;
