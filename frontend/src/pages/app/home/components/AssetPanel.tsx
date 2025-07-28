import { css } from "@emotion/react";
import { AbstractedAsset } from "@/features/assets/types";
import Balance from "@/shared/components/ui/balance/Balance";
import AssetCardList from "@/features/assets/cards/AssetCardList";

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
      padding-inline: var(--size-250);
      position: relative;
      isolation: isolate;
    `}
  >
    <section
      css={css`
        background-color: var(--clr-surface);
        padding-block-end: var(--size-300);
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
        padding-block-end: var(--size-250);
        z-index: 0;
      `}
    >
      <AssetCardList assets={assets} showOptions={true} />
    </section>
  </div>
);
export default AssetPanel;
