import { css } from "@emotion/react";
import SwapTransactionSummary from "./SwapTransactionSummary";
import { IconCardProps } from "../../card/IconCard";
import ButtonGroup from "../../button/ButtonGroup";
import ButtonGroupItem from "../../button/ButtonGroupItem";
import { formatAmountWithCurrency } from "@/shared/utils/currencyUtils";
import TransactionTable from "./TransactionTable";

interface SwapTransactionConfirmationScreenProps {
  /** Heading ID for accessibility, since Overlay requires a heading ID if not using default title */
  headingId: string;
  /** Input props */
  input: IconCardProps;
  /** Output props */
  output: IconCardProps;
  /** Total fee for transaction */
  fee?: number;
  /** Confirm the transaction */
  onConfirm?: () => void;
  /** Cancel the transaction */
  onCancel?: () => void;
  /** Title */
  title: string;
  isLoading?: boolean;
  total?: number;
}
const SwapTransactionConfirmationScreen = ({
  headingId,
  input,
  output,
  fee = 0,
  onCancel,
  onConfirm,
  isLoading = false,
  title,
  total = 0,
}: SwapTransactionConfirmationScreenProps) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100cqh;
      `}
    >
      <section
        css={css`
          margin-block-start: var(--size-400);
          padding-inline: var(--size-400);
        `}
      >
        <SwapTransactionSummary input={input} output={output} />
      </section>
      <section
        css={css`
          padding-inline: var(--size-400);
          margin-block-start: var(--size-500);
        `}
      >
        <TransactionTable
          items={[
            {
              key: "Fee",
              value: formatAmountWithCurrency(fee, "usd"),
            },
          ]}
        />
      </section>
      <section
        css={css`
          padding-inline: var(--size-400);
          margin-block-start: auto;
        `}
      >
      {/* Total temporarily disabled for */}
      {/*
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <span className="heading-medium" css={css``}>
            Total
          </span>
          <span className="heading-large">
            {formatAmountWithCurrency(total, "usd")}
          </span>
        </div>
        */}
      </section>
      <section
        css={css`
          margin-block-start: var(--size-400);
          margin-bottom: var(--size-250);
          padding-inline: var(--size-400);
        `}
      >
        <ButtonGroup expand>
          <ButtonGroupItem color="neutral" onPress={onCancel}>
            Cancel
          </ButtonGroupItem>
          <ButtonGroupItem onPress={onConfirm} isLoading={isLoading}>
            Confirm
          </ButtonGroupItem>
        </ButtonGroup>
      </section>
    </div>
  );
};

export default SwapTransactionConfirmationScreen;
