import { AbstractedAsset, Asset, AssetsState } from "../wallet/assets/types";

// Helper function to parse and format the amount
const getFormattedNumberFromString = (amount: string): string => {
  const parsed = parseFormattedAmount(amount);
  return isNaN(parsed)
    ? ""
    : parsed.toLocaleString("en-EN", { maximumFractionDigits: 8 });
};

export const updateFormattedAmount = (
  formattedAmount: string,
  input: string | number,
  replace?: boolean
) => {
  // make sure input is a string
  input = input.toString();

  if (replace) {
    return getFormattedNumberFromString(input);
  }

  if (input === "delete") {
    if (formattedAmount === "0.") return "";
    const [integer, decimal] = formattedAmount.split(".");
    const newAmount = formattedAmount.slice(0, -1);
    if (
      decimal &&
      (decimal[decimal.length - 1] === "0" ||
        decimal[decimal.length - 2] === "0")
    )
      return newAmount;
    const newStr = getFormattedNumberFromString(newAmount);
    return newStr;
  }

  if (input === ".") {
    if (formattedAmount === "") return "0.";
    return formattedAmount.includes(".")
      ? formattedAmount
      : formattedAmount + ".";
  }

  if (input === "0" && formattedAmount === "") return "0.";
  if (formattedAmount === "0") return input; // Replace leading zero with input

  const updatedAmount = getFormattedNumberFromString(formattedAmount + input);
  if (input === "0" && formattedAmount.includes(".")) {
    formattedAmount += "0";
    const [_, decimal] = formattedAmount.split(".");
    const [updatedAmountInteger, __] = updatedAmount.split(".");
    return updatedAmountInteger + "." + decimal;
  }
  return updatedAmount;
};

export const updateFormattedGhostAmount = (formattedGhostAmount: string) => {
  switch (formattedGhostAmount.length) {
    case 0:
      return "0";
    default:
      return formattedGhostAmount;
  }
};

export const parseFormattedAmount = (formattedAmount: string) => {
  return parseFloat(formattedAmount.replace(/,/g, ""));
};

export const getExchangeRate = (
  abstractedAssetId: AbstractedAsset["id"] | null,
  assets: AssetsState
) => {
  if (!abstractedAssetId) throw new Error("Invalid asset id");
  // since only usdc is available for now, return exchange rate for first result... normally this would be based on the combined amounts times their respective exchange rates
  const exchangeRateUSD = assets.abstractedAssetIds
    .map((id) => assets.abstractedAssets[id])
    .filter((asset) => asset.id === abstractedAssetId)
    .map((asset) => {
      const usdRateAsset = asset.assetIds[0];
      const _asset = assets.assets[usdRateAsset];
      return _asset.exchangeRateUSD;
    })[0];
  return exchangeRateUSD;
};

export const getUsdAmount = (
  abstractedAssetId: AbstractedAsset["id"] | null,
  assets: AssetsState,
  amount: number | null
) => {
  if (!amount) return 0;
  if (!abstractedAssetId) {
    console.error("invalid asset id");
    return 0;
  }
  // since only usdc is available for now, return exchange rate for first result... normally this would be based on the combined amounts times their respective exchange rates
  const exchangeRateUSD = getExchangeRate(abstractedAssetId, assets);
  return amount * exchangeRateUSD;
};

export const formatUsdAmount = (amount: number | null) =>
  amount
    ? new Intl.NumberFormat("en-EN", {
        currency: "usd",
        style: "currency",
        maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      }).format(amount)
    : "$0";

export const getAssetBalance = (assets: AssetsState, assetId: Asset["id"]) => {
  return assets.assets[assetId].balance;
};

export const calculateExchangeRate = ({
  assets,
  buyAbstractedAssetId,
  sellAbstractedAssetId,
}: {
  assets: AssetsState;
  buyAbstractedAssetId: AbstractedAsset["id"] | null;
  sellAbstractedAssetId: AbstractedAsset["id"] | null;
}) => {
  if (!buyAbstractedAssetId || !sellAbstractedAssetId) return null;

  const buyExchangeRate = getExchangeRate(buyAbstractedAssetId, assets);
  const sellExchangeRate = getExchangeRate(sellAbstractedAssetId, assets);

  return sellExchangeRate / buyExchangeRate;
};
