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
import { formatUsdAmount, getUsdAmount } from "./utils";
import { Asset } from "../wallet/assets/types";

const SwapAsset = ({
  assetId,
  amount,
}: {
  assetId: Asset["id"] | null;
  amount: number | null;
}) => {
  const assets = useSelector((state: RootState) => state.assets);

  // let usdBalance = 0;
  // let type = "usdt";

  // if (usdtSolBalance > usdcSolBalance) {
  //   usdBalance = usdtSolBalance;
  //   type = "usdt_sol";
  // } else {
  //   usdBalance = usdcSolBalance;
  //   type = "usdc_sol";
  // }

  const usdAmount = useMemo(
    () => getUsdAmount(assetId, assets, amount),
    [amount, assetId, assets]
  );

  const formattedUsdAmount = useMemo(
    () => formatUsdAmount(usdAmount),
    [usdAmount]
  );

  const currentCoin = () => {
    switch (assetId) {
      case "btc_sol": {
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
      case "usdc_sol": {
        return {
          title: "US Dollar",
          type: "usd",
          icon: usdCoin,
        };
      }
      case "usdt_sol": {
        return {
          title: "US Dollar",
          type: "usd",
          icon: usdCoin,
        };
      }
      case "usdy_sol": {
        return {
          title: "US Treasury Bonds",
          type: "usdy",
          icon: usdyCoin,
        };
      }
      case "eurc_sol": {
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

  const _coin = useMemo(() => currentCoin(), [assetId]);
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
        <p className="heading-small">{formattedUsdAmount}</p>
        <p
          className="caption-small"
          css={css`
            text-transform: uppercase;
            margin-block-start: var(--size-025);
            color: var(--clr-text-weaker);
          `}
        >
          {amount} {_coin.type}
        </p>
      </div>
    </div>
  );
};

const SwapAssetsSummary = () => {
  const buyInfo = useSelector((state: RootState) => state.swap.transaction.buy);
  const sellInfo = useSelector(
    (state: RootState) => state.swap.transaction.sell
  );

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
        <SwapAsset assetId={sellInfo.assetId} amount={sellInfo.amount} />
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
        <SwapAsset assetId={buyInfo.assetId} amount={buyInfo.amount} />
      </section>
    </div>
  );
};

export default SwapAssetsSummary;
