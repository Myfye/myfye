import { AbstractedAsset, Asset } from "../wallet/assets/types";

export type SwapTransactionType = "buy" | "sell";

export type SwapTransactionStatus = "idle" | "signed" | "success" | "fail";

export interface SwapTransaction {
  buy: {
    amount: number | null;
    formattedAmount: string;
    abstractedAssetId: AbstractedAsset["id"] | null;
  };
  sell: {
    amount: number | null;
    formattedAmount: string;
    abstractedAssetId: AbstractedAsset["id"] | null;
  };
  fee: number | null;
  exchangeRate: number | null;
  status: SwapTransactionStatus;
  id: string | null;
}
