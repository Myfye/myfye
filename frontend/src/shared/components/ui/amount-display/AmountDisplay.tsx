import { getFiatCurrencySymbol } from "@/shared/utils/currencyUtils";
import { css } from "@emotion/react";
import { ReactNode } from "react";

interface AmountDisplayProps {
  amount: string;
  fiatCurrency?: "usd" | "euro" | "mxn" | "brl" | null;
  children?: ReactNode;
}

const AmountDisplay = ({
  amount = "0",
  fiatCurrency = "usd",
  children,
}: AmountDisplayProps) => {
  const amountArr = amount.split("");

  const symbol = getFiatCurrencySymbol(fiatCurrency);
  return (
    <div
      className="amount-display"
      css={css`
        display: grid;
        place-items: center;
        height: 100%;
        isolation: isolate;
        position: relative;
      `}
    >
      <p
        css={css`
          color: var(--clr-text);
          line-height: var(--line-height-tight);
          font-size: 3rem;
          font-weight: var(--fw-heading);
        `}
      >
        {symbol && <span>{symbol}</span>}
        {amountArr.map((val, i) => {
          return <span key={`value-${i}`}>{val}</span>;
        })}
      </p>
      {children}
    </div>
  );
};

export default AmountDisplay;
