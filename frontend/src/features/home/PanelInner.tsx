import { css } from "@emotion/react";
import { Asset } from "../wallet/assets/types";
import Balance from "@/components/ui/balance/Balance";
import AssetCardList from "../wallet/assets/cards/AssetCardList";

const AssetPanel = ({
  balance,
  assets,
}: {
  balance: number;
  assets: Asset[];
}) => (
  <div className="panel-inner">
    <section
      className="balance-container"
      css={css`
        margin-block-start: var(--size-250);
        padding: 0 var(--size-250);
      `}
    >
      <Balance balance={balance} />
    </section>
    <section
      css={css`
        margin-block-start: var(--size-300);
        padding: 0 var(--size-250);
      `}
    >
      <div
        css={css`
          max-height: 25rem;
          overflow-y: auto;
        `}
      >
        <AssetCardList assets={assets} showOptions={true} />
      </div>
    </section>
  </div>
);
export default AssetPanel;
