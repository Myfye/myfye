import { ArrowDown } from "@phosphor-icons/react";

import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatUsdAmount, getUsdAmount } from "./utils";
import { Asset } from "../assets/types";
import { selectAsset } from "../assets/assetsSlice";

const SwapAsset = ({
  assetId,
  amount,
}: {
  assetId: Asset["id"] | null;
  amount: number | null;
}) => {
  const assets = useSelector((state: RootState) => state.assets);

  const asset = useSelector((state: RootState) =>
    assetId === null
      ? null
      : selectAsset(state, amountssetId)
  );

  // let usdBalance = 0;
  // let type = "usdt";

  // if (usdtSolBalance > usdcSolBalance) {
  //   usdBalance = usdtSolBalance;
  //   type = "usdt_sol";
  // } else {
  //   usdBalance = usdcSolBalance;
  //   type = "usdc_sol";
  // }

  const usdAmount = getUsdAmount(assetId, assets, amount);

  const formattedUsdAmount = formatUsdAmount(usdAmount);

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
            width: 2.75rem;
            border-radius: var(--border-radius-circle);
            overflow: hidden;
          `}
        >
          <img src={asset?.icon.content} alt="" />
        </div>
        <p className="heading-small">{asset?.label}</p>
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
          {amount} {asset?.symbol}
        </p>
      </div>
    </div>
  );
};

const SwapAssetsSummary = () => {
  const transaction = useSelector((state: RootState) => state.swap.transaction);
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
        <SwapAsset
          assetId={transaction.sell.assetId}
          amount={transaction.sell.amount}
        />
      </section>
      <section
        className="icon-wrapper"
        css={css`
          padding-inline-start: 0.675rem;
        `}
      >
        <ArrowDown color="var(--clr-icon)" size={20} />
      </section>
      <section className="buy-coin">
        <SwapAsset
          assetId={transaction.buy.assetId}
          amount={transaction.buy.amount}
        />
      </section>
    </div>
  );
};

export default SwapAssetsSummary;
