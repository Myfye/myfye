import { FiatCurrency } from "@/features/assets/types";
import { formatBalance } from "@/features/assets/utils";
import { css } from "@emotion/react";
import { useMemo } from "react";

const Balance = ({
  balance,
  currency = "usd",
}: {
  balance: number;
  currency?: FiatCurrency;
}) => {
  const formattedBalance = useMemo(
    () => formatBalance(balance, currency),
    [balance, currency]
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
          color: var(--clr-text-weaker);
        `}
      >
        Balance
      </h1>
      <p
        className="heading-xx-large"
        css={css`
          margin-block-start: var(--size-050);
        `}
      >
        {formattedBalance}
      </p>
    </hgroup>
  );
};

export default Balance;
