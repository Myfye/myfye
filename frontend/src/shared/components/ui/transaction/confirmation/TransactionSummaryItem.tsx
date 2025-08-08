import { css } from "@emotion/react";
import WalletIcon from "../../icons/WalletIcon";
import { formatAmountWithCurrency } from "@/shared/utils/currencyUtils";
import AssetIcon from "../../icons/AssetIcon";

export interface TransactionSummaryItemProps {
  label: string;
  icon: "wallet" | string;
  amount: number;
  amountInFiat?: number;
  fiatCurrency?: string;
  tokenSymbol: string;
  type?: "input" | "output";
}
const TransactionSummaryItem = ({
  label,
  amount,
  amountInFiat,
  icon,
  fiatCurrency = "usd",
  tokenSymbol,
  type,
}: TransactionSummaryItemProps) => {
  return (
    <div
      className={`transaction-summary-item-${type}`}
      css={css`
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: var(--size-150);
        `}
      >
        {icon === "wallet" ? <WalletIcon /> : <AssetIcon src={icon} />}
        <span
          css={css`
            font-size: var(--fs-large);
            font-weight: var(--fw-active);
          `}
        >
          {label}
        </span>
      </div>
      {amount && (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: var(--size-025);
            text-align: end;
          `}
        >
          <span className="heading-small">
            {amountInFiat
              ? formatAmountWithCurrency(amountInFiat, fiatCurrency)
              : amount}
          </span>
          {tokenSymbol && (
            <span
              className="caption-small"
              css={css`
                text-transform: uppercase;
                color: var(--clr-text-weaker);
              `}
            >
              {amount} {tokenSymbol}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionSummaryItem;
