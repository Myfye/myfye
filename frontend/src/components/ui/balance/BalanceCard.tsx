import { FiatCurrency } from "@/features/assets/types";
import { css } from "@emotion/react";
import Balance from "./Balance";

const BalanceCard = ({
  balance,
  currency = "usd",
}: {
  balance: number;
  currency?: FiatCurrency;
}) => (
  <div
    className="balance-card"
    css={css`
      background-color: var(--clr-surface-raised);
      padding: var(--size-150);
      border-radius: var(--border-radius-medium);
    `}
  >
    <Balance balance={balance} currency={currency} />
  </div>
);

export default BalanceCard;
