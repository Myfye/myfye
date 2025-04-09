import { Asset } from "../wallet/assets/types";

export type SwapTransactionType = "buy" | "sell";

export type SwapTransactionStatus = "idle" | "signed" | "success" | "fail";

export interface SwapTransaction {
  buy: {
    amount: number | null;
    formattedAmount: string;
    assetId: Asset["id"] | null;
  };
  sell: {
    amount: number | null;
    formattedAmount: string;
    assetId: Asset["id"] | null;
  };
  fee: number | null;
  exchangeRate: number | null;
  status: SwapTransactionStatus;
  id: string | null;
}
