import { css } from "@emotion/react";
import { Asset } from "../wallet/assets/types";
import BalanceTitle from "@/components/ui/balance-title/BalanceTitle";
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
      <BalanceTitle balance={balance} />
    </section>
    <section
      css={css`
        margin-block-start: var(--size-400);
        padding: 0 var(--size-250);
      `}
    >
      <AssetCardList assets={assets} showOptions={true} />
    </section>
  </div>
);
export default AssetPanel;
