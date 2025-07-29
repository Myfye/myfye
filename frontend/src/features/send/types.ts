import { AbstractedAsset, FiatCurrency } from "@/features/assets/types";
import { User } from "../users/users.types";

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
  user: User | null;
  presetAmount: PresetAmountOption;
}
