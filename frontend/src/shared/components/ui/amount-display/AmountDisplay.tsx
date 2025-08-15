import { getFiatCurrencySymbol } from "@/shared/utils/currencyUtils";
import { css } from "@emotion/react";
import { ReactNode } from "react";
import FeeDisplay from "./FeeDisplay";

export interface AmountDisplayProps {
  amount: string | number;
  fiatCurrency?: "usd" | "euro" | "mxn" | "brl" | null;
  fee?: number;
  children?: ReactNode;
}

const AmountDisplay = ({
  amount = "0",
  fee,
  fiatCurrency = "usd",
  children,
}: AmountDisplayProps) => {
  const amountArr = (
    typeof amount === "string" ? amount : amount.toString()
  ).split("");

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
      <div
        css={css`
          position: relative;
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
        {fee ? <FeeDisplay fee={fee} fiatCurrency={fiatCurrency} /> : null}
      </div>
      {children}
    </div>
  );
};

export default AmountDisplay;
