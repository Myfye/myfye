import { Asset, AssetsState } from "../assets/types";

// Helper function to parse and format the amount
const getFormattedNumberFromString = (amount: string): string => {
  const parsed = parseFormattedAmount(amount);
  return isNaN(parsed) ? "" : parsed.toString();
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
    const newAmount = formattedAmount.slice(0, -1);
    return newAmount === "" ? "" : newAmount;
  }

  if (input === ".") {
    if (formattedAmount === "") return "0.";
    return formattedAmount.includes(".")
      ? formattedAmount
      : formattedAmount + ".";
  }

  if (input === "0" && formattedAmount === "") return "0";
  if (formattedAmount === "0" && input !== ".") return input; // Replace leading zero with input

  return formattedAmount + input;
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
  if (!formattedAmount || formattedAmount === "") return NaN;
  // Remove any commas but preserve the exact string representation
  const cleanedAmount = formattedAmount.replace(/,/g, "");
  // Use Number instead of parseFloat to maintain precision
  return Number(cleanedAmount);
};

export const getExchangeRate = (
  assetId: Asset["id"] | null,
  assets: AssetsState
) => {
  if (!assetId) throw new Error("Invalid asset id");
  
  const asset = assets.assets[assetId];
  if (!asset) {
    console.error(`Asset with id ${assetId} not found`);
    return 0;
  }
  
  return asset.exchangeRateUSD;
};

export const getUsdAmount = (
  assetId: Asset["id"] | null,
  assets: AssetsState,
  amount: number | null
) => {
  if (!amount) return 0;
  if (!assetId) {
    console.error("invalid asset id");
    return 0;
  }
  // since only usdc is available for now, return exchange rate for first result... normally this would be based on the combined amounts times their respective exchange rates
  const exchangeRateUSD = getExchangeRate(assetId, assets);
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
  buyAssetId,
  sellAssetId,
}: {
  assets: AssetsState;
  buyAssetId: Asset["id"] | null;
  sellAssetId: Asset["id"] | null;
}) => {
  if (!buyAssetId || !sellAssetId) return null;

  const buyExchangeRate = getExchangeRate(buyAssetId, assets);
  const sellExchangeRate = getExchangeRate(sellAssetId, assets);

  return sellExchangeRate / buyExchangeRate;
};
