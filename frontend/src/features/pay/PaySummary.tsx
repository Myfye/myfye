import { ArrowDown } from "@phosphor-icons/react";
import { useEffect } from "react";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { formatUsdAmount, getUsdAmount } from "./utils";
import { Asset } from "../assets/types";
import { selectAsset } from "../assets/assetsSlice";
import Avatar from "@/shared/components/ui/avatar/Avatar";
import { User } from "../users/users.types";
import { RootState } from "@/redux/store";

const AssetSection = ({
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
      : selectAsset(state, assetId)
  );

  // To do: there is a bug with conversions.
  // Instead of converting we are just returning the native amount
  // const usdAmount = getUsdAmount(assetId, assets, amount);

  const transaction = useSelector((state: RootState) => state.pay.transaction);

  const formattedUsdAmount = formatUsdAmount(transaction.amount);

  useEffect(() => {
    console.log("pay Transaction", transaction);
  }, [transaction]);

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
          align-content: center;
          text-align: end;
        `}
      >
        <p className="heading-small">{formattedUsdAmount}</p>
      </div>
    </div>
  );
};

const UserSection = ({ user }: { user: User }) => {
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
        <p className="heading-small">
          {user?.first_name || user?.email || user?.phone_number}
        </p>
        {user?.first_name && <p>{user?.email || user?.phone_number}</p>}
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
        padding: var(--size-200);
        border-radius: var(--border-radius-medium);
      `}
    >
      <section>
        {transaction.type === "send" ? (
          <AssetSection
            assetId={transaction.assetId}
            amount={transaction.amount}
          />
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
          <AssetSection assetId={"us_dollar_yield"} amount={0} />
        )}
      </section>
    </div>
  );
};

export default PaySummary;
