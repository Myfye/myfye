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
  presetAmount: string | null;
  bankInfo: {
    id: string | null;
    accountName: string | null;
    code: string | null;
    speiClabe: string | null;
    beneficiaryName: string | null;
  };
  payout: {
    id: null;
    contract: {
      blindpayContractAddress: string | null;
      address: string | null;
      amount: number | null;
    };
  };
}

export type WithdrawOffChainOverlay =
  | "withdrawOffChain"
  | "bankPicker"
  | "bankInput"
  | "selectAmount"
  | "confirmTransaction"
  | "processingTransaction"
  | "selectAsset";

export interface BankInfo {
  id: string;
  code: string;
  label: string;
  icon: string;
}

export type PresetAmountOption = "10" | "50" | "100" | "max" | null;
