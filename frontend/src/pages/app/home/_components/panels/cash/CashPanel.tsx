import CoinCardList from "../../CoinCardList";
import usDollarCoinIcon from "@/assets/svgs/coins/usd-coin.svg";
import euroCoinIcon from "@/assets/svgs/coins/eur-coin.svg";
import usdyCoinIcon from "@/assets/svgs/coins/usdy-coin.svg";
import BalanceTitle from "../../../../../../components/ui/balance-title/BalanceTitle";
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
        type: "usd",
        balance: usdBalance,
        img: usDollarCoinIcon,
      },
      {
        title: "Euro",
        currency: "eur",
        type: "eur",
        balance: eurcBalance,
        img: euroCoinIcon,
      },
      {
        title: "US Treasury Bonds",
        currency: "usd",
        type: "usdy",
        balance: usdyBalanceInUSD,
        img: usdyCoinIcon,
      },
    ],
    [usdBalance, usdyBalanceInUSD, eurcBalanceInUSD]
  );

  return (
    <div className="cash-panel">
      <section className="balance-container">
        <BalanceTitle balance={totalBalance} />
      </section>
      <section className="coins-container">
        <CoinCardList coins={coins} />
      </section>
    </div>
  );
};

export default CashPanel;
