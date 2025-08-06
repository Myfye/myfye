import { Asset } from "@/features/assets/types";

export type WithdrawOnChainOverlay =
  | "withdrawOnChain"
  | "addressEntry"
  | "processingTransaction"
  | "selectAsset";

export interface WithdrawOnChainTransaction {
  id: string | null;
  status: "idle" | "success" | "fail";
  amount: number | null;
  formattedAmount: string;
  solAddress: string | null;
  assetId: Asset["id"] | null;
  fiatCurrency: "usd" | "euro";
  fee: number;
}

export type WithdrawOnChainModal = "selectToken";
