import { css } from "@emotion/react";
import ButtonGroup from "../../button/ButtonGroup";
import ButtonGroupItem from "../../button/ButtonGroupItem";
import TransactionSummary from "./TransactionSummary";
import { TransactionSummaryItemProps } from "./TransactionSummaryItem";

interface TransactionConfirmationScreenProps {
  /** Heading ID for accessibility, since Overlay requires a heading ID if not using default title */
  headingId: string;
  /** Input props */
  input: Omit<TransactionSummaryItemProps, "type">;
  /** Output props */
  output: Omit<TransactionSummaryItemProps, "type">;
  /** Total fee for transaction */
  fee?: number;
  /** Confirm the transaction */
  onConfirm?: () => void;
  /** Cancel the transaction */
  onCancel?: () => void;
  /** Title */
  title: string;
}
const TransactionConfirmationScreen = ({
  headingId,
  input,
  output,
  fee,
  onCancel,
  onConfirm,
  title,
}: TransactionConfirmationScreenProps) => {
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
          margin-block-start: var(--size-300);
          padding-inline: var(--size-250);
        `}
      >
        <h1
          id={headingId}
          className="heading-x-large"
          css={css`
            margin-block-end: var(--size-400);
          `}
        >
          {title}
        </h1>
        <TransactionSummary input={input} output={output} />
      </section>
      <section
        css={css`
          padding-inline: var(--size-250);
          margin-block-start: var(--size-400);
        `}
      >
        <ul
          css={css`
            width: 100%;
            color: var(--clr-text);
            line-height: var(--line-height-tight);
            > * + * {
              margin-block-start: var(--size-200);
            }
          `}
        >
          {fee && (
            <li
              css={css`
                display: flex;
                justify-content: space-between;
              `}
            >
              <span className="heading-small">Fee</span>
              <span
                css={css`
                  font-size: var(--fs-medium);
                  color: var(--clr-text);
                `}
              >
                {new Intl.NumberFormat("en-EN", {
                  style: "currency",
                  currency: "usd",
                }).format(fee)}
              </span>
            </li>
          )}
        </ul>
      </section>
      <section
        css={css`
          margin-block-start: auto;
          margin-bottom: var(--size-250);
          padding-inline: var(--size-250);
        `}
      >
        <ButtonGroup expand scroll={false}>
          {onCancel && (
            <ButtonGroupItem onPress={onCancel} color="neutral">
              Cancel
            </ButtonGroupItem>
          )}
          <ButtonGroupItem onPress={onConfirm}>Confirm</ButtonGroupItem>
        </ButtonGroup>
      </section>
    </div>
  );
};

export default TransactionConfirmationScreen;
