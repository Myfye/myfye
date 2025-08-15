import { css } from "@emotion/react";
import IconCard, { IconCardProps } from "../../card/IconCard";
import SwapTransactionFlowIndicator from "./SwapTransactionFlowIndicator";

interface TransactionSummaryProps {
  input: IconCardProps;
  output: IconCardProps;
}
const SwapTransactionSummary = ({ input, output }: TransactionSummaryProps) => {
  return (
    <div
      className="transaction-summary"
      css={css`
        display: flex;
        flex-direction: column;
        gap: var(--size-050);
        background-color: var(--clr-surface-raised);
        padding: var(--size-200);
        border-radius: var(--border-radius-medium);
      `}
    >
      <IconCard
        height="3.25rem"
        icon={input.icon}
        leftContent={input.leftContent}
        rightContent={input.rightContent}
        backgroundColor="transparent"
        padding="0"
      />
      <SwapTransactionFlowIndicator />
      <IconCard
        height="3.25rem"
        icon={output.icon}
        leftContent={output.leftContent}
        rightContent={output.rightContent}
        backgroundColor="transparent"
        padding="0"
      />
    </div>
  );
};

export default SwapTransactionSummary;
