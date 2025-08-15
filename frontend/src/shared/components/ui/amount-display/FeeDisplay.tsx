import { css } from "@emotion/react";

const FeeDisplay = ({
  fee,
  fiatCurrency,
}: {
  fee: number;
  fiatCurrency?: "usd" | "euro" | "mxn" | "brl" | null;
}) => {
  return (
    <span
      css={css`
        display: block;
        width: 100cqw;
        position: absolute;
        top: calc(100% + var(--size-150));
        left: 50%;
        transform: translate(-50%);
        font-size: var(--fs-medium);
        color: var(--clr-text-weak);
        text-align: center;
      `}
    >
      {"+" +
        " " +
        new Intl.NumberFormat("en-EN", {
          currency: fiatCurrency ?? "usd",
          style: "currency",
        }).format(fee)}
    </span>
  );
};

export default FeeDisplay;
