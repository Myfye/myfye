import AssetCard from "./AssetCard";

import { css } from "@emotion/react";

import { AbstractedAsset } from "../types";

const AssetCardList = ({
  assets,
  showOptions = false,
  onAssetSelect,
  showBalance = true,
  showBalanceUSD = true,
  showCurrencySymbol = true,
}: {
  assets: AbstractedAsset[];
  showOptions?: boolean;
  onAssetSelect?: (asset: AbstractedAsset) => void;
  showBalance?: boolean;
  showBalanceUSD?: boolean;
  showCurrencySymbol?: boolean;
  radioGroup?: boolean;
}) => {
  return (
    <div className="asset-card-list-wrapper">
      <ul
        className="asset-card-list"
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: var(--size-150);
        `}
      >
        {assets
          // @ts-ignore update types to include balanceUSD TODO
          // Sort acscending -> descending
          .sort((a, b) => b.balanceUSD - a.balanceUSD)
          .map((asset: AbstractedAsset, i: number) => (
            <li
              key={`asset-card-${i}`}
              className="coin-card-wrapper"
              css={css`
                width: 100%;
              `}
            >
              <AssetCard
                id={asset.id}
                title={asset.label}
                symbol={asset.symbol}
                fiatCurrency={asset.fiatCurrency}
                // @ts-ignore update types to include balanceUSD TODO
                balance={showBalanceUSD ? asset.balanceUSD : asset.balance}
                showCurrencySymbol={showCurrencySymbol}
                icon={asset.icon}
                groupId={asset.groupId}
                // @ts-ignore need to check this one TODO
                onPress={() => onAssetSelect && onAssetSelect(asset)}
                showBalance={showBalance}
                showOptions={showOptions}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AssetCardList;
