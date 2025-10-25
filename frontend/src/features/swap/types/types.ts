import { Asset } from "../../assets/types/types";

export type SwapTransactionType = "buy" | "sell";

export type SwapTransactionStatus = "idle" | "signed" | "success" | "fail";

export interface SwapTransaction {
  buy: {
    amount: number | null;
    formattedAmount: string;
    assetId: Asset["id"] | null;
    assetId?: string;
    chain?: string;
  };
  sell: {
    amount: number | null;
    formattedAmount: string;
    aassetId: Asset["id"] | null;
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
