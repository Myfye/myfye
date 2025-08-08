import { formatAmountWithCurrency } from "@/shared/utils/currencyUtils";
import { css } from "@emotion/react";

interface TransactionSummaryAssetProps {
  label: string;
  icon: string;
  amount: number;
  fiatCurrencySymbol: string;
  tokenSymbol: string;
}
const TransactionSummaryAsset = ({
  label,
  amount,
  icon,
  fiatCurrencySymbol,
  tokenSymbol,
}: TransactionSummaryAssetProps) => {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 1fr auto;
        line-height: var(--line-height-tight);
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: var(--size-150);
        `}
      >
        <div
          className="token-wrapper"
          css={css`
            width: 2.75rem;
            border-radius: var(--border-radius-circle);
            overflow: hidden;
          `}
        >
          <img src={icon} alt="" />
        </div>
        <p className="heading-small">{label}</p>
      </div>
      <div
        css={css`
          text-align: end;
        `}
      >
        <p className="heading-small">
          {formatAmountWithCurrency(amount, fiatCurrencySymbol)}
        </p>
        <p
          className="caption-small"
          css={css`
            text-transform: uppercase;
            margin-block-start: var(--size-025);
            color: var(--clr-text-weaker);
          `}
        >
          {amount} {tokenSymbol}
        </p>
      </div>
    </div>
  );
};

export default TransactionSummaryAsset;
