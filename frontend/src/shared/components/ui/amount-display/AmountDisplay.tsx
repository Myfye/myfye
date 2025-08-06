import { getFiatCurrencySymbol } from "@/shared/utils/currencyUtils";
import { css } from "@emotion/react";

interface AmountDisplayProps {
  amount: string[] | string;
  fiatCurrency: "usd" | "euro";
}

const AmountDisplay = ({
  amount,
  fiatCurrency = "usd",
}: AmountDisplayProps) => {
  if (!amount) throw new Error("Could not find amount");
  amount = Array.isArray(amount) ? amount : amount.split("");

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
        {amount.map((val, i) => {
          return <span key={`value-${i}`}>{val}</span>;
        })}
      </p>
    </div>
  );
};

export default AmountDisplay;
