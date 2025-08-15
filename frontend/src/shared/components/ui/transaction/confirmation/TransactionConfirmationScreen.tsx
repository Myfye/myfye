import { css } from "@emotion/react";
import ButtonGroup from "../../button/ButtonGroup";
import ButtonGroupItem from "../../button/ButtonGroupItem";
import TransactionSummary from "./TransactionSummary";
import { IconCardProps } from "../../card/IconCard";
import { formatAmountWithCurrency } from "@/shared/utils/currencyUtils";
import TransactionTable from "./TransactionTable";

interface TransactionConfirmationScreenProps {
  /** Heading ID for accessibility, since Overlay requires a heading ID if not using default title */
  headingId: string;
  /** Input props */
  inputIcon: string;
  /** Output props */
  outputIcon: string;
  /** Total fee for transaction */
  fee?: number;
  /** Confirm the transaction */
  onConfirm?: () => void;
  /** Cancel the transaction */
  onCancel?: () => void;
  /** Title */
  title: string;
  subtitle: string;
  isLoading?: boolean;
  total?: number;
}
const TransactionConfirmationScreen = ({
  inputIcon,
  outputIcon,
  fee = 0,
  onCancel,
  onConfirm,
  isLoading = false,
  title,
  subtitle,
  total = 0,
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
          padding-inline: var(--size-400);
          margin-block-start: var(--size-400);
        `}
      >
        <TransactionSummary
          inputIcon={inputIcon}
          outputIcon={outputIcon}
          title={title}
          subtitle={subtitle}
        />
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

export default TransactionConfirmationScreen;
