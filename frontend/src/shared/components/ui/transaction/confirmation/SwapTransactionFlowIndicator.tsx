import { css } from "@emotion/react";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/ssr";

const SwapTransactionFlowIndicator = () => {
  return (
    <div
      className="swap-transaction-flow-indicator"
      css={css`
        display: grid;
        place-items: center;
        width: 2.75rem;
      `}
    >
      <ArrowDownIcon color="var(--clr-icon)" size={20} />
    </div>
  );
};

export default SwapTransactionFlowIndicator;
