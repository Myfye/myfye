import CoinCardList from "../../../../../../components/ui/coin-card/CoinCardList";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
import { useMemo } from "react";

const CashPanel = ({
  usdBalance,
  usdyBalanceInUSD,
  eurcBalance,
  eurcBalanceInUSD,
}) => {
  const totalBalance = useMemo(
    () => usdBalance + usdyBalanceInUSD + eurcBalanceInUSD
  );

  const coins = useMemo(
    () => [
      {
        title: "US Dollar",
        currency: "usd",
        type: "usdt",
        balance: usdBalance,
      },
      {
        title: "Euro",
        currency: "eur",
        type: "eurc",
        balance: eurcBalance,
      },
      {
        title: "US Treasury Bonds",
        currency: "usd",
        type: "usdy",
        balance: usdyBalanceInUSD,
      },
    ],
    [usdBalance, usdyBalanceInUSD, eurcBalanceInUSD]
  );

  return (
    <div className="cash-panel">
      <section className="balance-container">
        <BalanceTitle balance={totalBalance} />
      </section>
      <section
        css={css`
          padding: 0 var(--size-250);
        `}
      >
        <CoinCardList coins={coins} />
      </section>
    </div>
  );
};

export default CashPanel;
