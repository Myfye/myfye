import { AssetGroup, AssetsState, FiatCurrency } from "../types/types";

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
  const filteredAssetIds = assetIds.filter((assetId) => {
    const _groupId = assets.assets[assetId]?.groupId;
    return Array.isArray(_groupId)
      ? _groupId.includes(groupId)
      : _groupId === groupId;
  });
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

export const getAssetDecimals = (
  assets: AssetsState,
  assetId: string
): number => {
  const asset = assets.assets[assetId];
  if (!asset) {
    console.error(`Asset with id ${assetId} not found`);
    return 6; // Default to 6 decimals as fallback
  }
  return asset.decimals || 6; // Fallback to 6 decimals if decimals property is missing
};
