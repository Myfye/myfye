/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useMemo } from "react";

const BalanceTitle = ({ balance = 0, currency = "usd" }) => {
  const formattedBalance = useMemo(
    () =>
      new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency: `${currency}`,
      }).format(balance),
    [balance]
  );
  return (
    <hgroup
      css={css`
        text-align: start;
      `}
    >
      <h1
        css={css`
          font-size: var(--fs-small);
          color: var(--clr-text-weak);
        `}
      >
        Balance
      </h1>
      <p
        className="heading-x-large"
        css={css`
          margin-block-start: var(--size-050);
        `}
      >
        {formattedBalance}
      </p>
    </hgroup>
  );
};

export default BalanceTitle;
