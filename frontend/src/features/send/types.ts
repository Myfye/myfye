import { AbstractedAsset, Asset, FiatCurrency } from "@/features/assets/types";
import { Contact } from "../contacts/types";

export type SendTransactionStatus = "idle" | "success" | "fail" | "minted";

export type PresetAmountOption = "10" | "50" | "100" | "max" | null;

export interface SendTransaction {
  id: string | null;
  status: SendTransactionStatus;
  abstractedAssetId: AbstractedAsset["id"] | null;
  amount: number | null;
  formattedAmount: string;
  fiatCurrency: FiatCurrency;
  fee: number | null;
  contact: Contact | null;
  presetAmount: PresetAmountOption;
}
