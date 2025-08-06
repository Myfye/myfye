import { Asset } from "@/features/assets/types";

export interface WithdrawOffChainTransaction {
  id: string | null;
  status: "idle" | "success" | "fail";
  amount: number | null;
  formattedAmount: string;
  solAddress: string | null;
  assetId: Asset["id"] | null;
  fiatCurrency: "usd" | "euro";
  fee: number;
}

export type WithdrawOffChainOverlay = "withdrawOffChain" | "test" | "test2";
