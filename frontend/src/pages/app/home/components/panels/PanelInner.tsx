import { css } from "@emotion/react";
import { AbstractedAsset } from "../../../../../features/assets/types";
import Balance from "@/components/ui/balance/Balance";
import AssetCardList from "../../../../../features/assets/cards/AssetCardList";
import BalanceCard from "@/components/ui/balance/BalanceCard";

const AssetPanel = ({
  balance,
  assets,
}: {
  balance: number;
  assets: AbstractedAsset[];
}) => (
  <div
    className="panel-inner"
    css={css`
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100cqh;
      gap: var(--size-300);
      padding-inline: var(--size-250);
    `}
  >
    <section
      css={css`
        padding-block-start: var(--size-200);
      `}
    >
      <BalanceCard balance={balance} />
    </section>
    <section
      className="no-scrollbar"
      css={css`
        overflow-y: auto;
        padding-block-end: var(--size-250);
      `}
    >
      <AssetCardList assets={assets} showOptions={true} />
    </section>
  </div>
);
export default AssetPanel;
