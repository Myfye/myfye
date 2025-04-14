import { AbstractedAsset, Asset } from "@/features/wallet/assets/types";

export type SendTransactionStatus = "idle" | "success" | "fail" | "minted";

export interface SendTransaction {
  id: string | null;
  amount: number | null;
  formattedAmount: string;
  abstractedAssetId: AbstractedAsset["id"] | null;
  fee: number | null;
  status: SendTransactionStatus;
  contact: Contact | null;
}

export interface Contact {
  id: string;
  label: string;
  wallet_address: string;
}
