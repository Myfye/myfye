import { Asset, FiatCurrency } from "@/features/assets/types/types";
import { User } from "../../users/types/users.types";

export type SendTransactionStatus = "idle" | "success" | "fail" | "minted";

export type PresetAmountOption = "10" | "50" | "100" | "max" | null;

export interface SendTransaction {
  id: string | null;
  status: SendTransactionStatus;
  assetId: Asset["id"] | null;
  amount: number | null;
  formattedAmount: string;
  fiatCurrency: FiatCurrency;
  fee: number | null;
  user: User | null;
  presetAmount: PresetAmountOption;
}
