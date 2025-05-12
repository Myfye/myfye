import { AbstractedAsset, Asset } from "../assets/types";

export type SwapTransactionType = "buy" | "sell";

export type SwapTransactionStatus = "idle" | "signed" | "success" | "fail";

export interface SwapTransaction {
  buy: {
    amount: number | null;
    formattedAmount: string;
    abstractedAssetId: AbstractedAsset["id"] | null;
    assetId?: string;
    chain?: string;
  };
  sell: {
    amount: number | null;
    formattedAmount: string;
    abstractedAssetId: AbstractedAsset["id"] | null;
    assetId?: string;
    chain?: string;
  };
  fee: number | null;
  exchangeRate: number | null;
  status: SwapTransactionStatus;
  id: string | null;
  transactionType?: string;
  user_id: string | null;
  inputPublicKey: string | null;
  outputPublicKey: string | null;
}
