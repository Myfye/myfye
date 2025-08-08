import { css } from "@emotion/react";
import TransactionFlowIndicator from "./TransactionFlowIndicator";
import TransactionSummaryItem, {
  TransactionSummaryItemProps,
} from "./TransactionSummaryItem";

interface TransactionSummaryProps {
  input: Omit<TransactionSummaryItemProps, "type">;
  output: Omit<TransactionSummaryItemProps, "type">;
}
const TransactionSummary = ({ input, output }: TransactionSummaryProps) => {
  return (
    <div
      className="transaction-summary"
      css={css`
        display: flex;
        flex-direction: column;
        gap: var(--size-200);
        background-color: var(--clr-surface-raised);
        padding: var(--size-200);
        border-radius: var(--border-radius-medium);
      `}
    >
      <TransactionSummaryItem {...input} type="input" />
      <TransactionFlowIndicator />
      <TransactionSummaryItem {...output} type="output" />
    </div>
  );
};

export default TransactionSummary;
