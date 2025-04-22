import { AssetGroup, AssetsState, FiatCurrency } from "./types";

export const getAssetsBalanceUSDByGroup = (
  assets: AssetsState,
  groupId: AssetGroup["id"]
) => {
  const groupedAssets = getAssetsByGroup(assets, groupId);
  return groupedAssets.reduce((acc, val) => {
    const valueUsd = val.balance * val.exchangeRateUSD;
    return acc + valueUsd;
  }, 0);
};

export const getAssetsByGroup = (
  assets: AssetsState,
  groupId: AssetGroup["id"]
) => {
  const assetIds = assets.assetIds;
  const filteredAssetIds = assetIds.filter(
    (assetId) => assets.assets[assetId]?.groupId === groupId
  );
  const groupedAssets = filteredAssetIds.map(
    (assetId) => assets.assets[assetId]
  );
  return groupedAssets;
};

export const formatBalance = (
  balance: number,
  currency: FiatCurrency = "usd"
) =>
  new Intl.NumberFormat("en-EN", {
    currency: currency,
    style: "currency",
  }).format(balance);
