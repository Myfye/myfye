import { ArrowDown } from "@phosphor-icons/react";
import btcIcon from "@/assets/svgs/coins/btc-coin.svg";
import solIcon from "@/assets/svgs/coins/sol-coin.svg";
import eurcCoin from "@/assets/svgs/coins/eur-coin.svg";
import usdCoin from "@/assets/svgs/coins/usd-coin.svg";
import usdyCoin from "@/assets/svgs/coins/usdy-coin.svg";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useMemo } from "react";

const SwapCoin = ({ coin, amount }: { coin: string; amount: number }) => {
  const formattedAmount = useMemo(
    () =>
      new Intl.NumberFormat("en-EN", {
        currency: "usd",
        style: "currency",
      }).format(amount),
    [amount]
  );
  const currentCoin = (coin) => {
    switch (coin) {
      case "btc": {
        return {
          title: "Bitcoin",
          type: "btc",
          icon: btcIcon,
        };
      }
      case "sol": {
        return {
          title: "Solana",
          type: "sol",
          icon: solIcon,
        };
      }
      case "usdt": {
        return {
          title: "US Dollar",
          type: "usdt",
          icon: usdCoin,
        };
      }
      case "usdy": {
        return {
          title: "US Treasury Bonds",
          type: "usdy",
          icon: usdyCoin,
        };
      }
      case "eurc": {
        return {
          title: "Euro",
          type: "eurc",
          icon: eurcCoin,
        };
      }
      default: {
        return {
          title: "US Dollar",
          type: "usdt",
          icon: usdCoin,
        };
      }
    }
  };

  const _coin = useMemo(() => currentCoin(coin), [coin]);
  const src = _coin.icon;

  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 1fr auto;
        line-height: var(--line-height-tight);
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: var(--size-150);
        `}
      >
        <div
          css={css`
            width: var(--size-500);
          `}
        >
          <img src={src} alt="" />
        </div>
        <p className="heading-small">{_coin.title}</p>
      </div>
      <div
        css={css`
          text-align: end;
        `}
      >
        <p className="heading-small">{formattedAmount}</p>
        <p
          className="caption-small"
          css={css`
            text-transform: uppercase;
            margin-block-start: var(--size-025);
            color: var(--clr-text-weaker);
          `}
        >
          {_coin.type}
        </p>
      </div>
    </div>
  );
};

const SwapCoinSummary = () => {
  const buyInfo = useSelector((state: RootState) => state.swap.buy);
  const sellInfo = useSelector((state: RootState) => state.swap.sell);

  return (
    <div
      className="swap-coin-status"
      css={css`
        display: flex;
        flex-direction: column;
        gap: var(--size-200);
        background-color: var(--clr-surface-raised);
        box-shadow: var(--box-shadow-card);
        padding: var(--size-200);
        border-radius: var(--border-radius-medium);
      `}
    >
      <section className="sell-coin">
        <SwapCoin coin={sellInfo.coin} amount={sellInfo.amount} />
      </section>
      <section
        className="icon-wrapper"
        css={css`
          padding-inline-start: var(--size-100);
        `}
      >
        <ArrowDown color="var(--clr-icon)" size={24} />
      </section>
      <section className="buy-coin">
        <SwapCoin coin={buyInfo.coin} amount={buyInfo.amount} />
      </section>
    </div>
  );
};

export default SwapCoinSummary;
