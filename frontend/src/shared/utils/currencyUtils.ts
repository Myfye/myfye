export const getFiatCurrencySymbol = (fiatCurrency: "usd" | "euro") => {
  switch (fiatCurrency) {
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
