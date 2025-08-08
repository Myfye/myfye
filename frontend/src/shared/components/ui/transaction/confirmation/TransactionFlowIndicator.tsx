import { css } from "@emotion/react";
import { ArrowDown } from "@phosphor-icons/react";

const TransactionFlowIndicator = () => {
  return (
    <div
      className="icon-wrapper"
      css={css`
        padding-inline-start: 0.675rem;
      `}
    >
      <ArrowDown color="var(--clr-icon)" size={20} />
    </div>
  );
};

export default TransactionFlowIndicator;
