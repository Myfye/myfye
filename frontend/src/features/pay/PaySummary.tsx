import { ArrowDown } from "@phosphor-icons/react";

import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatUsdAmount, getUsdAmount } from "./utils";
import { AbstractedAsset, Asset } from "../assets/types";
import { selectAbstractedAsset } from "../assets/assetsSlice";
import Avatar from "@/components/ui/avatar/Avatar";

const AssetSection = ({
  abstractedAssetId,
  amount,
}: {
  abstractedAssetId: AbstractedAsset["id"] | null;
  amount: number | null;
}) => {
  const assets = useSelector((state: RootState) => state.assets);

  const abstractedAsset = useSelector((state: RootState) =>
    abstractedAssetId === null
      ? null
      : selectAbstractedAsset(state, abstractedAssetId)
  );

  const usdAmount = getUsdAmount(abstractedAssetId, assets, amount);

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
          <img src={abstractedAsset?.icon.content} alt="" />
        </div>
        <p className="heading-small">{abstractedAsset?.label}</p>
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
          {amount} {abstractedAsset?.symbol}
        </p>
      </div>
    </div>
  );
};

const UserSection = ({ user }) => {
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
          <Avatar />
        </div>
        <p className="heading-small">{user?.name}</p>
        <p>{user?.email || user?.phone_number}</p>
      </div>
    </div>
  );
};

const PaySummary = () => {
  const transaction = useSelector((state: RootState) => state.pay.transaction);
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
      <section>
        {transaction.type === "send" ? (
          <AssetSection abstractedAssetId={"us_dollar_yield"} amount={0} />
        ) : (
          <UserSection user={transaction.user}></UserSection>
        )}
      </section>
      <section
        className="icon-wrapper"
        css={css`
          padding-inline-start: 0.675rem;
        `}
      >
        <ArrowDown color="var(--clr-icon)" size={20} />
      </section>
      <section>
        {transaction.type === "send" ? (
          <UserSection user={transaction.user}></UserSection>
        ) : (
          <AssetSection abstractedAssetId={"us_dollar_yield"} amount={0} />
        )}
      </section>
    </div>
  );
};

export default PaySummary;
