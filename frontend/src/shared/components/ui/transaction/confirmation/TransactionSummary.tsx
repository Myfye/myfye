import { css } from "@emotion/react";
import { IconCardProps } from "../../card/IconCard";
import TransactionFlowIndicator from "./TransactionFlowIndicator";

interface TransactionSummaryProps {
  inputIcon: string;
  outputIcon: string;
  title: string;
  subtitle: string;
}
const TransactionSummary = ({
  inputIcon,
  outputIcon,
  title,
  subtitle,
}: TransactionSummaryProps) => {
  return (
    <div className="transaction-summary" css={css``}>
      <TransactionFlowIndicator inputIcon={inputIcon} outputIcon={outputIcon} />
      <div
        css={css`
          margin-block-start: var(--size-200);
        `}
      >
        <h2
          className="heading-x-large"
          css={css`
            text-align: center;
          `}
        >
          {title}
        </h2>
        <p
          className="caption"
          css={css`
            color: var(--clr-text-weak);
            margin-block-start: var(--size-100);
            text-align: center;
          `}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default TransactionSummary;
