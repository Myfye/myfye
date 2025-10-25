export type FiatCurrency = "usd" | "brl" | "mxn" | "eur";

export type DepositFiatCurrency = Omit<FiatCurrency, "usd" | "eur">;
export type WithdrawFiatCurrency = Omit<FiatCurrency, "brl" | "mxn">;
export type SendFiatCurrency = Omit<FiatCurrency, "brl" | "mxn">;
