import { ArrowRightIcon } from "@phosphor-icons/react";
import { getIcon } from "../../card/IconCardInner";
import { css } from "@emotion/react";

interface TransactionFlowIndicatorProps {
  inputIcon: string;
  outputIcon: string;
}
const TransactionFlowIndicator = ({
  inputIcon,
  outputIcon,
}: TransactionFlowIndicatorProps) => {
  return (
    <div
      className="transaction-flow-indicator"
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--size-100);
      `}
    >
      {getIcon(inputIcon, "large")}
      <ArrowRightIcon size={20} />
      {getIcon(outputIcon, "large")}
    </div>
  );
};

export default TransactionFlowIndicator;
