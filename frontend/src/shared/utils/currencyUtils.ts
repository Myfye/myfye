export const getFiatCurrencySymbol = (
  fiatCurrency: "usd" | "euro" | "brl" | "mxn" | null | undefined
) => {
  if (!fiatCurrency) return null;
  switch (fiatCurrency) {
    case "brl": {
      return "R$";
    }
    case "mxn": {
      return "MX$";
    }
    case "usd": {
      return "$";
    }
    case "euro": {
      return "€";
    }
    default: {
      throw new Error("Invalid fiat currency type");
    }
  }
};

export const formatAmountWithCurrency = (
  amount: number,
  currency: string = "usd"
) =>
  new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
