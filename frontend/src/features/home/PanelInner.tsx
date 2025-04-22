import { css } from "@emotion/react";
import { AbstractedAsset } from "../assets/types";
import Balance from "@/components/ui/balance/Balance";
import AssetCardList from "../assets/cards/AssetCardList";

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
      <div
        className="balance-container"
        css={css`
          padding: var(--size-150);
          background-color: var(--clr-surface-raised);
          border-radius: var(--border-radius-medium);
        `}
      >
        <Balance balance={balance} />
      </div>
    </section>
    <section
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
