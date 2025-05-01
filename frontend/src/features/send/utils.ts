import { Asset, AssetsState } from "../../assets/types";

// Helper function to parse and format the amount
const getFormattedNumberFromString = (amount: string): string => {
  let parsed = parseFormattedAmount(amount);
  parsed = Math.floor(parsed * 100) / 100;
  return isNaN(parsed) ? "" : parsed.toLocaleString("en-EN");
};

export const updateFormattedAmount = (
  formattedAmount: string,
  input: string | number,
  replace?: boolean
): string => {
  // make sure input is a string
  input = input.toString();

  if (replace) {
    return getFormattedNumberFromString(input);
  }

  if (input === "delete") {
    if (formattedAmount === "0.") return "0";
    const [integer, decimal] = formattedAmount.split(".");
    const newAmount = formattedAmount.slice(0, -1);
    if (
      decimal &&
      (decimal[decimal.length - 1] === "0" ||
        decimal[decimal.length - 2] === "0")
    )
      return newAmount;
    let newStr = getFormattedNumberFromString(newAmount);
    if (newStr === "") newStr = "0";
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
  const [integer, decimal] = updatedAmount.split(".");
  if (decimal?.length >= 2) return integer + "." + `${decimal[0]}${decimal[1]}`;
  if (input === "0" && formattedAmount.includes(".")) {
    formattedAmount += "0";
    const [_, decimal] = formattedAmount.split(".");
    const [updatedAmountInteger, __] = updatedAmount.split(".");
    return updatedAmountInteger + "." + decimal;
  }
  return updatedAmount;
};

export const parseFormattedAmount = (formattedAmount: string) => {
  return parseFloat(formattedAmount.replace(/,/g, ""));
};

export const getUsdAmount = (
  assetId: Asset["id"] | null,
  assets: AssetsState,
  amount: number | null
) => {
  if (!amount) return 0;
  if (!assetId) throw new Error("Invalid asset id");
  return amount * assets.assets[assetId].exchangeRateUSD;
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

export const updateFormattedGhostAmount = (formattedGhostAmount: string) => {
  switch (formattedGhostAmount.length) {
    case 0:
      return "0";
    default:
      return formattedGhostAmount;
  }
};
